export enum CellStatus {
    Blank = 0,
    Player1 = 1,
    Player2 = -1,
}

export enum GameStatus {
    OnGoing,
    Tie = "tie",
    Player1Won = "player 1",
    Player2Won = "player 2",
}

export interface IMove {
    x: number;
    y: number;
    status: CellStatus;
    seq: number;
}

export interface Move {
    x: number;
    y: number;
    score: number;
};