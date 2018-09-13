import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from "@angular/forms";

import { AuthService } from './auth.service';
import { User } from './user.model'

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit{

  user: User;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(){

    if(this.authService.getId()){
      console.log("hereherehere")
      this.authService.getUser()
        .subscribe(user => {
          this.user = user
        });
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

}
