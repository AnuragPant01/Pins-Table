import { Component } from '@angular/core';
import { CommonserviceService } from '../commonservice.service';
import { SortEvent } from 'primeng/api';
import { Customer,Representative } from '../interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  pinsList!: Customer[];

  representatives!: Representative[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  showCustomer:boolean = false
  showPin:boolean = false
  subjectMessageService:any

  constructor(public commonService: CommonserviceService) {}

  ngOnInit() {
    this.getPinData()

    if(this.subjectMessageService){
      this.subjectMessageService.unsubscribe();
    }
    this.subjectMessageService =  this.commonService.subjectMessageObservable
                                    .subscribe((message) => {
                                      if(message == 'list emited'){
                                        this.getPinData()
                                      }
                                    });
  }

  getPinData(){
    this.commonService.showLoader = true;
    const tableData = localStorage.getItem('pin-data');
    if(tableData){
      this.pinsList = JSON.parse(tableData)
      console.log(this.pinsList)
    }
    this.commonService.showLoader = false;
  }

  ngOnDestroy(){
    this.subjectMessageService.unsubscribe();
  }
}
