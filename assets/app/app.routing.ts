import { Routes, RouterModule } from "@angular/router";
import { GameComponent } from "./game.component";
import { RoomComponent } from "./room.component";
import { ChoiceComponent } from "./choice.component";
import { PublicGameListComponent } from "./public_game_list.component";
import { GameEditorComponent } from "./game_editor.component";


const APP_ROUTES: Routes = [
  {path: '', redirectTo: '/public', pathMatch: 'full'},
  {path: 'game', component: GameComponent},
  {path: 'public', component: PublicGameListComponent},
  {path: 'editor/:id', component: GameEditorComponent}
]

export const routing = RouterModule.forRoot(APP_ROUTES);
