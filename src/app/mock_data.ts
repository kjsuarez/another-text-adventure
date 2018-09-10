import { Game } from './game/game.model';
// import { Room } from './room/room.model';
// import { Choice } from './choice/choice.model';

export const GAMES: Game[] = [
  { id: "0", name: "another text adventure", start_room_id: "0", current_room_id: null },
  { id: "1", name: "Dungeonland", start_room_id: "3", current_room_id: null },
  { id: "2", name: "roomless game", start_room_id: null, current_room_id: null }

];

// export const ROOMS: Room[] = [
//   { id: "0", name: "bedroom", description: "You wake up in your bedroom. You see two doors", game_id: "0" },
//   { id: "1", name: "hell", description: "Oh fuck! You find your self in the 9th cirle of hell.", game_id: "0" },
//   { id: "2", name: "kitchen", description: "You're in the kitchen. Since when does the kitchen branch off the bedroom? Huh, where to next?", game_id: "0" },
//   { id: "3", name: "dungeon", description: "You wake up in a dark cell. You see two doors", game_id: "1" }
// ];
//
// export const CHOICES: Choice[] = [
//   { id: "0", summery: "a red door", cause_room_id: "0", effect_room_id: "1", game_id: "0" },
//   { id: "1", summery: "a blue door", cause_room_id: "0", effect_room_id: "2", game_id: "0" },
//   { id: "2", summery: "a black pit", cause_room_id: "1", effect_room_id: "0", game_id: "0" },
//   { id: "3", summery: "out an open window", cause_room_id: "2", effect_room_id: "0", game_id: "0" },
//   { id: "4", summery: "recede into your own mind", cause_room_id: "2", effect_room_id: "0", game_id: "0" }
// ];
