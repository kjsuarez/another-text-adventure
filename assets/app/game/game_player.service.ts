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
  deleted_rooms: Room[] = [];
  choices: Choice[] = [];
  current_room = null;

  


}
