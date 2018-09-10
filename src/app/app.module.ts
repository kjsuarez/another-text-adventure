import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material";


import { AppComponent } from './app.component';
import { HeaderComponent } from "./header.component";
import { GameComponent } from "./game/game.component";
import { PublicGameListComponent } from "./game/public_game_list.component";
import { GameService } from './game/game.service';

import { routing } from "./app.routing";

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PublicGameListComponent,
    HeaderComponent
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
