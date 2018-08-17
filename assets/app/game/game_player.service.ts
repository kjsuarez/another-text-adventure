import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable, of } from 'rxjs';

import { GAMES, ROOMS, CHOICES } from '../mock_data';
import { Game } from './game.model';
import { Room } from '../room/room.model';
import { Choice } from '../choice/choice.model';

@Injectable({
  providedIn: 'root'
})

export class PlayerService{
  game: Game;
  current_game: Game;
  rooms: Room[] = [];
  choices: Choice[] = [];
  current_room = null;

  setAssets(populated_game){

    this.choices = [];

    populated_game.choice_ids.forEach((choice, index) => {
      // set this.choices
      this.choices.push({id: choice._id, summery: choice.summery, cause_room_id: choice.cause_room, effect_room_id: choice.effect_room, game_id: choice.game })
      // turn choice_ids into actual ids
      populated_game.choice_ids[index] = choice._id
    });

    populated_game.room_ids.forEach((room, index) => {
      this.rooms.push({id: room._id, name: room.name, description: room.description, game_id: room.game, choice_ids: room.choices })
      populated_game.room_ids[index] = room._id
    });

    this.game = populated_game
    this.current_room = null


  }

  roomWithId(id){
    return this.rooms.filter(room => room.id == id)[0];
  }

  setCurrentRoom(id){
    this.current_room = this.roomWithId(id)
  }

  hasRooms(){
    return Array.isArray(this.rooms) && this.rooms.length > 0
  }

  checkStartRoom(room){ // filter method
    return (room.id == this.start_room_id)
  }

  startRoom(){
    if(this.game.start_room_id){
      return this.rooms.filter(this.checkStartRoom, this.game)[0];
    }else{
      return this.rooms[0];
    }

  }

  currentRoom(){
    if(!this.current_room){
      return this.startRoom()
    }else{
      return this.current_room
    }
  }

  belongsToRoom(choice){ // filter method
    return (choice.cause_room_id == this.id);
  }

  currentRoomChoices(){
    return this.choices.filter(this.belongsToRoom, this.currentRoom();
  }

  changeRoom(choice){
    this.setCurrentRoom(choice.effect_room_id)
  }
}
