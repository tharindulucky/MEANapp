import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import { AuthService} from './auth.service';
import {FlashMessagesService} from "angular2-flash-messages";

@Injectable()
export class AdService {

  options;
  domain = this.authService.domain;

  constructor(private authService: AuthService, private http: Http) { }

  createAuthHeaders(){
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  saveAd(ad){
    this.createAuthHeaders();
    console.log(this.authService);
    return this.http.post(this.domain + '/ads/new',ad, this.options).map(res => res.json());
  }

}
