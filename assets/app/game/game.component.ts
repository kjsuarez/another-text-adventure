import { Component } from '@angular/core';
import { Game } from './game.model';
import { GameService } from './game.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'game',
  templateUrl: './game.component.html'
})

export class GameComponent implements OnInit{
  constructor(private gameService: GameService, private route: ActivatedRoute) {}
    ngOnInit(){

  }

  gameId(){
    return this.route.params._value.id;
  }

  hasRooms(){
    return this.gameService.hasRooms();
  }

}
