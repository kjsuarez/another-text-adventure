export class Choice {
  constructor(
    public summery: string,
    public id?: string,
    public cause_room_id?: string,
    public effect_room_id?: string,
    public game_id?: string,
    public temp_id?: string
  ){}
}
