import { Component } from '@angular/core';
import { Game } from './game.model';
import { GameService } from './game.service';
import { Room } from './room.model';
import { Choice } from './choice.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'game-editor',
  templateUrl: './game_editor.component.html'
})

export class GameEditorComponent{
  constructor(private gameService: GameService, private route: ActivatedRoute) {}

  picking_start_room = false;
  picking_result_room = false;

  gameId(){
    return this.route.params._value.id;
  }

  game(){
    return this.gameService.getGame(this.gameId());
  }

  rooms(){
    return this.gameService.gamesRooms(this.game());
  }

  choices(room){
    return this.gameService.roomsChoices(room);
  }

  choiceResultRoom(choice){
    return this.gameService.choiceResultRoom(choice);
  }

  startPickingResultRoom(){
    this.picking_result_room = true;
  }

  startPickingStartRoom(){
    this.picking_start_room = true;
  }

  finishPickingResultRoom(){
    this.picking_result_room = false;
  }

  setStartRoom(game, room){
    this.picking_start_room = false;
    return this.gameService.setStartRoom(game, room);
  }
}
