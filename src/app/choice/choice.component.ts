import { Component } from '@angular/core';
import { GameService } from '../game/game.service';
import { PlayerService } from '../game/game_player.service';
import { ChoiceService } from './choice.service';
import { Choice } from './choice.model';

@Component({
  selector: 'choices',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.css']
})

export class ChoiceComponent {
  constructor(private gameService: GameService, private gamePlayer: PlayerService) {}

  currentRoomChoices(){
    return this.gamePlayer.currentRoomChoices()
  }

  changeRoom(choice){
    return this.gamePlayer.changeRoom(choice)
  }

  currentRoomId(){
    return this.gamePlayer.currentRoom().id
  }
}
