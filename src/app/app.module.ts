import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material";


import { AppComponent } from './app.component';
import { HeaderComponent } from "./header.component";
// import { LoginComponent } from "./authentication/login.component";
import { SignupComponent } from "./authentication/signup.component";
// import { ProfileComponent } from "./authentication/profile.component";
import { GameComponent } from "./game/game.component";
//import { RoomComponent } from "./room/room.component";
//import { ChoiceComponent } from "./choice/choice.component";
import { PublicGameListComponent } from "./game/public_game_list.component";
//import { GameEditorComponent } from "./game/game_editor.component";
import { GameBuilderComponent } from "./game/game_builder.component";
import { GameService } from './game/game.service';
// import { PlayerService } from './game/game_player.service';
// import { ChoiceService } from './choice/choice.service';
import { AuthService } from './authentication/auth.service';
// import { AuthGuard } from "./authentication/auth.guard";
// import { OwnershipGuard } from "./authentication/ownership.guard";


import { routing } from "./app.routing";

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PublicGameListComponent,
    GameBuilderComponent,
    HeaderComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    HttpClientModule,
    HttpModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
