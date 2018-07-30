import { Component, OnInit } from '@angular/core';
import { Game } from './game.model';
import { GameService } from './game.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'game-editor',
  templateUrl: './game_editor.component.html'
})

export class GameEditorComponent implements OnInit{
  constructor(private gameService: GameService, private route: ActivatedRoute) {}

  picking_start_room = false;
  picking_result_room = false;
  picking_result_room_for_choice = null;
  current_game: Game;
  rooms: Room[] = [];
  choices: Choice[] = [];

  ngOnInit(){
    this.getCurrentGame()
    this.getRooms()
    this.getChoices()
  }

  gameId(){
    return this.route.params._value.id;
  }

  getCurrentGame(): void {
    console.log("I'm called")
    this.gameService.getGame(this.gameId())
    .subscribe(current_game => this.current_game = current_game)
  }

  getRooms(): void {
    this.gameService.getGamesRooms(this.gameId())
    .subscribe(rooms => this.rooms = rooms)
  }

  getChoices(): void {

  }


  // choices(room){
  //   return this.gameService.roomsChoices(room);
  // }
  //
  // choiceResultRoom(choice){
  //   return this.gameService.choiceResultRoom(choice);
  // }
  //
  // startPickingResultRoom(choice){
  //   this.picking_result_room = true;
  //   this.picking_result_room_for_choice = choice;
  //   // console.log(this.picking_result_room_for_choice);
  // }
  //
  // startPickingStartRoom(){
  //   this.picking_start_room = true;
  // }
  //
  // pickResultRoom(room){
  //   this.picking_result_room = false;
  //   this.gameService.setResultRoom(this.picking_result_room_for_choice, room);
  //   this.picking_result_room_for_choice = null;
  // }
  //
  // setStartRoom(game, room){
  //   this.picking_start_room = false;
  //   // console.log("game via setStartRoom: ");
  //   // console.log(game);
  //   // console.log("*******");
  //   this.gameService.setStartRoom(game, room);
  // }
  //
  isStartRoom(game, room){
    return game.start_room_id === room.id;
  }
}
