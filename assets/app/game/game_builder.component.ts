import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Game } from './game.model';
import { GameService } from './game.service';

@Component({
  selector: 'game-builder',
  templateUrl: './game_builder.component.html'
})

export class GameBuilderComponent implements OnInit{

  game: Game = {name: "Game Name"};
  current_game: Game;

  constructor(private gameService: GameService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.gameService.gameIsEdit.subscribe(
      (game: Game) => this.game = game;
      console.log("here?");
    );
  }

  onSubmit(form: NgForm){
    if(this.game.id) {
      // the game already exists, so we're editing
      this.game.name = form.value.name;
      this.gameService.updateGame(this.game)
        .subscribe(
          result => console.log(result)
        );

    } else {
      const game: Game = {id: null, name: form.value.name, start_room_id: null, current_room_id: null };
      this.gameService.submitGame(game)
        .subscribe(
          data => console.log(data),
          error => console.error(error)
        );
    }

    form.resetForm();

  }



}
