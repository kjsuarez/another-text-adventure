export class Game {
  constructor(
    public id: number,
    public name: string,
    public start_room_id: string,
    public current_room_id?: string
  ){}
}
