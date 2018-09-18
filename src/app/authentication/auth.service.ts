import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Router } from '@angular/router';
import { map } from "rxjs/operators";
import {Subject} from 'rxjs';
import { Observable, of } from 'rxjs';
import { User } from './user.model';
import { environment } from "../../environments/environment";
//const jwt = require('jsonwebtoken');

const BACKEND_URL = environment.apiUrl + "/user-backend/";

@Injectable({
  providedIn: 'root'
})

export class AuthService{

  private token: string
  private authStatusListener = new Subject<boolean>()
  private user_is_authenticated = false;
  private tokenTimer: any;
  constructor(private http: Http, private httpClient: HttpClient, private router: Router) {}

  httpOptions = {
    'Content-Type': 'application/json',
    'authorization': 'Bearer ' + this.getToken()
  }

  getToken(){
    const token = localStorage.getItem('token')
    if(token){
      return token
    }
  }

  private getAuthData(){
    const token = localStorage.getItem('token')
    const experationDate = localStorage.getItem('experation')
    if(!token || !experationDate){
      return;
    }
    return {
      token: token,
      experationDate: new Date(experationDate),
      userId: localStorage.getItem('userId')
    }
  }

  autoAuthUser(){
    const authInfo = this.getAuthData()
    if(!authInfo){
      return;
    }
    const now = new Date();
    const is_in_future = authInfo.experationDate > now
    const time_to_experation = authInfo.experationDate.getTime() - now.getTime()
    if(time_to_experation > 0){
      this.setAuthTimer(time_to_experation / 1000)
      this.token = authInfo.token
      this.user_is_authenticated = true
      this.authStatusListener.next(true)
    }
  }

  getId(){
    var token = localStorage.getItem('token')
    if(token){
      return localStorage.getItem('userId')
    }
  }

  getAuthStatus(){
    return  this.user_is_authenticated
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getUsersGames(){
    const body = '';
    return this.httpClient.post(BACKEND_URL + "games/", body, {headers: this.httpOptions})
      .pipe(
        map((response: any) => {
          console.log("what was returned:")
          console.log(response.obj)
          return response.obj
        })
      )
      //.catch((error: Response) => Observable.throw(error));
  }

  postUser(user){
    const body = JSON.stringify(user);
    console.log("the body service sends to backend:")
    console.log(body)
    return this.httpClient.post(BACKEND_URL + "signup", body, {headers: this.httpOptions})
    .pipe(
      map((response: any) => {
        console.log("inside service, returned response looks like this:")
        console.log(response)
        return response
      })
    )
  }

  loginUser(user){
    const body = JSON.stringify(user);
    console.log("body in login service:")
    console.log(body)
    return this.httpClient.post(BACKEND_URL + "login", body, {headers: this.httpOptions})
    .pipe(
      map((response: any) => {
        console.log("response from login backend:")
        console.log(response)
        const token = response.token
        const user_games = response.user_games
        const experation_duration = response.expiresIn
        this.token = token;
        if(token){
          this.setAuthTimer(experation_duration)
          this.user_is_authenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const experationDate = new Date(now.getTime() + experation_duration * 1000)
          this.saveAuthData(token, experationDate, response.user_id)
          this.router.navigateByUrl('/');
        }
        return response
      })
    )

      //.catch((error: Response) => Observable.throw(error));
  }


  private saveAuthData(token, experationDate, userId){
    localStorage.setItem('token', token);
    localStorage.setItem('experation', experationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthStorage(){
    localStorage.removeItem('token')
    localStorage.removeItem('experation')
  }

  logout(){
    this.token = null;
    this.user_is_authenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer)
    this.clearAuthStorage()

  }

  setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      console.log("inside timer")
      this.logout();
    }, duration * 1000 );
  }

}
