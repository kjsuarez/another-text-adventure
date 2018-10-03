import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from "@angular/forms";

import { AuthService } from './auth.service';
import { User } from './user.model';

@Component({
  selector: 'auth-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent{

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  user: User;

  onSubmit(form: NgForm){
    let user: User = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      password: form.value.password };

      console.log("the user signup component sends to service:")
      console.log(user)

    this.authService.postUser(user)
    .subscribe(data => {
      console.log("the token component gets back:")
      console.log(data.token)
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.result._id);
      this.router.navigateByUrl('/');
    })
  }
}
