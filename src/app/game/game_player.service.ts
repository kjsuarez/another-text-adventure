import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable, of } from 'rxjs';

import { GAMES//,
  // ROOMS,
  // CHOICES
   } from '../mock_data';
import { Game } from './game.model';
// import { Room } from '../room/room.model';
// import { Choice } from '../choice/choice.model';
// import { User } from '../authentication/user.model';
// import { AuthService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root'
})

export class PlayerService{
  game: Game;
  current_game: Game;
  // rooms: Room[] = [];
  // choices: Choice[] = [];
  // current_room = null;
  // save_id = null;

  constructor(
    // private authService: AuthService,
     private http: Http,
      private http_client: HttpClient) {}

  // headerWithToken(token){
  //   return {
  //         'Content-Type': 'application/json',
  //         'authorization': 'Bearer ' + token
  //       }
  // }
  //
  // setSaveId(id){
  //   this.save_id = id
  // }
  //
  // saveId(){
  //   return this.save_id
  // }
  //
  // setAssets(populated_game){
  //
  //   this.choices = [];
  //
  //   populated_game.choice_ids.forEach((choice, index) => {
  //     // set this.choices
  //     this.choices.push({id: choice._id, summery: choice.summery, cause_room_id: choice.cause_room, effect_room_id: choice.effect_room, game_id: choice.game })
  //     // turn choice_ids into actual ids
  //     populated_game.choice_ids[index] = choice._id
  //   });
  //
  //   populated_game.room_ids.forEach((room, index) => {
  //     this.rooms.push({id: room._id, name: room.name, description: room.description, game_id: room.game, choice_ids: room.choices })
  //     populated_game.room_ids[index] = room._id
  //   });
  //
  //   this.game = populated_game
  //   this.current_room = null
  //
  //
  // }
  //
  // roomWithId(id){
  //   return this.rooms.filter(room => room.id == id)[0];
  // }
  //
  // setCurrentRoom(id){
  //   this.current_room = this.roomWithId(id)
  //   console.log("current room via player")
  //   console.log(this.current_room)
  // }
  //
  // hasRooms(){
  //   return Array.isArray(this.rooms) && this.rooms.length > 0
  // }
  //
  // checkStartRoom(room){ // filter method
  //   return (room.id == this.start_room_id)
  // }
  //
  // startRoom(){
  //   if(this.game.start_room_id){
  //     return this.rooms.filter(this.checkStartRoom, this.game)[0];
  //   }else{
  //     return this.rooms[0];
  //   }
  //
  // }
  //
  // currentRoom(){
  //   if(!this.current_room){
  //     return this.startRoom()
  //   }else{
  //     return this.current_room
  //   }
  // }
  //
  // belongsToRoom(choice){ // filter method
  //   return (choice.cause_room_id == this.id);
  // }
  //
  // currentRoomChoices(){
  //   return this.choices.filter(this.belongsToRoom, this.currentRoom());
  // }
  //
  // changeRoom(choice){
  //   this.updateSaveData(choice.effect_room_id)
  //   .subscribe(response => {
  //     console.log("save updated:")
  //     console.log(response)
  //     this.setCurrentRoom(choice.effect_room_id)
  //   });
  //
  // }
  //
  // getSaveData(){
  //   const user_data = this.authService.getAuthData()
  //   const game_id = this.game.id
  //   if(!user_data){
  //     return;
  //   }
  //   const user_id = user_data.userId
  //   return this.http_client.get('http://localhost:3000/save-backend/user/' + user_id + '/game/' + game_id)
  //   .map((response: Response) => {
  //     return response;
  //   });
  // }
  //
  // startSaveData(){
  //   const user_data = this.authService.getAuthData()
  //   const user_id = user_data.userId
  //   const game_id = this.game.id
  //   if(!user_data){
  //     return;
  //   }
  //   const token = user_data.token
  //   const headers = this.headerWithToken(token)
  //   return this.http.post('http://localhost:3000/save-backend/user/' + user_id + '/game/' + game_id, "", {headers: this.headerWithToken(token)})
  //     .map((response: Response) => {
  //       return response.json();
  //     });
  // }
  //
  // updateSaveData(room_id){
  //   const user_data = this.authService.getAuthData()
  //   const save_id = this.save_id
  //   console.log("save_id in update method:")
  //   console.log(this.saveId())
  //   if(!user_data){
  //     return;
  //   }
  //   const token = user_data.token
  //   const headers = this.headerWithToken(token)
  //   const body = JSON.stringify(user_data);
  //   return this.http.patch('http://localhost:3000/save-backend/save/' + save_id + '/room/' + room_id, body, {headers: this.headerWithToken(token)})
  //   .map((response: Response) => {
  //     return response.json();
  //   });
  // }

}
