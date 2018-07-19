export class Room {
  constructor(
    public id?: string,
    public name: string,
    public description: string,
    public game_id?: string,
    public is_start_room?: string,
    public temp_id?: string
  ){}
}
