import { Component } from '@angular/core';
import { GameService } from '../game/game.service';
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
