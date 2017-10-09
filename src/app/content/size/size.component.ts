import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit {
  data: any = {};
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.data = this.dataService.getData();
  }

}
