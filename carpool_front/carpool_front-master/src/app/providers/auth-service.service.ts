import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  // private isLoggedIn = false;

  constructor() {}

  // Login a user
  // Normally make a server request and store
  // e.g. the auth token
  login(data): void {
    localStorage.setItem('userid', data.userid);
    localStorage.setItem('usertype', data.usertype);
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
  }

  // Logout a user, destroy token and remove
  // every information related to a user
  logout(): void {
    localStorage.removeItem('userid');
    localStorage.removeItem('usertype');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  // Returns whether the user is currently authenticated
  // Could check if current token is still valid
  authenticated(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
}
