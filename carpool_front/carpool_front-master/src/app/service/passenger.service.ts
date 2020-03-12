import { AcceptedRide } from './../httpObjects/acceptedride';
import { OneRequestRide } from './../httpObjects/oneRequestedRide';
import { CreatedRide } from './../httpObjects/createdride';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from './../constants/constant';
import { Observable } from 'rxjs';
import { User } from '../httpObjects/user';
import { PassengerInfo } from '../httpObjects/passengerInfo';
import { RequestedRide } from '../httpObjects/requestedride';
import { OneAcceptedRide } from '../httpObjects/oneAcceptedRide';


declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class PassengerService {

  channel;

  public createdRideUrl = Constant.apiserver + 'user/created_ride';

  public registerPassengerUrl = Constant.apiserver + 'passenger/register';
  public requestRideUrl = Constant.apiserver + 'passenger/request_ride';
  public deleteRequestedRideUrl = Constant.apiserver + 'passenger/delete_request_ride';
  public passengerRequestedRideUrl = Constant.apiserver + 'passenger/requested_ride/' + localStorage.getItem('userid');
  public passengerAcceptedRideUrl = Constant.apiserver + 'passenger/accepted_ride/' + localStorage.getItem('userid');
  public acceptRideUrl = Constant.apiserver + 'passenger/accept_ride';
  public deleteAcceptRideUrl = Constant.apiserver + 'passenger/delete_accept_ride';

  public passengerProfileUrl = Constant.apiserver + `passenger/${localStorage.getItem('userid')}`;

  constructor(public http: HttpClient) {

    Pusher.logToConsole = true;

    const pusher = new Pusher('ba4379b5d1d63ad32c26', {
      cluster: 'ap2',
      forceTLS: true
    });

    this.channel = pusher.subscribe('passenger');
  }

  public init() {
    return this.channel;
  }

  getCreatedRide(): Observable<CreatedRide> {
    return this.http.get<CreatedRide>(this.createdRideUrl);
  }

  registerPassenger(body): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json'
      }),
    };
    return this.http.post<User>(this.registerPassengerUrl, body, httpOptions);
  }

  passengerProfile(): Observable<PassengerInfo> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.get<PassengerInfo>(this.passengerProfileUrl, httpOptions);
  }

  requestRide(body): Observable<RequestedRide>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.post<RequestedRide>(this.requestRideUrl, body, httpOptions);
  }

  deleteRequestRide(body): Observable<RequestedRide>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.post<CreatedRide>(this.deleteRequestedRideUrl, body, httpOptions);
  }

  PassengerRequestedRide(): Observable<OneRequestRide> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.get<OneRequestRide>(this.passengerRequestedRideUrl, httpOptions);
  }

  PassengerAcceptedRide(): Observable<OneAcceptedRide> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.get<OneAcceptedRide>(this.passengerAcceptedRideUrl, httpOptions);
  }

  acceptRide(body): Observable<AcceptedRide> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.post<AcceptedRide>(this.acceptRideUrl, body, httpOptions);
  }

  deleteAcceptRide(body): Observable<AcceptedRide> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.post<AcceptedRide>(this.deleteAcceptRideUrl, body, httpOptions);
  }
}
