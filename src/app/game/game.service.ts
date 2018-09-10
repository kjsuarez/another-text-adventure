import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable, of } from 'rxjs';

import { GAMES, ROOMS, CHOICES } from '../mock_data';
import { Game } from './game.model';
import { Room } from '../room/room.model';
import { Choice } from '../choice/choice.model';
import { AuthService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root'
})

export class GameService{

  current_game_id = "0";
  gameSaved = new EventEmitter<Game>();
  roomSaved = new EventEmitter<Object>();
  choiceSaved = new EventEmitter<Object>();
  roomsRetrieved = new EventEmitter<Object>();
  roomsBatchSaved = new EventEmitter<Object>();
  choicesBatchSaved = new EventEmitter<Object>();
  constructor(private authService: AuthService, private http: Http, private http_client: HttpClient) {}

  const httpOptions = {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.authService.getToken();
      }

  headerWithToken(token){
    return {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + token;
        }
  }

  batchPostRooms(rooms){
    const alt_rooms = rooms
    const body = JSON.stringify(rooms);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/room-backend/batch', body, {headers: headers})
      .map((response: Response) => {
        const rooms_json = response.json().obj;
        const id_pairs = rooms_json
        this.roomsBatchSaved.emit(id_pairs);
        return id_pairs;
      });
  }

  batchPostChoices(choices){
    const alt_choices = choices
    const body = JSON.stringify(choices);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/choice-backend/batch', body, {headers: headers})
      .map((response: Response) => {
        const choices_json = response.json().obj;
        const id_pairs = choices_json
        this.choicesBatchSaved.emit(id_pairs);
        return id_pairs;
      });
  }

  batchUpdateRooms(rooms){
    const alt_rooms = rooms
    const body = JSON.stringify(rooms);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch('http://localhost:3000/room-backend/batch', body, {headers: headers})
      .map((response: Response) => {

      });
  }

  batchUpdateChoices(){
    const alt_choices = choices
    const body = JSON.stringify(choices);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch('http://localhost:3000/choice-backend/batch', body, {headers: headers})
      .map((response: Response) => {

      });
  }

  // game methods

  submitGame(game){
    const token = localStorage.getItem('token')
    const headers = this.headerWithToken(token)
    const body = JSON.stringify(game);
    return this.http.post('http://localhost:3000/game-backend', body, {headers: this.headerWithToken(token)})
      .map((response: Response) => {
        const game = response.json().obj;
        const transformed_game = new Game(game._id, game.name, null, null);
        this.gameSaved.emit(transformed_game);
        return transformed_game;
      });
  }

  updateGame(game: Game){
    const token = localStorage.getItem('token')
    const headers = this.headerWithToken(token)
    const body = JSON.stringify(game);
    console.log("body in updateGame:")
    console.log(body)
    return this.http.patch('http://localhost:3000/game-backend/' + game.id, body, {headers: this.headerWithToken(token)})
      .map((response: Response) => {
        const game = response.json().obj;
        const transformed_game = new Game(game._id, game.name, game.start_room_id, null);
      });
  }


  submitRoom(room, index){
    const alt_room = room
    const body = JSON.stringify(room);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/room-backend', body, {headers: headers})
      .map((response: Response) => {
        const room = response.json().obj;
        const transformed_room = new Room(room._id, room.name, room.description, room.game, alt_room.is_start_room, alt_room.temp_id);
        this.roomSaved.emit({room: transformed_room, index: index});
        return transformed_room;
      });
  }

  updateRoom(room, index){
    const alt_room = room;
    const body = JSON.stringify(room);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch('http://localhost:3000/room-backend/' + room.id, body, {headers: headers})
      .map((response: Response) => {

        const room = response.json().obj;
        const transformed_room = new Room(room._id, room.name, room.description, room.game, alt_room.is_start_room);
      });
  }

  submitChoice(choice, index){
    const alt_choice = choice
    const body = JSON.stringify(choice);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/choice-backend', body, {headers: headers})
      .map((response: Response) => {
        const choice = response.json().obj;
        const transformed_choice = new Choice(choice._id, choice.summery, choice.cause_room, choice.effect_room, choice.game, alt_choice.temp_id);
        this.choiceSaved.emit({choice: transformed_choice, index: index});
        return transformed_choice;
      });
  }

  updateChoice(choice, index){
    const alt_choice = choice;
    const body = JSON.stringify(choice);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch('http://localhost:3000/choice-backend/' + choice.id, body, {headers: headers})
      .map((response: Response) => {

        const choice = response.json().obj;
        const transformed_choice = new Choice(choice._id, choice.summery, choice.cause_room, choice.effect_room, choice.game, alt_choice.temp_id);
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
    return this.http_client.get<Game>('http://localhost:3000/game-backend/' + id)
      .map((response: Response) => {
        const game = response.obj;
        const transformed_game = new Game(game._id, game.name, game.start_room_id, null, game.rooms, game.choices)
        return transformed_game;
      });
  }

  getFullGame(id){ // pulls fully populated game
    return this.http_client.get<Game>('http://localhost:3000/game-backend/populated/' + id)
      .map((response: Response) => {
        const game = response.obj;
        const transformed_game = new Game(game._id, game.name, game.start_room_id, null, game.rooms, game.choices)
        return transformed_game;
      });
  }

  getGamesRooms(id): Observable<Game[]> {
    return this.http_client.get<Room[]>('http://localhost:3000/room-backend/games-rooms/' + id)
      .map((response: Response) => {
        const rooms = response.obj.rooms;
        let transformedRooms: Room[] = [];
        for (let room of rooms){
          transformedRooms.push({id: room._id, name: room.name, description: room.description, game_id: room.game, choice_ids: room.choices })
        }
        ROOMS = transformedRooms;
        this.roomsRetrieved.emit({rooms: ROOMS});
        return ROOMS;
      });
  }   //roomsRetrieved

  getGamesChoices(id): Observable<Game[]> {
    return this.http_client.get<Choice[]>('http://localhost:3000/choice-backend/games-choices/' + id)
      .map((response: Response) => {
        const choices = response.obj.choices;
        let transformedChoices: Choice[] = [];
        for (let choice of choices){
          transformedChoices.push({id: choice._id, summery: choice.summery, cause_room_id: choice.cause_room, effect_room_id: choice.effect_room, game_id: choice.game })
        }
        CHOICES = transformedChoices;
        return CHOICES;
      })
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
