import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export default class EventService{
    url: string = "http://localhost:4000";

    constructor(private _http: HttpClient){}

    /**
     * @returns All
    */

    _getAllEvents(){
        return this._http.get(`${this.url}/event`);
    }

    _getAllStyles(){
        return this._http.get(`${this.url}/event/styles`);
    }

    _getAllLocations(){
        return this._http.get(`${this.url}/event/locations`);
    }

    /**
     * Style
     * @returns musique
     */

    _getEventMusic(){
        return this._http.get(`${this.url}/event?style=musique`);
    }

    /**
     * Style
     * @returns msport
     */

    _getEventSport(){
        return this._http.get(`${this.url}/event?style=sport`);
    }

    /**
     * location
     * @returns paris
     */

    _getEventParis(){
        return this._http.get(`${this.url}/event?location=paris`);
    }
}