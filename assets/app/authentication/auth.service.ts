import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable, of } from 'rxjs';
import { User } from './user.model'
const jwt = require('jsonwebtoken');


@Injectable({
  providedIn: 'root'
})

export class AuthService{

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


  postUser(user){
    const body = JSON.stringify(user);
    return this.http.post('http://localhost:3000/user-backend/signup', body, {headers: this.httpOptions})
    .map((response: Response) => response.json())
    .catch((error: Response) => Observable.throw(error.json()));
  }

  loginUser(user){
    const body = JSON.stringify(user);
    return this.http.post('http://localhost:3000/user-backend/login', body, {headers: this.httpOptions})
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  getUser(){
    const id = this.getId()

    return this.http_client.get<User>('http://localhost:3000/user-backend/' + id)
      .map((response: Response) => {
        return response.obj
      });


  }

}
