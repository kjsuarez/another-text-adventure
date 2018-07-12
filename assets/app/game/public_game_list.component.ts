import { Component, OnInit } from '@angular/core';
import { Game } from './game.model';
import { GameService } from './game.service';

@Component({
  selector: 'public-game-list',
  templateUrl: './public_game_list.component.html'
})

export class PublicGameListComponent implements OnInit{
  constructor(private gameService: GameService) {}

  public_games: Game[];

  ngOnInit(){
    this.getPublicGames()
  }

  getPublicGames(): void {
    this.gameService.publicGames()
    .subscribe(public_games => this.public_games = public_games)
  }

  setCurrentGame(id){
    this.gameService.setCurrentGameId(id);
  }

  testSubmit(){
    const game = new Game(null, "test game", null, null);
    this.gameService.testSubmit(game)
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      );
  }

}
