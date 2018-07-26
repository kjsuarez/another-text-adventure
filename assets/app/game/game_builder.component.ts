import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from "@angular/forms";

import { GameService } from './game.service';

@Component({
  selector: 'game-builder',
  templateUrl: './game_builder.component.html'
})

export class GameBuilderComponent implements OnInit{

  game: Game = {name: "Game Name"};
  current_game: Game;
  rooms: Room[] = [];
  choices: Choice[] = [{summery: "noot", temp_id: "0"}];
  last_temp_id_assigned = 0;
  is_picking_effect_room = null;
  constructor(private gameService: GameService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.gameService.gameSaved.subscribe(
      (game: Game) => {
        this.game = game;
        this.submitRooms(this.game.id);
      }
    );

    this.gameService.roomSaved.subscribe(
      (object: Object) => {
        this.rooms[object.index] = object.room;
        if(object.room.is_start_room){
          this.game.start_room_id = object.room.id;
        }
      }
    );

  }


  onSubmit(form: NgForm){
    if(this.game.id) {
      // the game already exists, so we're patching not posting
      this.submitRooms(this.game.id);
      this.updateStartRoom();
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
    this.rooms.forEach((room, index) => {
      room.game_id = game_id;
      if(room.id) {
        this.gameService.updateRoom(room, index)
          .subscribe(
            result => console.log(result)
          );
      }else{
        this.gameService.submitRoom(room, index)
          .subscribe(
            data => console.log(data),
            error => console.error(error)
          );
      }
    });

  }

  addChoiceToRoom(room){
    this.last_temp_id_assigned += 1;
    if(room.id){
      const choice: Choice = {summery: "New choice", cause_room_id: room.id, temp_id: this.last_temp_id_assigned}
    }else{
      const choice: Choice = {summery: "New choice", cause_room_id: room.temp_id, temp_id: this.last_temp_id_assigned}
    }
    this.choices.push(choice);
  }

  addRoom(form: NgForm){
    this.last_temp_id_assigned += 1;
    const room: Room = {temp_id: this.last_temp_id_assigned, id: null, name: form.value.name, description: form.value.description, game_id: null };
    this.rooms.push(room);
  }

  updateRoomAtIndex(form: NgForm, index) {
    this.rooms[index].name = form.value.name
    this.rooms[index].description = form.value.description
  }

  updatechoiceAtIndex(form: NgForm, index){
    this.choices[index].summery = form.value.summery
  }

  setAsStartRoom(index){
    for (let room of this.rooms){
      room["is_start_room"] = null;
    }
    this.rooms[index]["is_start_room"] = true;
  }

  updateStartRoom(){
    for (let room of this.rooms){
      if(room.is_start_room){
        this.game.start_room_id = room._id;
      }
    }
    this.gameService.updateGame(this.game)
      .subscribe(
        result => console.log(result)
      );
  }

  pickingEffectRoom(choice){
    this.is_picking_effect_room = choice
  }

  setEffectRoom(room){
    if(this.is_picking_effect_room){
      const usable_id
      if(room.id){
          usable_id = room.id
      }else{
        usable_id = room.temp_id
      }

      this.choices.forEach((choice, index) => {
        if(choice == this.is_picking_effect_room){
          this.choices[index].effect_room_id = usable_id;
        }
      });
      this.is_picking_effect_room = null;
    }
  }

  removeChoice(choice, i){
    this.choices.splice(i,1);
  }

  removeRoom(room, i){
    this.choices.forEach((choice, index) => {
      if(room.id){
        if(choice.cause_room_id == room.id ){
          this.choices[index].cause_room_id = null;
        }
        if(choice.effect_room_id == room.id){
          this.choices[index].effect_room_id = null;
        }
      }else{
        if(choice.effect_room_id == room.temp_id){
          this.choices[index].effect_room_id = null;
        }
        if(choice.cause_room_id == room.temp_id ){
          this.choices[index].cause_room_id = null;
        }
      }

    });
    this.rooms.splice(i,1)
  }

  belongsToRoom(choice){ // filter method
    if(this.id){
      return (choice.cause_room_id == this.id);
    }else{
      return (choice.cause_room_id == this.temp_id);
    }

  }

  roomsChoices(room){
    return this.choices.filter(this.belongsToRoom, room);
  }

  resultsFromChoice(room){ // filter method

    if(room.id){
      return (this.effect_room_id == room.id);
    }else{
      return (this.effect_room_id == room.temp_id);
    }
  }

  choiceResultRoom(choice){
    //return the room this choice leads to
    return this.rooms.filter(this.resultsFromChoice, choice)[0];
  }

  choiceResultRoomName(choice){
    if(this.choiceResultRoom(choice)){
      return this.choiceResultRoom(choice).name
    }
  }


}
