import { CreatedRide } from 'src/app/httpObjects/createdride';
import { Constant } from './../constants/constant';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../httpObjects/user';
import { DriverInfo } from '../httpObjects/driverinfo';
import { RequestedRide } from '../httpObjects/requestedride';
import { OneCreateRide } from '../httpObjects/oneCreatedRide';
import { OneAcceptedRide } from '../httpObjects/oneAcceptedRide';
import { AcceptedRide } from '../httpObjects/acceptedride';


declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  channel;

  public requestedRideUrl = Constant.apiserver + 'user/requested_ride';

  public registerDriverUrl = Constant.apiserver + 'driver/register';
  public createRideUrl = Constant.apiserver + 'driver/create_ride';
  public deleteCreateRideUrl = Constant.apiserver + 'driver/delete_create_ride';
  public driverCreatedRideUrl = Constant.apiserver + 'driver/created_ride/' + localStorage.getItem('userid');
  public driverAcceptedRideUrl = Constant.apiserver + 'driver/accepted_ride/' + localStorage.getItem('userid');
  public acceptRideUrl = Constant.apiserver + 'driver/accept_ride';
  public deleteAcceptRideUrl = Constant.apiserver + 'driver/delete_accept_ride';

  public driverProfileUrl = Constant.apiserver + `driver/${localStorage.getItem('userid')}`;


  constructor(public http: HttpClient) {

    Pusher.logToConsole = true;

    const pusher = new Pusher('ba4379b5d1d63ad32c26', {
      cluster: 'ap2',
      forceTLS: true
    });

    this.channel = pusher.subscribe('driver');
  }

  public init() {
    return this.channel;
  }

  getRequestRide(): Observable<RequestedRide> {
    return this.http.get<RequestedRide>(this.requestedRideUrl);
  }

  registerDriver(body): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json'
      }),
    };
    return this.http.post<User>(this.registerDriverUrl, body, httpOptions);
  }

  driverProfile(): Observable<DriverInfo> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.get<DriverInfo>(this.driverProfileUrl, httpOptions);
  }

  createRide(body): Observable<CreatedRide>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.post<CreatedRide>(this.createRideUrl, body, httpOptions);
  }

  deleteCreateRide(body): Observable<CreatedRide>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.post<CreatedRide>(this.deleteCreateRideUrl, body, httpOptions);
  }

  DriverCreatedRide(): Observable<OneCreateRide> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.get<OneCreateRide>(this.driverCreatedRideUrl, httpOptions);
  }

  DriverAcceptedRide(): Observable<OneAcceptedRide> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': `bearer ${localStorage.getItem('token')}`
      }),
    };
    return this.http.get<OneAcceptedRide>(this.driverAcceptedRideUrl, httpOptions);
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
    return this.http.post<AcceptedRide>(this.deleteAcceptRideUrl, body, httpOptions)
  }
}
