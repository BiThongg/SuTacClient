export interface PersonMoveRequest {
  room_id: string;
  point: { x: number, y: number };
  user_id: string;
}

