import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import SwiperCore, { SwiperOptions, Pagination } from 'swiper';
import EventService from 'src/app/services/event-service';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-event-section',
  templateUrl: './event-section.component.html',
  styleUrls: ['./event-section.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EventSectionComponent implements OnInit {
  events$: Observable<any> = this._event._getAllEvents();
  eventsParis$: Observable<any> = this._event._getEventParis();
  eventsMusic$: Observable<any> = this._event._getEventMusic();
  eventsSport$: Observable<any> = this._event._getEventSport();  

  config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    pagination: { clickable: true },
  };

  constructor(private _event: EventService) {}

  ngOnInit(): void {
    // this.events$.subscribe((event) => {
    //   console.log(event);
    // })
  }

 
}
