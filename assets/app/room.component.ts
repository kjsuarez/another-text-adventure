import { Component } from '@angular/core';
import { Game } from './game.model';
import { GameService } from './game.service';
import { Room } from './room.model';
import { Choice } from './choice.model';

@Component({
  selector: 'room',
  templateUrl: './room.component.html'
})

export class RoomComponent {
  constructor(private gameService: GameService) {}

  currentRoom(){
    return this.gameService.currentRoom()
  }

}
