import { Game } from './game.model';
import { Room } from './room.model';
import { Choice } from './choice.model';

export class GameService{

  current_game_id = 0

  games = [
    new Game(0, "another text adventure", 0),
    new Game(1, "Dungeonland", 3)
  ]
  rooms = [
    new Room(0, "bedroom", "You wake up in your bedroom. You see two doors", 0),
    new Room(1, "hell", "Oh fuck! You find your self in the 9th cirle of hell.", 0),
    new Room(2, "kitchen", "You're in the kitchen. Since when does the kitchen branch off the bedroom? Huh, where to next?", 0),
    new Room(3, "dungeon", "You wake up in your dungeon. You see two doors", 1)
  ]
  choices = [
    new Choice(0, "a red door", 0, 1, 0),
    new Choice(1, "a pulsing black pit", 1, 0, 0),
    new Choice(2, "a blue door", 0, 2, 0),
    new Choice(3, "through the open window", 2, 0, 0),
    new Choice(4, "your ooooown miiiind~", 2, 0, 0)
  ]

  current_game(){
    return this.games[this.current_game_id];
  }

  setCurrentGameId(id){
    this.current_game_id = id
    console.log("current_game_id: " + this.current_game_id);
  }

  belongsToGame(room){
    return (room.game_id == this.id);
  }

  checkCurrentRoom(room){
    return (room.id == this.current_room_id)
  }

  belongsToRoom(choice){
    return (choice.cause_room_id == this.id && choice.game_id == this.game_id);
  }

  resultsFromChoice(room){
    return (room.id == this.effect_room_id && room.game_id == this.game_id);
  }

  currentRoom(){
    var this_games_rooms = this.rooms.filter(this.belongsToGame, this.current_game());
    var current_room = this_games_rooms.filter(this.checkCurrentRoom, this.current_game())[0];

    return current_room;
  }

  currentRoomChoices(){
    return this.choices.filter(this.belongsToRoom, this.currentRoom());
  }

  changeRoom(choice){
    this.current_game().current_room_id = choice.effect_room_id;
  }

  publicGames(){
    return this.games;
  }

  gamesRooms(game){
    return this.rooms.filter(this.belongsToGame, game);
  }

  roomsChoices(room){
    return this.choices.filter(this.belongsToRoom, room);
  }

  getGame(id){
    return this.games[id];
  }

  choiceResultRoom(choice){
    //return the room this choice leads to
    console.log(this.rooms.filter(this.resultsFromChoice, choice));
    return this.rooms.filter(this.resultsFromChoice, choice)[0];
  }

}
