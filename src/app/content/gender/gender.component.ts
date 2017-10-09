import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss'],
  animations: []
})
export class GenderComponent implements OnInit {
  constructor(private dataService: DataService) {
  }

  data: any = {};

  updateGender(gender) {
    this.data.gender = gender;
    this.data.current_class = gender;
    this.dataService.pushData(this.data);
  }

  ngOnInit() {
    this.data = this.dataService.getData();
  }
}
