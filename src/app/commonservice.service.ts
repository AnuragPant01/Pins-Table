import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  showLoader!: boolean;
  showCustomer:boolean = true;
  showPin:boolean = false;
  private _subjectMessageSource = new Subject<string>();
  subjectMessageObservable = this._subjectMessageSource.asObservable();

constructor(private http: HttpClient) {}

public responseFormat(res: any, index: number) {
  if (!(res['status-code'] === 200)) {
    throw new Error(res.message);
  }
  else
    return res;
}

getRegionData() : Observable<any>{
  return this.http.get('https://api.first.org/data/v1/countries').pipe(map(this.responseFormat));
}

sendMessage(message : string){
  this._subjectMessageSource.next(message);
}
};