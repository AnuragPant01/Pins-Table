import { Component } from '@angular/core';
import { CommonserviceService } from './commonservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public commonService: CommonserviceService) {}

  btnClick(no:number){
    if(no){
      this.commonService.showPin = true;
      this.commonService.showCustomer = false
    }else{
      this.commonService.showCustomer = true;
      this.commonService.showPin = false
    }
  }
}
