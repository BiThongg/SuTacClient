import User from "../user/User";
import Game from "../game/Game";
import Participant, { Status } from "./Participant";

export default class RoomClass {
  id: string;
  name: string;
  competitor: Participant | null = null;
  owner: Participant;
  guests: User[] = [];
  game!: Game; // what means of this statement? game!: Game

  constructor(id: string, name: string, owner: User) {
    this.id = id;
    this.name = name;
    this.owner = new Participant(owner);
  }

  addGuest(user: User): void {
    this.guests.push(user);
  }

  addCompetitor(user: User | null): void {
    if (user === null) {
      throw new Error("User is null");
    }
    this.competitor = new Participant(user);
    if (user.id.startsWith("BOT_")) {
      this.competitor.status = Status.WAITING;
    }
  }

  getOwner(): User {
    return this.owner.info;
  }

  onLeave(userId: string): void {
    if (userId === this.owner.info.id) {
      this.owner = this.competitor as Participant;
      this.competitor = null;
    } else if (this.competitor && userId === this.competitor.info.id) {
      this.competitor = null;
    } else {
      this.guests = this.guests.filter((user) => user.id !== userId);
    }
  }

  onJoin(user: User): void {
    this.guests.push(user);
  }

  onDispose(): void {
    // Dispose logic can be added here
  }

  isFull(): boolean {
    return !!this.competitor && !!this.owner; // Adjust based on max guests allowed
  }

  canAction(owner: User): boolean {
    return owner.id === this.owner.info.id;
  }

  isReady(): boolean {
    return (
      this.competitor?.status === Status.READY &&
      this.owner.status === Status.READY
    );
  }

  changeStatus(userId: string): void {
    const participant =
      this.owner.info.id === userId ? this.owner : this.competitor;
    if (participant) {
      participant.status =
        participant.status === Status.WAITING ? Status.READY : Status.WAITING;
    }
  }

  participantIds(): string[] {
    const ids = this.guests.map((guest) => guest.id);
    ids.push(this.owner.info.id);
    if (this.competitor) {
      ids.push(this.competitor.info.id);
    }
    return ids;
  }
}
