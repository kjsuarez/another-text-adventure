import { Component } from '@angular/core';
import { GameService } from '../game/game.service';
import { Room } from './room.model';

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
