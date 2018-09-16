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
  private users_games = ["5b9aed45d6f0731af904533f"];



  constructor(private gameService: GameService, private authService: AuthService) {}

  public_games: Game[];

  ngOnInit(){
    console.log("auth status:")
    console.log(this.authService.getAuthStatus())

    this.user_is_authenticated = this.authService.getAuthStatus();

    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe( isAuthenticated => {
        console.log("reached auth listener subscription in public game list")
        this.user_is_authenticated = isAuthenticated
      });

    this.getPublicGames()
    this.getUsersGames()


  }

  ngOnDestroy(){
    //this.authListenerSubscription.unsubscribe();
  }

  getPublicGames(): void {
    //this.public_games = this.gameService.publicGames()
    this.gameService.publicGames()
    .subscribe(public_games => {
      this.public_games = public_games
    });
  }

  getUsersGames(){
    if(this.user_is_authenticated){
      this.authService.getUsersGames()
      .subscribe(games => {
        console.log("games recieved by getUsersGames:")
        console.log(games)
        this.users_games = games
      });
    }
  }

  // setCurrentGame(id){
  //   this.gameService.setCurrentGameId(id);
  // }
  //
  // submitGame(){
  //   const game = new Game(null, "test game", null, null);
  //   this.gameService.submitGame(game)
  //     .subscribe(
  //       data => console.log(data),
  //       error => console.error(error)
  //     );
  // }
  //
  userOwnsGame(game){

    if(this.user_is_authenticated){
      return this.users_games.includes(game.id)
    }
  }

}







//   constructor(private gameService: GameService, private authService: AuthService) {}
//
//   public_games: Game[];
//
//   ngOnInit(){
//     console.log("onInit called in public game list")
//     console.log(this.authService.getAuthStatus())
//
//     this.user_is_authenticated = this.authService.getAuthStatus();
//
//     this.authListenerSubscription = this.authService
//       .getAuthStatusListener()
//       .subscribe( isAuthenticated => {
//         console.log("reached auth listener subscription in public game list")
//         this.user_is_authenticated = isAuthenticated
//       });
//
//     this.getPublicGames()
//     this.getUsersGames()
//
//
//   }
//
//   ngOnDestroy(){
//     this.authListenerSubscription.unsubscribe();
//   }
//
//   getPublicGames(): void {
//     this.gameService.publicGames()
//     .subscribe(public_games => {
//       this.public_games = public_games
//     });
//   }
//
//   getUsersGames(){
//     if(this.user_is_authenticated){
//       this.authService.getUsersGames()
//       .subscribe(games => {
//         console.log("games recieved by getUsersGames:")
//         console.log(games)
//         this.users_games = games
//       });
//     }
//   }
//
//   setCurrentGame(id){
//     this.gameService.setCurrentGameId(id);
//   }
//
//   submitGame(){
//     const game = new Game(null, "test game", null, null);
//     this.gameService.submitGame(game)
//       .subscribe(
//         data => console.log(data),
//         error => console.error(error)
//       );
//   }
//
//   userOwnsGame(game){
//
//     // if(this.user_is_authenticated){
//     //   return this.users_games.includes(game.id)
//     // }
//   }
// //
// }
