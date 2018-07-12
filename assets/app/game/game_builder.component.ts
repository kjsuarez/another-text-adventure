import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Game } from './game.model';
import { GameService } from './game.service';

@Component({
  selector: 'game-builder',
  templateUrl: './game_builder.component.html'
})

export class GameBuilderComponent implements OnInit{

  game: Game;
  picking_start_room = false;
  picking_result_room = false;
  picking_result_room_for_choice = null;

  constructor(private gameService: GameService, private route: ActivatedRoute) {}



  onSubmit(form: NgForm){
    const game: Game = {id: null, name: form.value.name, start_room_id: null, current_room_id: null };
    this.gameService.testSubmit(game)
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      );

    form.resetForm();
  }


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
    this.gameService.setStartRoom(game, room);
  }

  isStartRoom(game, room){
    return this.gameService.isStartRoom(game, room);
  }
}
