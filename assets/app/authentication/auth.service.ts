import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Router } from '@angular/router';
import {Subject} from 'rxjs';
import { Observable, of } from 'rxjs';
import { User } from './user.model'
const jwt = require('jsonwebtoken');


@Injectable({
  providedIn: 'root'
})

export class AuthService{

  private token: string
  private authStatusListener = new Subject<boolean>()
  private user_is_authenticated = false;
  private tokenTimer: any;
  constructor(private http: Http, private http_client: HttpClient, private router: Router) {}

  const httpOptions = {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.getToken();
      }



  private getToken(){
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
      experationDate: new Date(experationDate)
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
      return jwt.verify(token, "secret_secret_extra_super_secret").userId
    }
  }

  getAuthStatus(){
    return  this.user_is_authenticated
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  postUser(user){
    const body = JSON.stringify(user);
    return this.http.post('http://localhost:3000/user-backend/signup', body, {headers: this.httpOptions})
    .map((response: Response) => response.json())
    .catch((error: Response) => Observable.throw(error.json()));
  }

  loginUser(user){
    const body = JSON.stringify(user);
    return this.http.post('http://localhost:3000/user-backend/login', body, {headers: this.httpOptions})
      .map((response: Response) => {
        const token = response.json().token
        const experation_duration = response.json().expiresIn
        this.token = token;
        if(token){
          this.setAuthTimer(experation_duration)
          this.user_is_authenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const experationDate = new Date(now.getTime() + experation_duration * 1000)
          this.saveAuthData(token, experationDate)
          this.router.navigateByUrl('/');
        }
        return response.json()
      })
      .catch((error: Response) => Observable.throw(error);
  }

  private saveAuthData(token, experationDate){
    localStorage.setItem('token', token);
    localStorage.setItem('experation', experationDate.toISOString());
  }

  private clearAuthStorage(){
    localStorage.removeItem('token')
    localStorage.removeItem('experation ')
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


  getUser(){
    const id = this.getId()

    return this.http_client.get<User>('http://localhost:3000/user-backend/' + id)
      .map((response: Response) => {
        return response.obj
      });


  }

}
