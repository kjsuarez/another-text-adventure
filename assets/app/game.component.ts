import { Component } from '@angular/core';
import { Game } from './game.model';
import { Room } from './room.model';
import { Choice } from './choice.model';

@Component({
  selector: 'game',
  templateUrl: './game.component.html'
})

export class GameComponent {
  tempGame = {
    rooms: [
      {room_name: "bedroom",
        choices: [
                  {name:"choice1", body: "fuck"},
                  {name:"choice2", body: "marry"},
                  {name:"choice3", body: "kill"}
                 ]
      }
    ],
    current_room_id: 0
  };

  game = new Game(0, "another text adventure", 0);
  rooms = [
    new Room(0, "bedroom", "you see two doors", 0),
    new Room(1, "hell", "Oh fuck!", 0),
    new Room(2, "kitchen", "since when does the kitchen branch off the bedroom?", 0)
  ]
  choices = [
    new Choice(0, "door1", 0, 1, 0),
    new Choice(1, "door2", 0, 2, 0)
  ]

  belongsToGame(room){
    return (room.game_id == this.id);
  }

  belongsToRoom(choice){
    return (choice.cause_room_id == this.id && choice.game_id == this.game_id);
  }

  currentRoom(){
    return this.rooms.filter(this.belongsToGame, this.game)[0];
  }

  currentRoomChoices(){
    return this.choices.filter(this.belongsToRoom, this.currentRoom());
  }


  // current_room = currentRoom(rooms);
  //
  // current_room = this.rooms[this.game.current_room_id];
  // current_choices = this.choices[];

}
