import { Component } from '@angular/core';
import { FormGroup,FormControl,FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonserviceService } from '../commonservice.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent {
  form!:FormGroup;
  submitted:boolean = false;
  regionData:any;
  countryData = [];
  allData = []

  constructor(private fb:FormBuilder,private commonService:CommonserviceService){}

  ngOnInit(){
    this.form = this.fb.group({
      title : new FormControl('',Validators.required),
      email : new FormControl('',[Validators.email,Validators.required]),
      region : new FormControl('',Validators.required),
      country : new FormControl('',Validators.required)
    })

    this.getregionData()
  }

  getregionData(){
    this.commonService.showLoader = true
    this.commonService.getRegionData().subscribe((res)=>{
      this.commonService.showLoader = false
      if(res && res.data){
        let data = res.data
        this.allData = Object.values(data);
        let uniqueRegions = [...new Set(this.allData.map(item => item['region']))];
        this.regionData = uniqueRegions.map(region => ({ region }));
      }
    }, error => {
      this.commonService.showLoader = false
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onChangeRegion(event:any){
    this.countryData =  this.allData.filter((val:any)=>val.region === event.value.region);
  }

  resetForm(){
    this.form.reset();
    this.submitted = false
  }

  createCustomer(){
    this.submitted = true;
    if(!this.form.valid){
      return
    }
    this.commonService.showLoader = true
    let obj = {
      title : this.form.value.title,
      email : this.form.value.email,
      region : this.form.value.country.region,
      country : this.form.value.country.country
    }
    try {
    const customerData = localStorage.getItem('customer-data');
    const parsedData = customerData ? JSON.parse(customerData) : [];
    parsedData.push(obj);
    localStorage.setItem('customer-data', JSON.stringify(parsedData));
    this.commonService.sendMessage('data emited');
    this.resetForm()
    this.commonService.showCustomer = false
    this.commonService.showPin = true;
    this.commonService.showLoader = false
    }catch(e){
      alert('Local Storage is Full empty it.')
    }
  }
}
