import { Injectable, EventEmitter } from "@angular/core";

import { Game } from './game.model';
import { Room } from '../room/room.model';
import { Choice } from '../choice/choice.model';

import { GAMES, ROOMS, CHOICES } from '../mock_data';

@Injectable({
  providedIn: 'root'
})

export class GameService{

  current_game_id = "0";


  current_game(){
    return GAMES[this.current_game_id];
  }

  startRoom(){
    var this_games_rooms = ROOMS.filter(this.belongsToGame, this.current_game());
    var start_room = this_games_rooms.filter(this.checkStartRoom, this.current_game())[0];

    return start_room;
  }

  setCurrentGameId(id){
    this.current_game_id = id
  }

  belongsToGame(room){
    return (room.game_id == this.id);
  }

  checkCurrentRoom(room){
    return (room.id == this.current_room_id)
  }

  checkStartRoom(room){
    return (room.id == this.start_room_id)
  }

  belongsToRoom(choice){
    return (choice.cause_room_id == this.id && choice.game_id == this.game_id);
  }

  resultsFromChoice(room){
    return (room.id == this.effect_room_id && room.game_id == this.game_id);
  }

  currentRoom(){
    if(this.current_game().current_room_id){
      var this_games_rooms = ROOMS.filter(this.belongsToGame, this.current_game());
      var current_room = this_games_rooms.filter(this.checkCurrentRoom, this.current_game())[0];

      return current_room;
    }
    else{
      this.setCurrentRoomId(this.current_game(), this.startRoom());
      return this.startRoom();
    }
  }

  currentRoomChoices(){
    return CHOICES.filter(this.belongsToRoom, this.currentRoom());
  }

  changeRoom(choice){
    console.log("in service");
    console.log(this.current_game());
    console.log(choice.effect_room_id);
    GAMES[this.current_game().id].current_room_id = choice.effect_room_id;
    console.log("after change: ")
    console.log(this.current_game().current_room_id);
  }

  publicGames(){
    return GAMES;
  }

  gamesRooms(game){
    return ROOMS.filter(this.belongsToGame, game);
  }

  roomsChoices(room){
    return CHOICES.filter(this.belongsToRoom, room);
  }

  getGame(id){
    return GAMES[id];
  }

  choiceResultRoom(choice){
    //return the room this choice leads to
    return ROOMS.filter(this.resultsFromChoice, choice)[0];
  }

  setStartRoom(game, room){
    GAMES[game.id].start_room_id = room.id;
  }

  setResultRoom(choice, room){
    CHOICES[choice.id].effect_room_id = room.id;
  }

  isStartRoom(game, room){
    return GAMES[game.id].start_room_id === room.id;
  }

  setCurrentRoomId(game, room){
    GAMES[game.id].current_room_id = room.id;
  }

}
