import { Component } from '@angular/core';
import { FormGroup,FormControl,FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonserviceService } from '../commonservice.service';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-create-pin',
  templateUrl: './create-pin.component.html',
  styleUrls: ['./create-pin.component.scss']
})
export class CreatePinComponent {
  form!:FormGroup;
  submitted:boolean = false;
  uploader!:FileUploader;
  imageUrl: string | null = null;
  isDragOver = false;
  customers = []
  private subjectMessageService:any;

  constructor(private fb:FormBuilder,private commonService:CommonserviceService){}

  ngOnInit(){
    this.form = this.fb.group({
      title : new FormControl('',Validators.required),
      collaboratory : new FormControl('',Validators.required),
      privacy : new FormControl('0')
    })

    this.getCustomerData();

    if(this.subjectMessageService){
      this.subjectMessageService.unsubscribe();
    }
    this.subjectMessageService =  this.commonService.subjectMessageObservable
                                    .subscribe((message) => {
                                      if(message == 'data emited'){
                                        this.getCustomerData()
                                      }
                                    });
  }

  getCustomerData(){
    this.commonService.showLoader = true;
    const customerData = localStorage.getItem('customer-data');
    if(customerData){
      this.customers = JSON.parse(customerData)
    }
    this.commonService.showLoader = false;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.processFile(file);
  }

  onFileDropped(event: any): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer.files[0];
    this.processFile(file);
  }

  processFile(file: File): void {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: any): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: any): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  resetForm(){
    this.form.reset();
    this.submitted = false;
    this.imageUrl = null
  }

  createPin(){
    this.submitted = true;
    if(!this.form.valid  || !this.imageUrl){
      return
    }
    this.commonService.showLoader = true
    let customers = this.form.value.collaboratory.map((val:any)=>val.title)
    let obj = {
      title : this.form.value.title,
      collaboratory : customers,
      privacy : this.form.value.privacy,
      image : this.imageUrl
    }
    this.commonService.showLoader = false
    try {
    const pinData = localStorage.getItem('pin-data');
    const parsedData = pinData ? JSON.parse(pinData) : [];
    parsedData.push(obj);
    localStorage.setItem('pin-data', JSON.stringify(parsedData));
    this.commonService.sendMessage('list emited');
    this.resetForm()
    }catch(e){
      alert('Local Storage is Full empty it.')
    }
  }

  ngOnDestroy(){
    this.subjectMessageService.unsubscribe()
  }
}

