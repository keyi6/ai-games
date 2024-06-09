export enum Status {
    Blank,
    Player1,
    Player2,
}

export interface IMove {
    x: number;
    y: number;
    status: Status;
    seq: number;
}
