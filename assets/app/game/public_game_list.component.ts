import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Game } from './game.model';
import { GameService } from './game.service';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'public-game-list',
  templateUrl: './public_game_list.component.html'
})

export class PublicGameListComponent implements OnInit, OnDestroy{

  private authListenerSubscription: Subscription
  private user_is_authenticated = false;

  constructor(private gameService: GameService, private authService: AuthService) {}

  public_games: Game[];

  ngOnInit(){
    console.log("onInit called in public game list")
    console.log(this.authService.getAuthStatus())

    this.user_is_authenticated = this.authService.getAuthStatus();

    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe( isAuthenticated => {
        console.log("reached auth listener subscription in public game list")
        this.user_is_authenticated = isAuthenticated
      });

    this.getPublicGames()


  }

  ngOnDestroy(){
    this.authListenerSubscription.unsubscribe();
  }

  getPublicGames(): void {
    this.gameService.publicGames()
    .subscribe(public_games => {
      this.public_games = public_games



    });
  }

  setCurrentGame(id){
    this.gameService.setCurrentGameId(id);
  }

  submitGame(){
    const game = new Game(null, "test game", null, null);
    this.gameService.submitGame(game)
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      );
  }

}
