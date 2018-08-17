import { Component } from '@angular/core';
import { Game } from './game.model';
import { GameService } from './game.service';
import { PlayerService } from './game_player.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'game',
  templateUrl: './game.component.html'
})

export class GameComponent implements OnInit{
  constructor(private gameService: GameService, private gamePlayer: PlayerService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.getGameAssets()
  }

  getGameAssets(){
    this.gameService.getFullGame(this.gameId())
      .subscribe(game => {
        this.gamePlayer.setAssets(game);
      });
  }

  gameId(){
    return this.route.params._value.id;
  }

  hasRooms(){
    return this.gamePlayer.hasRooms();
  }

}
