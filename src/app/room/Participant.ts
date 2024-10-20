import User from "@app/user/User";

enum Status {
    WAITING = "WAITING",
    READY = "READY",
}

export default class Participant {
    info: User;
    status: Status;

    constructor(user: User) {
        this.info = user;
        this.status = Status.WAITING;
    }
}
