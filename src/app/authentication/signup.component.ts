import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from "@angular/forms";

import { AuthService } from './auth.service';

@Component({
  selector: 'auth-signup',
  templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit{

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  onSubmit(form: NgForm){
    const user: User = {
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
