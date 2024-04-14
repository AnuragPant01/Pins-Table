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
    this.commonService.showPin = !!no;
    this.commonService.showCustomer = !no;
  }
}
