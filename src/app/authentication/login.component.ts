import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from "@angular/forms";

import { AuthService } from './auth.service';
import { User } from './user.model';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}
  user: User;

  onSubmit(form: NgForm){
    if(form.invalid){
      console.log("form invalid")
      return;
    }
    const user: User = { email: form.value.email, password: form.value.password };

    this.authService.loginUser(user)
    .subscribe(data => {
      console.log("inside login component subscribe, check localStorage for experation:")
      console.log(localStorage.getItem('experation'))
    });
  }
}
