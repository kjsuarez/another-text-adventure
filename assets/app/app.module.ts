import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header.component";
import { GameComponent } from "./game.component";
import { RoomComponent } from "./room.component";
import { ChoiceComponent } from "./choice.component";
import { PublicGameListComponent } from "./public_game_list.component";
import { GameEditorComponent } from "./game_editor.component";
import { GameService } from './game.service';

import { routing } from "./app.routing";


@NgModule({
    declarations: [
      AppComponent,
      HeaderComponent,
      GameComponent,
      RoomComponent,
      ChoiceComponent,
      PublicGameListComponent,
      GameEditorComponent
    ],
    imports: [
      BrowserModule,
      routing
    ],
    providers: [GameService],
    bootstrap: [AppComponent]
})
export class AppModule {

}
