import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable, of, Subject } from 'rxjs';
import { map } from "rxjs/operators";

import { GAMES, ROOMS, CHOICES} from '../mock_data';
import { Game } from './game.model';
import { Room } from '../room/room.model';
import { Choice } from '../choice/choice.model';
import { AuthService } from '../authentication/auth.service';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/";

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



  constructor(
    private authService: AuthService,
    private http: Http,
    private httpClient: HttpClient) {}

  httpOptions = {
    'Content-Type': 'application/json',
    'authorization': 'Bearer ' + this.authService.getToken()
  }

  GAMES: Game[];
  ROOMS: Room[];
  CHOICES: Choice[];

  headerWithToken(token){
    return {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + token
        }
  }

  batchPostRooms(rooms){
    const alt_rooms = rooms
    const body = JSON.stringify(rooms);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(BACKEND_URL + 'room-backend/batch', body, {headers: headers})
      .pipe(
        map((response: any) => {
          const rooms_json = response.json().obj;
          const id_pairs = rooms_json
          this.roomsBatchSaved.emit(id_pairs);
          return id_pairs;
        })
      )
  }

  batchPostChoices(choices){
    const alt_choices = choices
    const body = JSON.stringify(choices);
    console.log("what I send to post batch choices backend")
    console.log(body)
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(BACKEND_URL + 'choice-backend/batch', body, {headers: headers})
      .pipe(
        map((response: any) => {
          console.log("what I get back from post batch choices backend")
          console.log(response.json().obj)
          // const choices_json = response.obj;
          // const id_pairs = choices_json
          // console.log("should be identical to above")
          // console.log(id_pairs)
          // this.choicesBatchSaved.emit(id_pairs);
          // return id_pairs;
          const choices_json = response.json().obj;
          const id_pairs = choices_json
          this.choicesBatchSaved.emit(id_pairs);
          return id_pairs;
        })
      )
  }

  batchUpdateRooms(rooms){
    const alt_rooms = rooms
    const body = JSON.stringify(rooms);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.httpClient.patch(BACKEND_URL + 'room-backend/batch', body, {headers: this.httpOptions})
      .pipe(
        map((response: any) => {

        })
      )
  }

  batchUpdateChoices(choices){
    const alt_choices = choices
    const body = JSON.stringify(choices);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch(BACKEND_URL + 'choice-backend/batch', body, {headers: headers})
      .pipe(
        map((response: any) => {

        })
      )
  }


  submitGame(game){
    const token = localStorage.getItem('token')
    const body = JSON.stringify(game);
    console.log("inside service, about to post this blank game:")
    console.log(body)
    return this.httpClient.post(BACKEND_URL + 'game-backend', game, {headers: this.httpOptions})
    .pipe(
      map((response: any) => {
        const game = response.obj;
        console.log("inside service, returned game with id looks like this:")
        console.log(response)
        const transformed_game: Game = {id: game._id, name: game.name, start_room_id: null}
        this.gameSaved.emit(transformed_game);
        return transformed_game;
      })
    )

  }

  updateGame(game: Game){
    const token = localStorage.getItem('token')
    const headers = this.headerWithToken(token)
    const body = JSON.stringify(game);
    console.log("body in updateGame:")
    console.log(body)
    return this.httpClient.patch(BACKEND_URL + 'game-backend/' + game.id, body, {headers: this.headerWithToken(token)})
      .pipe(
        map((response: any) => {
          const game = response.obj;
          const transformed_game: Game = {id: game._id, name: game.name, start_room_id: game.start_room_id}
        })
      )
  }


  submitRoom(room, index){
    const alt_room = room
    const body = JSON.stringify(room);
    return this.httpClient.post(BACKEND_URL + 'room-backend', body, {headers: this.httpOptions})
      .pipe(
        map((response: any) => {
          const room = response.json().obj;
          const transformed_room: Room = {id: room._id, name: room.name, description: room.description, game_id: room.game, is_start_room: alt_room.is_start_room, temp_id: alt_room.temp_id}
          this.roomSaved.emit({room: transformed_room, index: index});
          return transformed_room;
        })
      )
  }

  updateRoom(room, index){
    const token = localStorage.getItem('token')
    const alt_room = room;
    const body = JSON.stringify(room);
    console.log("what updateRoom sends to backend:")
    console.log(body)
    return this.httpClient.patch(BACKEND_URL + 'room-backend/' + room.id, body, {headers: this.headerWithToken(token)})
      .pipe(
        map((response: any) => {

          const room = response.obj;
          const transformed_room: Room = {id: room._id, name: room.name, description: room.description, game_id: room.game, is_start_room: alt_room.is_start_room}
        })
      )
  }

  submitChoice(choice, index){
    const alt_choice = choice
    const body = JSON.stringify(choice);
    return this.httpClient.post(BACKEND_URL + 'choice-backend', body, {headers: this.httpOptions})
      .pipe(
        map((response: any) => {
          const choice = response.json().obj;
          const transformed_choice: Choice = {id: choice._id, summery: choice.summery, cause_room_id: choice.cause_room, effect_room_id: choice.effect_room, game_id: choice.game, temp_id: alt_choice.temp_id}
          this.choiceSaved.emit({choice: transformed_choice, index: index});
          return transformed_choice;
        })
      )
  }

  updateChoice(choice, index){
    const token = localStorage.getItem('token')
    const alt_choice = choice;
    const body = JSON.stringify(choice)
    console.log("what updateChoice sends to backend:")
    console.log(body)

    return this.httpClient.patch(BACKEND_URL + 'choice-backend/' + choice.id, body, {headers: this.headerWithToken(token)})
      .pipe(
        map((response: any) => {

          const choice = response.obj;
          const transformed_choice: Choice = {id: choice._id, summery: choice.summery, cause_room_id: choice.cause_room, effect_room_id: choice.effect_room, game_id: choice.game, temp_id: alt_choice.temp_id}
        })
      )
  }


  // updateGame(game: Game){
  //   const token = localStorage.getItem('token')
  //   const headers = this.headerWithToken(token)
  //   const body = JSON.stringify(game);
  //   console.log("body in updateGame:")
  //   console.log(body)
  //   return this.httpClient.patch(BACKEND_URL + 'game-backend/' + game.id, body, {headers: this.headerWithToken(token)})
  //     .pipe(
  //       map((response: any) => {
  //         const game = response.obj;
  //         const transformed_game: Game = {id: game._id, name: game.name, start_room_id: game.start_room_id}
  //       })
  //     )
  // }

  publicGames() {
    // this.httpClient.get<{message: string, obj: Game[]}>(BACKEND_URL + 'game-backend')
    // .subscribe((gameData) => {
    //
    // });
    return this.httpClient.get(BACKEND_URL + 'game-backend')
      .pipe(
        map((response: any) => {
          const games = response.obj;//
          let transformedGames: Game[] = [];
          for (let game of games){
            transformedGames.push({id: game._id, name: game.name, start_room_id: null, current_room_id: null })
          }
          console.log("returned games:")
          console.log(transformedGames)
          return transformedGames;
          //GAMES = transformedGames;
          //return GAMES;
        })



      )

  }

  getGame(id){
    return this.httpClient.get<Game>(BACKEND_URL + 'game-backend/' + id)
      .pipe(
        map((response: any) => {
          const game = response.obj;
          const transformed_game: Game = {id: game._id, name: game.name, start_room_id: game.start_room_id, current_room_id: null, room_ids: game.rooms, choice_ids: game.choices}
          return transformed_game;
        })
      )
  }

  getFullGame(id){ // pulls fully populated game
    return this.httpClient.get<Game>(BACKEND_URL + 'game-backend/populated/' + id)
      .pipe(
        map((response: any) => {
          const game = response.obj;
          const transformed_game: Game = {id: game._id, name: game.name, start_room_id: game.start_room_id, current_room_id: null, room_ids: game.rooms, choice_ids: game.choices}
          return transformed_game;
        })
      )
  }

  getGamesRooms(id) {
    return this.httpClient.get(BACKEND_URL + 'room-backend/games-rooms/' + id)
      .pipe(
        map((response: any) => {
          const rooms = response.obj.rooms;
          let transformedRooms: Room[] = [];
          for (let room of rooms){
            transformedRooms.push({id: room._id, name: room.name, description: room.description, game_id: room.game, choice_ids: room.choices })
          }
          //ROOMS = transformedRooms;
          this.roomsRetrieved.emit({rooms: transformedRooms});
          return transformedRooms;
        })
      )
  }   //roomsRetrieved

  getGamesChoices(id) {
    return this.httpClient.get(BACKEND_URL + 'choice-backend/games-choices/' + id)
      .pipe(
        map((response: any) => {
          const choices = response.obj.choices;
          let transformedChoices: Choice[] = [];
          for (let choice of choices){
            transformedChoices.push({id: choice._id, summery: choice.summery, cause_room_id: choice.cause_room, effect_room_id: choice.effect_room, game_id: choice.game })
          }
          //CHOICES = transformedChoices;
          return transformedChoices;
        })
      )
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
      let this_games_rooms = this.belongsToGame(this.current_game(), ROOMS);
      let current_room = this.checkCurrentRoom(this.current_game(), this_games_rooms)[0];

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

  // checkCurrentRoom(room){ // filter method
  //   return (room.id == this.current_room_id)
  // }

  checkCurrentRoom(game, rooms){
    let res = [];
    rooms.forEach((room, index) => {
      if(game.current_room_id == room.id){
        res.push(room)
      }
    })
    return res
  }

  // checkStartRoom(room){ // filter method
  //   return (room.id == this.start_room_id)
  // }

  checkStartRoom(game, rooms){
    let res = [];
    rooms.forEach((room, index) => {
      if(game.start_room_id == room.id){
        res.push(room)
      }
    })
    return res
  }

  hasRooms(){
    let this_games_rooms = this.belongsToGame(this.current_game(), ROOMS)  //ROOMS.filter(this.belongsToGame, this.current_game());
    return this_games_rooms.length > 0
  }




  // room methods

  startRoom(){
    var this_games_rooms = this.belongsToGame(this.current_game(), ROOMS);
    var start_room = this.checkStartRoom(this.current_game(), this_games_rooms)[0];

    return start_room;
  }

  // belongsToGame(room){ // filter method
  //   return (room.game_id == this.id);
  // }

  belongsToGame(game, rooms){
    let res = [];
    rooms.forEach((room, index) => {
      if(room.game_id == game.id){
        res.push(room)
      }
    })
    return res
  }

  gamesRooms(game){

    return this.belongsToGame(game, ROOMS);
  }

  // resultsFromChoice(room){ // filter method
  //   return (room.id == this.effect_room_id && room.game_id == this.game_id);
  // }

  resultsFromChoice(choice, rooms){
    let res = [];
    rooms.forEach((room, index) => {
      if(room.id == choice.effect_room_id && room.game_id == choice.game_id){
        res.push(room)
      }
    })
    return res;
  }

  choiceResultRoom(choice){
    //return the room this choice leads to
    return this.resultsFromChoice(choice, ROOMS)[0] //ROOMS.filter(this.resultsFromChoice, choice)[0];
  }



  // choice methods

  // belongsToRoom(choice){ // filter method
  //   return (choice.cause_room_id == this.id && choice.game_id == this.game_id);
  // }

  belongsToRoom(room, choices){
    let res = [];
    choices.forEach((choice, index) => {
      if(choice.cause_room_id == room.id && choice.game_id == room.game_id){
        console.log("found it")
        res.push(choice)
      }
    })
    return res
  }

  currentRoomChoices(){
    return this.belongsToRoom(this.currentRoom(), CHOICES)
  }

  changeRoom(choice){
    GAMES[this.current_game().id].current_room_id = choice.effect_room_id;
  }


  roomsChoices(room){
    return this.belongsToRoom(room, CHOICES)
  }

  setResultRoom(choice, room){
    CHOICES[choice.id].effect_room_id = room.id;
  }

  }
