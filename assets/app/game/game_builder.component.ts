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

  game: Game = {name: "Game Name"};
  current_game: Game;
  rooms: Room[] = [];

  constructor(private gameService: GameService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.gameService.gameIsEdit.subscribe(
      (game: Game) => {
        this.game = game;

        this.submitRooms(this.game.id);
        console.log("here?");
      }
    );
  }

  onSubmit(form: NgForm){
    if(this.game.id) {
      // the game already exists, so we're editing
      this.game.name = form.value.name;
      this.gameService.updateGame(this.game)
        .subscribe(
          result => console.log(result)
        );

    } else {
      const game: Game = {id: null, name: form.value.name, start_room_id: null, current_room_id: null };
      this.gameService.submitGame(game)
        .subscribe(
          data => console.log(data),
          error => console.error(error)
        );
    }

  }

  submitRooms(game_id){
    for (let room of this.rooms){
      room.game_id = game_id;
      if(room.id) {
        this.gameService.updateRoom(room)
          .subscribe(
            result => console.log(result)
          );
      }else{
        this.gameService.submitRoom(room)
          .subscribe(
            data => console.log(data),
            error => console.error(error)
          );
      }

    }
  }

  addRoom(form: NgForm){
    const room: Room = {id: null, name: form.value.name, description: form.value.description, game_id: null };
    this.rooms.push(room);
  }

  updateRoomAtIndex(form: NgForm, index){
    this.rooms[index].name = form.value.name;
    this.rooms[index].description = form.value.description;
  }

  setAsStartRoom(index){
    for (let room of this.rooms){
      room["is_start_room"] = null;
    }
    this.rooms[index]["is_start_room"] = true;
    console.log(this.rooms);
  }

}
