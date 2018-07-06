import { Component } from '@angular/core';
import { Game } from './game.model';
import { GameService } from './game.service';
import { Room } from './room.model';
import { Choice } from './choice.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'game',
  templateUrl: './game.component.html'
})

export class GameComponent {
  constructor(private gameService: GameService, private route: ActivatedRoute) {}

  gameId(){
    return this.route.params._value.id;
  }

}
