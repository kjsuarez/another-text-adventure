import { Routes, RouterModule } from "@angular/router";
import { GameComponent } from "./game/game.component";
import { RoomComponent } from "./room/room.component";
import { ChoiceComponent } from "./choice/choice.component";
import { PublicGameListComponent } from "./game/public_game_list.component";
import { GameEditorComponent } from "./game/game_editor.component";
import { GameBuilderComponent } from "./game/game_builder.component";
import { LoginComponent } from "./authentication/login.component";
import { SignupComponent } from "./authentication/signup.component";
import { ProfileComponent } from "./authentication/profile.component";


const APP_ROUTES: Routes = [
  {path: '', redirectTo: '/public', pathMatch: 'full'},
  {path: 'game/:id', component: GameComponent},
  {path: 'public', component: PublicGameListComponent},
  {path: 'editor/:id', component: GameEditorComponent},
  {path: 'builder', component: GameBuilderComponent},
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/signup', component: SignupComponent},
  {path: 'user', component: ProfileComponent}
]

export const routing = RouterModule.forRoot(APP_ROUTES);
