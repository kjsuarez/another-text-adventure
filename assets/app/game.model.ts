export class Game {
  constructor(
    public id: string,
    public name: string,
    public start_room_id: string,
    public current_room_id?: string
  ){}
}
