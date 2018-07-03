import { Component } from '@angular/core';
import { Game } from './game.model';
import { GameService } from './game.service';
import { Room } from './room.model';
import { Choice } from './choice.model';

@Component({
  selector: 'choices',
  templateUrl: './choice.component.html'
})

export class ChoiceComponent {
  constructor(private gameService: GameService) {}

  currentRoomChoices(){
    return this.gameService.currentRoomChoices()
  }
  
  changeRoom(choice){
    return this.gameService.changeRoom(choice)
  }
}