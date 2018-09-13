import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from './game/game.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './authentication/auth.service';
import { User } from './authentication/user.model'

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy{

  current_user: User;
  user_is_authenticated = false;
  private authListenerSubscription: Subscription

  constructor(private gameService: GameService, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.user_is_authenticated = this.authService.getAuthStatus();
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe( isAuthenticated => {
        console.log("reached auth listener subscription in header")
        this.user_is_authenticated = isAuthenticated
      });
  }

  ngOnDestroy(){
    this.authListenerSubscription.unsubscribe();
  }

  setUser(user){
    if(user){
      this.current_user = user
    }
  }

  submitGame(){
    const game: Game = {id: null, name: "a test", start_room_id: null, current_room_id: null };
    this.gameService.submitGame(game)
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      );
  }
}
