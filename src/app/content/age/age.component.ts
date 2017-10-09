import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-age',
  templateUrl: './age.component.html',
  styleUrls: ['./age.component.scss']
})
export class AgeComponent implements OnInit {
  data: any = {};
  constructor(private dataService: DataService) { }
  updateAge(age) {
    this.data.age = age;
    if (this.data.gender === 'boy') {
      if (age === 'newborn') {
        this.data.current_class = 'nBoy';
      }else if (age === 'baby') {
        this.data.current_class = 'bBoy';
      }else if (age === 'boy') {
        this.data.current_class = 'boy';
      }
    }else {
      if (age === 'newborn') {
        this.data.current_class = 'nGirl';
      }else if (age === 'baby') {
        this.data.current_class = 'bGirl';
      }else if (age === 'boy') {
        this.data.current_class = 'girl';
      }
    }
    this.dataService.pushData(this.data);
  }
  ngOnInit() {
    this.data = this.dataService.getData();
  }

}
