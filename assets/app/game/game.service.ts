import { Game } from './game.model';
import { Room } from '../room/room.model';
import { Choice } from '../choice/choice.model';

export class GameService{

  current_game_id = "0";


  games = [
    new Game("0", "another text adventure", "0", null),
    new Game("1", "Dungeonland", "3", null)
  ]
  rooms = [
    new Room("0", "bedroom", "You wake up in your bedroom. You see two doors", "0"),
    new Room("1", "hell", "Oh fuck! You find your self in the 9th cirle of hell.", "0"),
    new Room("2", "kitchen", "You're in the kitchen. Since when does the kitchen branch off the bedroom? Huh, where to next?", "0"),
    new Room("3", "dungeon", "You wake up in your dungeon. You see two doors", "1")
  ]
  choices = [
    new Choice("0", "a red door", "0", "1", "0"),
    new Choice("1", "a pulsing black pit", 1, "0", "0"),
    new Choice("2", "a blue door", "0", "2", "0"),
    new Choice("3", "through the open window", "2", "0", "0"),
    new Choice("4", "your ooooown miiiind~", "2", "0", "0")
  ]

  current_game(){
    return this.games[this.current_game_id];
  }

  startRoom(){
    var this_games_rooms = this.rooms.filter(this.belongsToGame, this.current_game());
    var start_room = this_games_rooms.filter(this.checkStartRoom, this.current_game())[0];

    return start_room;
  }

  setCurrentGameId(id){
    this.current_game_id = id
  }

  belongsToGame(room){
    return (room.game_id == this.id);
  }

  checkCurrentRoom(room){
    return (room.id == this.current_room_id)
  }

  checkStartRoom(room){
    return (room.id == this.start_room_id)
  }

  belongsToRoom(choice){
    return (choice.cause_room_id == this.id && choice.game_id == this.game_id);
  }

  resultsFromChoice(room){
    return (room.id == this.effect_room_id && room.game_id == this.game_id);
  }

  currentRoom(){
    if(this.current_game().current_room_id){
      var this_games_rooms = this.rooms.filter(this.belongsToGame, this.current_game());
      var current_room = this_games_rooms.filter(this.checkCurrentRoom, this.current_game())[0];

      return current_room;
    }
    else{
      this.setCurrentRoomId(this.current_game(), this.startRoom());
      return this.startRoom();
    }
  }

  currentRoomChoices(){
    return this.choices.filter(this.belongsToRoom, this.currentRoom());
  }

  changeRoom(choice){
    console.log("in service");
    console.log(this.current_game());
    console.log(choice.effect_room_id);
    this.games[this.current_game().id].current_room_id = choice.effect_room_id;
    console.log("after change: ")
    console.log(this.current_game().current_room_id);
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
    return this.rooms.filter(this.resultsFromChoice, choice)[0];
  }

  setStartRoom(game, room){
    this.games[game.id].start_room_id = room.id;
    // console.log(this.games);
  }

  setResultRoom(choice, room){
    this.choices[choice.id].effect_room_id = room.id;
  }

  isStartRoom(game, room){
    return this.games[game.id].start_room_id === room.id;
  }

  setCurrentRoomId(game, room){
    this.games[game.id].current_room_id = room.id;
  }

}
