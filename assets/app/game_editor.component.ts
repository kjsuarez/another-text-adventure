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
  picking_result_room_for_choice = null;

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

  startPickingResultRoom(choice){
    this.picking_result_room = true;
    this.picking_result_room_for_choice = choice;
    // console.log(this.picking_result_room_for_choice);
  }

  startPickingStartRoom(){
    this.picking_start_room = true;
  }

  pickResultRoom(room){
    this.picking_result_room = false;
    this.gameService.setResultRoom(this.picking_result_room_for_choice, room);
    this.picking_result_room_for_choice = null;
  }

  setStartRoom(game, room){
    this.picking_start_room = false;
    // console.log("game via setStartRoom: ");
    // console.log(game);
    // console.log("*******");
    this.gameService.setStartRoom(game, room);
  }

  isStartRoom(game, room){
    return this.gameService.isStartRoom(game, room);
  }
}
