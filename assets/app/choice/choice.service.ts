import { Injectable, EventEmitter } from "@angular/core";
import { Observable, of } from 'rxjs';

import { GAMES, ROOMS, CHOICES } from '../mock_data';
import { GameService } from '../game/game.service';

@Injectable({
  providedIn: 'root'
})

export class ChoiceService{

  constructor(private gameService: GameService) { }


}
