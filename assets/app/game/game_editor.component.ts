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
  deleted_rooms: Room[] = [];
  choices: Choice[] = [];
  deleted_choices: Choice[] = [];
  last_temp_id_assigned = 0;
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

    this.gameService.roomsBatchSaved.subscribe(
      (object: Object) => { // id_pairs array
        object.forEach((id_pair, x) => {
          this.rooms.forEach((front_room, y) => {
            if(front_room.temp_id == id_pair.temp_id){
              this.rooms[y].id = id_pair.id
            }
          });
        });
      }
    );

    this.gameService.roomSaved.subscribe(
      (object: Object) => {
        this.rooms[object.index] = object.room;
        if(object.room.is_start_room){
          this.game.start_room_id = object.room.id;
        }
        if(object.room.temp_id){

          this.game.room_ids.forEach((room_id, index) => {
            if(room_id == object.room.temp_id){
              this.game.room_ids[index] = object.room.id
            }
          });

          this.choices.forEach((choice, index) => {
            if(choice.cause_room_id == object.room.temp_id){
              this.choices[index].cause_room_id = object.room.id;
            }
            if(choice.effect_room_id == object.room.temp_id){
              console.log("effect room id == temp room id")
              this.choices[index].effect_room_id = object.room.id
            }
            this.choices[index].game_id = object.room.game_id
          });

          this.rooms[object.index].temp_id = null
          this.submitChoices();
        }
      }
    );

    this.gameService.choiceSaved.subscribe(
      (object: Object) => {
        this.choices[object.index] = object.choice;

        if(object.choice.temp_id){

          this.game.choice_ids.forEach((choice_id, index) => {
            if(choice_id == object.choice.temp_id){
              this.game.choice_ids[index] = object.choice.id
            }
          });

          this.rooms.forEach((room, index) => {
            if(object.choice.cause_room_id == room.id  || object.choice.cause_room_id == room.temp_id){
              room.choice_ids.forEach((choice_id, index) => {
                if(choice_id == object.choice.temp_id){
                  this.rooms[index].choice_ids[index] = object.choice.id
                }
              });
            }
          });

          this.choices[object.index].temp_id = null
        }
        //should probably be it's own function
        this.gameService.updateGame(this.game)
          .subscribe(
            result => console.log(result)
          );
      }
    );
  }

  onSubmit(form: NgForm){

  // batch submit new rooms and choices
  this.batchSubmitNewObjects();


    // this.submitRooms(this.game.id);
    // this.updateStartRoom();
    // this.game.name = form.value.name;
    // this.gameService.updateGame(this.game)
    //   .subscribe(
    //     result => console.log(result)
    //   );

  }

  batchSubmitNewObjects(){
    const new_rooms = [];
    this.rooms.forEach((room, index) => {
      if(!room.id){
        new_rooms.push({room: room, index: index})
      }
    });
    this.gameService.batchPostRooms(new_rooms).subscribe(
      result => console.log(result)
    );
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

  submitChoices(){ // todo: experiment with batch post
    this.choices.forEach((choice, index) => {
      if(choice.id){
        this.gameService.updateChoice(choice, index)
          .subscribe(
            result => console.log(result)
          );
      }else{
        this.gameService.submitChoice(choice, index)
          .subscribe(
            data => console.log(data),
            error => console.log(error)
          );
      }
    });
  }

  gameId(){
    return this.route.params._value.id;
  }

  getCurrentGame(): void {
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

  addRoom(form: NgForm){
    this.last_temp_id_assigned += 1;
    const room: Room = {temp_id: this.last_temp_id_assigned, id: null, name: form.value.name, description: form.value.description, game_id: null };
    this.rooms.push(room);
    this.game.room_ids = this.game.room_ids.concat(room.temp_id);
  }

  addChoiceToRoom(room, index){
    this.last_temp_id_assigned += 1;
    if(room.id){
      const choice: Choice = {summery: "New choice", cause_room_id: room.id, temp_id: this.last_temp_id_assigned}
    }else{
      const choice: Choice = {summery: "New choice", cause_room_id: room.temp_id, temp_id: this.last_temp_id_assigned}
    }
    this.choices.push(choice);
    this.rooms[index].choice_ids = this.rooms[index].choice_ids.concat(choice.temp_id);
    this.game.choice_ids = this.game.choice_ids.concat(choice.temp_id);
  }

  updateRoomAtIndex(form: NgForm, index) {
    this.rooms[index].name = form.value.name
    this.rooms[index].description = form.value.description
  }

  updatechoiceAtIndex(form: NgForm, index){
    this.choices[index].summery = form.value.summery
  }


}
