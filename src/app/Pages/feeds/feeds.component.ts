import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {
  public show: boolean = true;
  public job:boolean = true;
  constructor() { }

  ngOnInit() {
  }
  toggle() {
    this.show = !this.show;
  }
  jobToogle() {
    this.job = !this.job;
  }

}
