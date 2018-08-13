import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header.component";
import { GameComponent } from "./game/game.component";
import { RoomComponent } from "./room/room.component";
import { ChoiceComponent } from "./choice/choice.component";
import { PublicGameListComponent } from "./game/public_game_list.component";
import { GameEditorComponent } from "./game/game_editor.component";
import { GameBuilderComponent } from "./game/game_builder.component";
import { GameService } from './game/game.service';
import { PlayerService } from './game/game_player.service';
import { ChoiceService } from './choice/choice.service';

import { routing } from "./app.routing";


@NgModule({
    declarations: [
      AppComponent,
      HeaderComponent,
      GameComponent,
      RoomComponent,
      ChoiceComponent,
      PublicGameListComponent,
      GameEditorComponent,
      GameBuilderComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      routing,
      HttpClientModule,
      HttpModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {

}
