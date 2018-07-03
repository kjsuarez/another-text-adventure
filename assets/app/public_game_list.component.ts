import { Component } from '@angular/core';
import { Game } from './game.model';
import { GameService } from './game.service';
import { Room } from './room.model';
import { Choice } from './choice.model';

@Component({
  selector: 'public-game-list',
  templateUrl: './public_game_list.component.html'
})

export class PublicGameListComponent{
  constructor(private gameService: GameService) {}

  publicGames(){
    return this.gameService.publicGames();
  }

  setCurrentGame(id){
    this.gameService.setCurrentGameId(id)
  }

}
