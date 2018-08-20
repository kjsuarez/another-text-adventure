import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AuthService{

  constructor(private http: Http, private http_client: HttpClient) {}

  postUser(user){
    const body = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/user-backend/signup', body, {headers: headers})
    .map((response: Response) => {
      const user = response.json().obj;
      return user;
    });
  }

  loginUser(user){
    const body = JSON.stringify(user);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/user-backend/login', body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

}
