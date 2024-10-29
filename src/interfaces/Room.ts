import Game from "@app/game/Game";
import { Player } from "@app/player/Player";
import Participant from "@app/room/Participant";
import User from "@app/user/User";
import { Cell } from "@app/Utils";

export interface Room {
    id: string;
    name: string;
    competitor: Participant | null;
    owner: Participant;
    guests: User[];
    createdTime: string;
}
