import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";
import { GameComponent } from "./game.component";
import { RoomComponent } from "./room.component";
import { ChoiceComponent } from "./choice.component";
import { GameService } from './game.service';


@NgModule({
    declarations: [
      AppComponent,
      GameComponent,
      RoomComponent,
      ChoiceComponent
    ],
    imports: [
      BrowserModule
    ],
    providers: [GameService],
    bootstrap: [AppComponent]
})
export class AppModule {

}
