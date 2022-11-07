import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export default class AuthService{
    url: string = "http://localhost:4000";

    constructor(private _http: HttpClient){}

    _register(datas: {}){
        return this._http.post(`${this.url}/user/register`, datas);
    }

    _login(datas: {}){
        return this._http.post(`${this.url}/user/login`, datas);
    }
}