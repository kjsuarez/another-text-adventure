import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";
import { GameComponent } from "./game.component";
import { RoomComponent } from "./room.component";


@NgModule({
    declarations: [
      AppComponent,
      GameComponent,
      RoomComponent
    ],
    imports: [
      BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {

}

//
// import { RoomComponent } from "./room.component";
// import { ChoiceComponent } from "./choice.component";
//
// @NgModule({
//     declarations: [
//       AppComponent,
//       GameComponent,
//       RoomComponent,
//       ChoiceComponent
