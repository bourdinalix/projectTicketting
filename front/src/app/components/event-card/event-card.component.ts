import { Component, Input, OnInit } from '@angular/core';
import EventService from 'src/app/services/event-service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {

  constructor(private _event: EventService) {}
  @Input() event: any = {};

  ngOnInit(): void {}

}
