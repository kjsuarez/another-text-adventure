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

export class GameService{

  current_game_id = "0";
  gameIsEdit = new EventEmitter<Game>();
  roomIsEdit = new EventEmitter<Room>();

  constructor(private http: Http, private http_client: HttpClient) {}

  // game methods

  submitGame(game){

    const body = JSON.stringify(game);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/game-backend', body, {headers: headers})
      .map((response: Response) => {
        const game = response.json().obj;
        const transformed_game = new Game(game._id, game.name, null, null);
        this.gameIsEdit.emit(transformed_game);
        return transformed_game;
      });
  }

  updateGame(game: Game){
    const body = JSON.stringify(game);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch('http://localhost:3000/game-backend/' + game.id, body, {headers: headers})
      .map((response: Response) => {
        const game = response.json().obj;
        const transformed_game = new Game(game._id, game.name, null, null);
        this.gameIsEdit.emit(transformed_game);
      });
  }


  submitRoom(room){
    const body = JSON.stringify(room);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/room-backend', body, {headers: headers})
      .map((response: Response) => {
        const room = response.json().obj;
        const transformed_room = new Room(room._id, room.name, room.description, room.game_id);
        this.roomIsEdit.emit(transformed_room);
        return transformed_room;
      });
  }

  updateRoom(room: Room){
    const body = JSON.stringify(room);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch('http://localhost:3000/room-backend/' + room.id, body, {headers: headers})
      .map((response: Response) => {
        const room = response.json().obj;
        const transformed_room = new Room(room._id, room.name, room.description, room.game_id);
        this.roomIsEdit.emit(transformed_room);
      });
  }


  publicGames(): Observable<Game[]> {
    return this.http_client.get<Game[]>('http://localhost:3000/game-backend')
      .map((response: Response) => {
        const games = response.obj;
        let transformedGames: Game[] = [];
        for (let game of games){
          transformedGames.push({id: game._id, name: game.name, start_room_id: null, current_room_id: null })
        }
        GAMES = transformedGames;
        return GAMES;
      })
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

  hasRooms(){
    var this_games_rooms = ROOMS.filter(this.belongsToGame, this.current_game());
    return !this_games_rooms.length == 0
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
