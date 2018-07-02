import { Component } from '@angular/core';

@Component({
  selector: 'game',
  templateUrl: './game.component.html'
})

export class GameComponent {
  list: Object[] = [];
  tempGame = {
    rooms: [
      {room_name: "bedroom",
        choices: [
                  {name:"choice1", body: "fuck"},
                  {name:"choice2", body: "marry"},
                  {name:"choice3", body: "kill"}
                 ]
      }
    ],
    current_room_id: 0
  };

  current_room = this.tempGame["rooms"][this.tempGame["current_room_id"]];
  current_choices = this.current_room["choices"];
  this.list = this.current_choices;

}
