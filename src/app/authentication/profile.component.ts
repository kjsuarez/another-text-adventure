import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from "@angular/forms";

import { AuthService } from './auth.service';
import { User } from './user.model';
import { Game } from '../game/game.model';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit{

  user: User;
  private authListenerSubscription: Subscription
  private user_is_authenticated = false;
  private users_games = [];

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(){
    console.log("auth status:")
    console.log(this.authService.getAuthStatus())

    this.user_is_authenticated = this.authService.getAuthStatus();
    this.authListenerSubscription = this.authService
    .getAuthStatusListener()
    .subscribe( isAuthenticated => {
      console.log("reached auth listener subscription in public game list")
      this.user_is_authenticated = isAuthenticated;
      this.getUsersInfo();
    });
    this.getUsersInfo();
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }


  getUsersInfo(){
    if(this.user_is_authenticated){
      this.authService.getUsersAndFullGames()
      .subscribe(user => {
        this.user = user
        this.users_games = user.games
      });
    }
  }

  updateFirstName(form: NgForm){
    this.user.first_name = form.value.first_name
  }

  updateLastName(form: NgForm){
    this.user.last_name = form.value.last_name
  }

  updateUser(form: NgForm){
    this.authService.updateUser(this.user)
    .subscribe(
      result => {console.log(result)}
    )
  }

}
