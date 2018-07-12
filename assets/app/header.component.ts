import { Component } from '@angular/core';
import { GameService } from './game/game.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})

export class HeaderComponent{
  constructor(private gameService: GameService, private route: ActivatedRoute) {}

  edit_id = "";

  testSubmit(){
    const game: Game = {id: null, name: "a test", start_room_id: null, current_room_id: null };
    this.gameService.testSubmit(game)
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      );
  }
}
