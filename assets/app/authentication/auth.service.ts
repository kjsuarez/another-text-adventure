import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
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

  constructor(private http: Http, private http_client: HttpClient) {}

  const httpOptions = {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.getToken();
      }



  getToken(){
    return localStorage.getItem('token')
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
        this.token = token;
        if(token){
          this.user_is_authenticated = true;
          this.authStatusListener.next(true)
        }
        return response.json()
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  logout(){
    this.token = null;
    this.user_is_authenticated = false;
    this.authStatusListener.next(false);
  }

  getUser(){
    const id = this.getId()

    return this.http_client.get<User>('http://localhost:3000/user-backend/' + id)
      .map((response: Response) => {
        return response.obj
      });


  }

}
