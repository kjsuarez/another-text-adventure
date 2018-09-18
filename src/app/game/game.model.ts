export class Game {
  constructor(
    public name: string,
    public start_room_id: string,
    public id?: string,
    public current_room_id?: string,
    public room_ids?: string[],
    public choice_ids?: string[]
  ){}
}
