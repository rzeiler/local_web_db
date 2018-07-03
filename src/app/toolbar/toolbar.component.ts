import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input("toolbarTitle") toolbarTitle: string;
  @Input("toolbarRetrunLink") toolbarRetrunLink: any;
  @Input("toolbarDeleteMatBadge") toolbarDeleteMatBadge: number = 0;
  @Output() voted = new EventEmitter();


  hasDeletFunction: boolean = true;

  constructor() {

   }

  ngOnInit() {
    this.hasDeletFunction = this.voted.observers.length > 0;
  }

  vote() {
    this.voted.emit(true);
  }

}
