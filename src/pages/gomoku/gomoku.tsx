import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { CellStatus, GameStatus } from "../../interfaces/game.interfaces";
import { Page } from "../../components/page";
import { Button } from "../../components/button";
import { IResultRef, Result } from "../../components/result";
import { Board, IBoardRef } from "./board";
import { findBestMove, negamax } from "../../algorithms/negmax";


const ActionBar = styled.section`
    position: fixed;
    bottom: 50px;
    z-index: 1000;
`;


export const GomokuPage = () => {
    const boardRef = useRef<IBoardRef>(null);
    const resultRef = useRef<IResultRef>(null);

    useEffect(() => {
        resultRef.current?.hide();
    });

    const onStatusChange = useCallback((status: GameStatus) => {
        if (status === GameStatus.OnGoing) return;
        console.log(status);

        setTimeout(() => {
            resultRef.current?.show(status);
        }, 400);
    }, []);

    const onPlayerPlaced = useCallback((board: CellStatus[][]) => {
        setTimeout(() => {
            const res = findBestMove(board);
            console.log(res);
            boardRef.current?.placeChess(res.x, res.y);
        }, 100);
    }, []);


    const onClickRestart = useCallback(() => {
        boardRef.current?.restart();
        resultRef.current?.hide();
    }, []);

    return (
        <Page>
            <Result ref={resultRef} />
            <Board onPlayerPlaced={onPlayerPlaced} onStatusChange={onStatusChange} ref={boardRef} />

            <ActionBar>
                <Button onClick={onClickRestart}>Restart</Button>
            </ActionBar>
        </Page>
    );
};
