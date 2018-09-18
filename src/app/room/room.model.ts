export class Room {
  constructor(
    public name: string,
    public description: string,
    public id?: string,
    public game_id?: string,
    public is_start_room?: string,
    public temp_id?: string,
    public choice_ids?: string[]
  ){}
}
