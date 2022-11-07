import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-events',
  templateUrl: './create-events.component.html',
  styleUrls: ['./create-events.component.scss']
})
export class CreateEventsComponent implements OnInit {

  constructor() {}
  title: string = "Lorem ipsum dolores malfoy";
  labelBtn: string = "Voir les événements";

  ngOnInit(): void {}

}
