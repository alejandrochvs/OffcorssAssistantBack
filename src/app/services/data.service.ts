import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class DataService {
  constructor(private http: |Http) {

  }
  data: any = {};
  getData() {
    this.data = JSON.parse(localStorage.data) || this.data;
    return this.data;
  }
  pushData(data) {
    this.data = data;
    localStorage.data = JSON.stringify(this.data);
    return this.data;
  }
}
