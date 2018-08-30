import { Component, OnInit } from '@angular/core';
import { GameService } from './game/game.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './authentication/auth.service';
import { User } from './authentication/user.model'

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit{

  current_user: User;

  constructor(private gameService: GameService, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(){
    if(this.authService.getId()){
      console.log("hereherehere")
      this.authService.getUser()
        .subscribe(user => {
          this.setUser(user)
        });
    }

  }

  setUser(user){
    if(user){
      this.current_user = user
    }
  }

  submitGame(){
    const game: Game = {id: null, name: "a test", start_room_id: null, current_room_id: null };
    this.gameService.submitGame(game)
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      );
  }
}
