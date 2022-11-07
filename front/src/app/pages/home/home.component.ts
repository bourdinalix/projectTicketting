import { Component, OnInit } from '@angular/core';
import EventService from 'src/app/services/event-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _event: EventService) {}
  title: string = "Billets sécurisés grâce a la blockchain";
  labelBtn: string = "Voir les événements";

  ngOnInit(): void {}

}