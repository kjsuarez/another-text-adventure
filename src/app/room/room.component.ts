import { Component } from '@angular/core';
import { GameService } from '../game/game.service';
import { PlayerService } from '../game/game_player.service';
import { Room } from './room.model';

@Component({
  selector: 'room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})

export class RoomComponent {
  constructor(private gameService: GameService, private gamePlayer: PlayerService) {}

  currentRoom(){
    return this.gamePlayer.currentRoom()
  }

}
