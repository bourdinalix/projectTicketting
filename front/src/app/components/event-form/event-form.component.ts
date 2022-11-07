import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  constructor(private _fb: FormBuilder) {}
  eventForm!: any;

  ngOnInit(): void {
    this.eventForm = this._fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      organizer: ['', Validators.required],
      price: ['', Validators.required],
      maxTicket: ['', Validators.required],
      leftTicket: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      style: ['', Validators.required],
    });
  }

  _onSubmit(){
    console.log("create event");
  }

}
