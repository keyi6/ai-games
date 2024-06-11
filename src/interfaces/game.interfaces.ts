export enum CellStatus {
    Blank = "Blank",
    Player1 = "Player1",
    Player2 = "Player2",
}

export enum GameStatus {
    OnGoing = "OnGoing",
    Tie = "Tie",
    Player1Won = "Player1 Won",
    Player2Won = "Player2 Won",
}

export interface IMove {
    x: number;
    y: number;
    status: CellStatus;
    seq: number;
}
