import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from "@angular/forms";

import { GameService } from './game.service';

@Component({
  selector: 'game-editor',
  templateUrl: './game_editor.component.html'
})

export class GameEditorComponent implements OnInit{
  game: Game;
  current_game: Game;
  rooms: Room[] = [];
  choices: Choice[] = [];
  is_picking_effect_room = null;
  picking_start_room = false;
  picking_result_room = false;
  picking_result_room_for_choice = null;

  constructor(private gameService: GameService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.getCurrentGame()
    this.getRooms()
    this.getChoices()
    this.gameService.roomsRetrieved.subscribe(
    (object: Object) => {
      this.setStartRoom();
    });
  }

  onSubmit(form: NgForm){

    // the game already exists, so we're patching not posting
    this.submitRooms(this.game.id);
    this.updateStartRoom();
    this.game.name = form.value.name;
    this.gameService.updateGame(this.game)
      .subscribe(
        result => console.log(result)
      );

  }


  gameId(){
    return this.route.params._value.id;
  }

  getCurrentGame(): void {
    console.log("I'm called")
    this.gameService.getGame(this.gameId())
    .subscribe(game => this.game = game)
  }

  getRooms(): void {
    this.gameService.getGamesRooms(this.gameId())
    .subscribe(rooms => {
      this.rooms = rooms;
      this.setStartRoom();
    });
  }

  getChoices(): void {
    this.gameService.getGamesChoices(this.gameId())
    .subscribe(choices => this.choices = choices)
  }


  setStartRoom(){
    console.log(this.rooms)
    this.rooms.forEach((room, index) => {

      if(room.id == this.game.start_room_id){
        this.rooms[index].is_start_room = true;
      }
    });
  }

  isStartRoom(game, room){
    return game.start_room_id === room.id;
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

  pickingEffectRoom(choice){
    this.is_picking_effect_room = choice
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

}
