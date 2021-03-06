import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Game } from './game.model';
import { Room } from '../room/room.model';
import { Choice } from '../choice/choice.model';
import { GameService } from './game.service';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'game-builder',
  templateUrl: './game_builder.component.html',
  styleUrls: ['./game_builder.component.css']
})

export class GameBuilderComponent implements OnInit{
  //to avoid ng build error
  room: Room;

  game: Game = {id: null, name: "Game Name", start_room_id: null, current_room_id: null, room_ids: [], choice_ids: []};
  current_game: Game;
  rooms: Room[] = [];
  choices: Choice[] = [];
  last_temp_id_assigned = 0;
  is_picking_effect_room = null;

  constructor(private gameService: GameService,
     private authService: AuthService,
      private route: ActivatedRoute,
       private router: Router) {}

  ngOnInit(){
    this.gameService.gameSaved.subscribe(
      (game: Game) => {
        this.game.id = game.id;
        // loop through rooms and choices and assign game_id
        this.rooms.forEach((room, index) => {
          this.rooms[index].game_id = this.game.id
        });

        this.choices.forEach((choice, index) => {
          this.choices[index].game_id = this.game.id
        });
        console.log("2 game saved emitter, game, room1 and choice1:")
        console.log(this.game)
        console.log(this.rooms[0])
        console.log(this.choices[0])
        this.batchSubmitNewObjects();

        //this.submitRooms(this.game.id);

      }
    );

    this.gameService.roomsBatchSaved.subscribe(
      (object: any) => { // id_pairs array
        object.forEach((id_pair, x) => {
          this.rooms.forEach((front_room, y) => {
            if(front_room.temp_id == id_pair.temp_id){
              this.rooms[y].id = id_pair.id
            }
          });
        });
        console.log("4a roomsBatchSaved emitter, this.rooms[0]: ,leads to room cleanup")
        console.log(this.rooms[0])
        this.roomCleanUp();
      }
    );

    this.gameService.choicesBatchSaved.subscribe(
      (object: any) => { // id_pairs array
        // loop new choices front end and assign them ids
        object.forEach((id_pair, x) => {
          this.choices.forEach((choice, y) => {
            if(choice.temp_id == id_pair.temp_id && choice.temp_id != null){
              this.choices[y].id = id_pair.id
            }
          });
        });
        console.log("5b choicesBatchSaved emitter this.choices[0]:")
        console.log(this.choices[0])
        this.choiceCleanUp();
        console.log("7b inbetween choiceCleanUp and updateAll")
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
          this.choices.forEach((choice, index) => {
            if(choice.cause_room_id == object.room.temp_id){
              this.choices[index].cause_room_id = object.room.id;
            }
            if(choice.effect_room_id == object.room.temp_id){
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
        //should probably be it's own function
        this.gameService.updateGame(this.game)
          .subscribe(
            result => console.log(result)
          );
      }
    );
   }


  onSubmit(form: NgForm){

    const game: Game = {id: null, name: form.value.name, start_room_id: null, current_room_id: null, room_ids: [], choice_ids: []};
    console.log("1 submit button pressed, game, rooms and choices:")
    console.log(this.game)
    console.log(this.rooms[0])
    console.log(this.choices[0])
    this.gameService.submitGame(this.game)
    .subscribe(
      data => {},
      error => console.error(error)
    );
  }

  submitRooms(game_id){ // todo: experiment with batch post
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
      this.gameService.submitChoice(choice, index)
        .subscribe(
          data => console.log(data),
          error => console.log(error)
        );
    });
  }

  addChoiceToRoom(room, index){
    this.last_temp_id_assigned += 1;
    if(room.id){
      const choice: Choice = {summery: "New choice", cause_room_id: room.id, temp_id: this.last_temp_id_assigned.toString(), game_id: this.game.id}

      this.choices.push(choice);
      if(!this.rooms[index].choice_ids){
        this.rooms[index].choice_ids = []
      }
      this.rooms[index].choice_ids = this.rooms[index].choice_ids.concat(choice.temp_id);
      this.game.choice_ids = this.game.choice_ids.concat(choice.temp_id);

    }else{
      const choice: Choice = {summery: "New choice", cause_room_id: room.temp_id, temp_id: this.last_temp_id_assigned.toString()}

      this.choices.push(choice);
      if(!this.rooms[index].choice_ids){
        this.rooms[index].choice_ids = []
      }
      this.rooms[index].choice_ids = this.rooms[index].choice_ids.concat(choice.temp_id);
      this.game.choice_ids = this.game.choice_ids.concat(choice.temp_id);

    }

  }

  addRoom(form: NgForm){
    this.last_temp_id_assigned += 1;
    const room: Room = {temp_id: this.last_temp_id_assigned.toString(), id: null, name: form.value.name, description: form.value.description, game_id: this.game.id, choice_ids: [] };
    this.rooms.push(room);
    this.game.room_ids = this.game.room_ids.concat(room.temp_id);
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

  setAsStartRoom(room, index){
    for (let room of this.rooms){
      room["is_start_room"] = null;
    }
    this.rooms[index]["is_start_room"] = "true";

    var safe_id = this.rooms[index].id ? this.rooms[index].id : this.rooms[index].temp_id
    this.game.start_room_id = safe_id
  }

  updateStartRoom(){
    if(this.rooms.length > 0){
      this.game.start_room_id = this.rooms[0].id
      for (let room of this.rooms){
        if(room.is_start_room){
          this.game.start_room_id = room.id;
        }
      }
    }
    this.gameService.updateGame(this.game)
      .subscribe(
        result => console.log(result)
      );
    console.log("9b updateStartRoom, this.game:")
    console.log(this.game)
  }

  pickingEffectRoom(choice){
    this.is_picking_effect_room = choice
  }

  setEffectRoom(room){
    if(this.is_picking_effect_room){
      let usable_id
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

  // belongsToRoom(choice){ // filter method
  //   if(this.id){
  //     return (choice.cause_room_id == this.id);
  //   }else{
  //     return (choice.cause_room_id == this.temp_id);
  //   }
  //
  // }

  belongsToRoom(room, choices){
    let res = [];
    if(room.id){
      choices.forEach((choice, index) => {
        if(choice.cause_room_id == room.id){
          res.push(choice)
        }
      })
    }else{
      choices.forEach((choice, index) => {
        if(choice.cause_room_id == room.temp_id){
          res.push(choice)
        }
      })
    }
    return res
  }

  roomsChoices(room){
    return  this.belongsToRoom(room, this.choices) //this.choices.filter(this.belongsToRoom, room);
  }


  resultsFromChoice(choice, rooms){
    let res = [];
      rooms.forEach((room, index) => {
        if(room.id){
          if(choice.effect_room_id == room.id){
            res.push(room)
          }
        }else{
          if(choice.effect_room_id == room.temp_id){
            res.push(room)
          }
        }
      })

    return res
  }

  choiceResultRoom(choice){
    //return the room this choice leads to
    return this.resultsFromChoice(choice, this.rooms)[0] //this.rooms.filter(this.resultsFromChoice, choice)[0];
  }

  choiceResultRoomName(choice){
    if(this.choiceResultRoom(choice)){
      return this.choiceResultRoom(choice).name
    }
  }

  batchSubmitNewObjects(){
    let new_rooms = [];
    let new_choices = [];

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
    console.log("3 batchSubmitNewObjects, new_rooms1, and then new_choices1:")
    console.log(new_rooms[0])
    console.log(new_choices[0])
    this.gameService.batchPostRooms(new_rooms)
      .subscribe(rooms => {
        console.log("4b subscribe of batchPostRooms, leads to batchPostChoices")
        this.gameService.batchPostChoices(new_choices)
          .subscribe(choices => {})
      });
  }

  roomCleanUp(){
    this.rooms.forEach((room, x) => {
      if(room.temp_id){

        this.choices.forEach((choice, y) => { // fix all frontend cause/effect ids
          if(choice.cause_room_id == room.temp_id){
            this.choices[y].cause_room_id = room.id;
          }
          if(choice.effect_room_id == room.temp_id){
            this.choices[y].effect_room_id = room.id
          }
        });

        this.game.room_ids.forEach((room_id, index) => { // update game.room_ids
          if(room_id == room.temp_id){
            this.game.room_ids[index] = room.id
            this.game.room_ids = this.game.room_ids.concat();
          }
        });

        if(this.game.start_room_id == room.temp_id){ // update game start room id
          this.game.start_room_id = room.id
        }

        room.temp_id = null;
      }
    });
    console.log("5a roomCleanUp, this.game, this.rooms[0], this.choices[0]:")
    console.log(this.game)
    console.log(this.rooms[0])
    console.log(this.choices[0])
  }

  choiceCleanUp(){
    this.choices.forEach((choice, index) => {
      if(choice.temp_id){
        this.game.choice_ids.forEach((choice_id, id_index) => { // update game.choice_ids
          if(choice_id == choice.temp_id){
            this.game.choice_ids[id_index] = choice.id
            this.game.choice_ids = this.game.choice_ids.concat();
          }
        });

        this.rooms.forEach((room, x) => {
          if(room.choice_ids){
            room.choice_ids.forEach((choice_id, y) => { // update room.choice_ids
              if(choice_id == choice.temp_id){
                this.rooms[x].choice_ids[y] = choice.id
                this.rooms[x].choice_ids = this.rooms[x].choice_ids.concat();
              }
            });
          }
        });

        choice.temp_id = null;

      }
    });
    console.log("6b choiceCleanUp this.choices[0], this.rooms[0]:")
    console.log(this.choices[0])
    console.log(this.rooms[0])
  }

  updateAll(){
    // in future we'll probably want to keep track of edited rooms and only update those.
    // also look into a working batch patch

    // this.gameService.updateGame(this.game)
    //   .subscribe(
    //     result => console.log(result)
    //   );

    this.rooms.forEach((room, index) => {
      this.gameService.updateRoom(room, index)
        .subscribe(
          result => {
            console.log("8ba(repeating) updateRoom subscribe of each individual room:")
            console.log(result)
          }
        );
    });

    this.choices.forEach((choice, index) => {
      this.gameService.updateChoice(choice, index)
        .subscribe(
          result => {
            console.log("8bb(repeating) updateChoice subscribe of each individual choice:")
            console.log(result)
          }
        );
    });

    this.updateStartRoom()
    console.log("10b after updateStartRoom and before navigating to editor")
    this.router.navigateByUrl("/editor/" + this.game.id);
    //this.router.navigateByUrl("/user" );
  }

  roomNameFor(id){
    let selected_room
    this.rooms.forEach((room, index) => {
      let safe_id = room.id ? room.id : room.temp_id
      if(safe_id == id){
        selected_room = room
      }
    })
    return (selected_room) ? selected_room.name : "undecided";
  }

}
