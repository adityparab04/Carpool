import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Constant } from './../constants/constant';
import { User } from '../httpObjects/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public loginUrl = Constant.apiserver + 'user/login';

  constructor(
    private http: HttpClient,
  ) { }

  userLogin(body): Observable<User>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json'
      }),
    };
    return this.http.post<User>(this.loginUrl, JSON.stringify(body), httpOptions);
  }
}
