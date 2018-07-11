import { Injectable, EventEmitter } from "@angular/core";
import { Observable, of } from 'rxjs';

import { GAMES, ROOMS, CHOICES } from '../mock_data';

@Injectable({
  providedIn: 'root'
})

export class GameService{

  current_game_id = "0";


  // game methods

  publicGames(): Observable<Game[]> {
    return of(GAMES);
  }

  getGame(id){
    return GAMES[id];
  }

  current_game(){
    return GAMES[this.current_game_id];
  }

  setCurrentGameId(id){
    this.current_game_id = id
  }

  setStartRoom(game, room){
    GAMES[game.id].start_room_id = room.id;
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

  isStartRoom(game, room){
    return GAMES[game.id].start_room_id === room.id;
  }

  setCurrentRoomId(game, room){
    GAMES[game.id].current_room_id = room.id;
  }

  checkCurrentRoom(room){ // filter method
    return (room.id == this.current_room_id)
  }

  checkStartRoom(room){ // filter method
    return (room.id == this.start_room_id)
  }




  // room methods

  startRoom(){
    var this_games_rooms = ROOMS.filter(this.belongsToGame, this.current_game());
    var start_room = this_games_rooms.filter(this.checkStartRoom, this.current_game())[0];

    return start_room;
  }

  belongsToGame(room){ // filter method
    return (room.game_id == this.id);
  }

  gamesRooms(game){
    return ROOMS.filter(this.belongsToGame, game);
  }

  resultsFromChoice(room){ // filter method
    return (room.id == this.effect_room_id && room.game_id == this.game_id);
  }

  choiceResultRoom(choice){
    //return the room this choice leads to
    return ROOMS.filter(this.resultsFromChoice, choice)[0];
  }



  // choice methods

  belongsToRoom(choice){ // filter method
    return (choice.cause_room_id == this.id && choice.game_id == this.game_id);
  }

  currentRoomChoices(){
    return CHOICES.filter(this.belongsToRoom, this.currentRoom());
  }

  changeRoom(choice){
    GAMES[this.current_game().id].current_room_id = choice.effect_room_id;
  }


  roomsChoices(room){
    return CHOICES.filter(this.belongsToRoom, room);
  }

  setResultRoom(choice, room){
    CHOICES[choice.id].effect_room_id = room.id;
  }

}
