import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from "@angular/forms";

import { AuthService } from './auth.service';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit{

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  onSubmit(form: NgForm){
    if(form.invalid){
      console.log("form invalid")
      return;
    }
    const user: User = { email: form.value.email, password: form.value.password };

    this.authService.loginUser(user)
    .subscribe(data => {
              localStorage.setItem('token', data.token);
              this.router.navigateByUrl('/');
          });
  }
}
