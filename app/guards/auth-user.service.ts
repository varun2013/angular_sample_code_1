import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthUserService {

  constructor(public myRoute: Router) { }

  setToken(token: string) {
    console.log("from serveuce")
    if(token){
      localStorage.setItem("LoggedInUser", token)
    }
  }
  
  setData(key:string, data: string) {
    localStorage.setItem(key, JSON.stringify(data))
  }

  getToken() {
    return localStorage.getItem("LoggedInUser")
  }

  getData(key) {
    const data = localStorage.getItem(key)
    return JSON.parse(data)
  }

  isLoggednIn() {
    //console.log(this.getToken() !== null)
    return this.getToken() !== null;
  }
  
}
