import { Component, OnInit, Input } from '@angular/core';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class NameComponent implements OnInit {
  data: any = {};
  constructor(private dataService: DataService) { }
  updateName() {
    this.dataService.pushData(this.data);
  }
  ngOnInit() {
    this.data = this.dataService.getData();
  }

}
