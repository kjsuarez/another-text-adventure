import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from "@angular/forms";

import { GameService } from './game.service';
import { Game } from './game.model';
import { Room } from '../room/room.model';
import { Choice } from '../choice/choice.model';

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

    this.gameService.roomsRetrieved.subscribe(
    (object: any) => {
      this.setStartRoom();
    });

    this.gameService.roomsBatchSaved.subscribe(
      (object: any) => { // id_pairs array
        object.forEach((id_pair, x) => {
          this.rooms.forEach((front_room, y) => {
            if(front_room.temp_id == id_pair.temp_id){
              this.rooms[y].id = id_pair.id
            }
          });
        });
        this.roomCleanUp();
      }
    );

    this.gameService.choicesBatchSaved.subscribe(
      (object: any) => { // id_pairs array
        console.log("made it to batch choice emitter")
        // loop new choices front end and assign them ids
        object.forEach((id_pair, x) => {
          this.choices.forEach((choice, y) => {
            if(choice.temp_id == id_pair.temp_id){
              this.choices[y].id = id_pair.id
            }
          });
        });

        this.choiceCleanUp();
        this.updateAll();
      }
    );

    this.gameService.roomSaved.subscribe(
      (object: any) => {
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
      (object: any) => {
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
  }

  updateAll(){
    // in future we'll probably want to keep trak of edited rooms and only update those.
    // also look into a working batch patch
    this.gameService.updateGame(this.game)
      .subscribe(
        result => console.log(result)
      );

    this.rooms.forEach((room, index) => {
      this.gameService.updateRoom(room, index)
        .subscribe(
          result => console.log(result)
        );
    });

    this.choices.forEach((choice, index) => {
      this.gameService.updateChoice(choice, index)
        .subscribe(
          result => console.log(result)
        );
    });


    // this.gameService.batchUpdateRooms(this.rooms)
    //   .subscribe(rooms => {});

    // this.gameService.batchUpdateChoices(new_choices)
    //   .subscribe(choices => {})
  }

  roomCleanUp(){
    this.rooms.forEach((room, x) => {
      if(room.temp_id){

        this.choices.forEach((choice, y) => { // fix all frontend cause/effect ids
          if(choice.cause_room_id == room.temp_id){
            this.choices[y].cause_room_id = room.id;
          }
          if(choice.effect_room_id == room.temp_id){
            console.log("effect room id == temp room id")
            this.choices[y].effect_room_id = room.id
          }
        });

        this.game.room_ids.forEach((room_id, index) => { //update game.room_ids
          if(room_id == room.temp_id){
            this.game.room_ids[index] = room.id
            this.game.room_ids = this.game.room_ids.concat();
          }
        });

        room.temp_id = null;
      }
    });
  }

  choiceCleanUp(){
    this.choices.forEach((choice, index) => {
      if(choice.temp_id){
        this.game.choice_ids.forEach((choice_id, id_index) => { // update game.choice_ids
          if(choice_id == choice.temp_id){
            console.log("found temp id in game.choice_ids")
            this.game.choice_ids[id_index] = choice.id
            this.game.choice_ids = this.game.choice_ids.concat();
            console.log(this.game.choice_ids)
          }
        });

        this.rooms.forEach((room, x) => {
          if(room.choice_ids){
            room.choice_ids.forEach((choice_id, y) => { // update room.choice_ids
              if(choice_id == choice.temp_id){
                this.rooms[x].choice_ids[y] = choice.id
                this.rooms[x].choice_ids = this.rooms[x].choice_ids.concat();
                console.log("room with newly updated choice_ids")
                console.log(this.rooms[x])
              }
            });
          }
        });

        choice.temp_id = null;

      }
    });
  }

  batchSubmitNewObjects(){
    const new_rooms = [];
    const new_choices = [];

    this.rooms.forEach((room, index) => {
      if(!room.id){
        new_rooms.push({room: room, index: index})
      }
    });

    this.choices.forEach((choice, index) => {
      if(!choice.id){
        new_choices.push({choice: choice, index: index})
      }
    });

    this.gameService.batchPostRooms(new_rooms)
      .subscribe(rooms => {
        this.gameService.batchPostChoices(new_choices)
          .subscribe(choices => {})
      });


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
    .subscribe(game => {
      this.game = game;
      this.getRooms();
    })
  }

  getRooms(): void {
    this.gameService.getGamesRooms(this.gameId())
    .subscribe(rooms => {
      this.rooms = rooms;
      this.setStartRoom();
      this.getChoices();
    });
  }

  getChoices(): void {
    this.gameService.getGamesChoices(this.gameId())
    .subscribe(choices => this.choices = choices)
  }


  setStartRoom(){
    this.rooms.forEach((room, index) => {

      if(room.id == this.game.start_room_id){
        this.rooms[index].is_start_room = "true";
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
    const room: Room = {temp_id: this.last_temp_id_assigned.toString(), id: null, name: form.value.name, description: form.value.description, game_id: this.game.id };
    this.rooms.push(room);
    this.game.room_ids = this.game.room_ids.concat(room.temp_id);
  }

  addChoiceToRoom(room, index){
    this.last_temp_id_assigned += 1;
    if(room.id){
      let choice: Choice = {summery: "New choice", cause_room_id: room.id, temp_id: this.last_temp_id_assigned.toString(), game_id: this.game.id}
    }else{
      let choice: Choice = {summery: "New choice", cause_room_id: room.temp_id, temp_id: this.last_temp_id_assigned.toString()}
    }
    this.choices.push(choice);
    if(!this.rooms[index].choice_ids){
      this.rooms[index].choice_ids = []
    }
    this.rooms[index].choice_ids = this.rooms[index].choice_ids.concat(choice.temp_id);
    this.game.choice_ids = this.game.choice_ids.concat(choice.temp_id);
  }

  updateGameName(form: NgForm){
    this.game.name = form.value.name
  }

  updateRoomAtIndex(form: NgForm, index) {
    this.rooms[index].name = form.value.name
    this.rooms[index].description = form.value.description
  }

  updatechoiceAtIndex(form: NgForm, index){
    this.choices[index].summery = form.value.summery
  }


  removeRoom(room, x){
    this.choices.forEach((choice, index) => { // clear out choice cause and effect room ids
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

    this.game.room_ids.forEach((room_id, y) => { // remove room from game.room_ids
      if(room_id == room.temp_id || room_id == room.id){
        this.game.room_ids.splice(y, 1)
        this.game.room_ids = this.game.room_ids.concat();
      }
    });

    this.rooms.splice(x, 1)
  }

  removeChoice(choice, x){
    this.game.choice_ids.forEach((choice_id, y) => { // remove choice from game
      if(choice_id == choice.temp_id || choice_id == choice.id){
        this.game.choice_ids.splice(y, 1)
        this.game.choice_ids = this.game.choice_ids.concat();
      }
    });

    this.rooms.forEach((room, y) => { // remove choice from rooms
      room.choice_ids.forEach((choice_id, z) => {
        if(choice_id == choice.temp_id || choice_id == choice.id){
          this.rooms[y].choice_ids.splice(z, 1)
          this.rooms[y].choice_ids = this.rooms[y].choice_ids.concat();
        }
      });
    });

    this.choices.splice(x, 1)
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

}
