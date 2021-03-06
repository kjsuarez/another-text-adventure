import { Component, OnInit } from '@angular/core';
import { Game } from './game.model';
import { GameService } from './game.service';
import { AuthService } from '../authentication/auth.service';
import { PlayerService } from './game_player.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ["./game.component.css"]
})





export class GameComponent implements OnInit{
  current_room = null;
  has_save_data = false;

  constructor(private gameService: GameService,
    private gamePlayer: PlayerService,
    private authService: AuthService,
    private route: ActivatedRoute
  ){}

  ngOnInit(){
    console.log("game init")
    this.getGameAssets()
  }

  handleSaveData(){
    console.log("inside handleSaveData")
    this.gamePlayer.getSaveData()
    .subscribe((response: any) => {
      console.log("backend response:")
      console.log(response)
      if(!response.obj){
        console.log("no save data found")
        this.gamePlayer.startSaveData()
        .subscribe((response: any) => {
          console.log("response id from new save data:")
          console.log(response.obj.id)
          this.current_room = this.gamePlayer.startRoom()
          this.gamePlayer.setCurrentRoom(this.current_room)
          this.gamePlayer.setSaveId(response.obj._id)
          console.log("save_id:")
          console.log(this.gamePlayer.saveId())
        });
      }else{
        console.log("save data found:")
        console.log(response.obj)
        this.current_room = response.obj.current_room;
        this.has_save_data = true;
        this.gamePlayer.setCurrentRoom(this.current_room)
        this.gamePlayer.setSaveId(response.obj._id)
        console.log("save_id:")
        console.log(this.gamePlayer.saveId())
      }
    });
  }

  getGameAssets(){
    console.log("inside getGameAssets")
    this.gameService.getFullGame(this.gameId())
      .subscribe(game => {
        console.log("inside getFullGame subscribe, game looks like this:")
        console.log(game)
        this.gamePlayer.setAssets(game);
        if(this.authService.getToken()){
          this.handleSaveData()
        }
      });
  }

  gameId(){
    return this.route.params['value']['id'];
  }

  hasRooms(){
    return this.gamePlayer.hasRooms();
  }

  restart(){
    return this.gamePlayer.restartGame();
  }

  gameName(){
    return this.gamePlayer.game.name
  }

}
