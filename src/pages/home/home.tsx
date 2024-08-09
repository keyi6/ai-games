import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { Page } from "../../components/page";
import styled from "styled-components";

const Title = styled.h1`
    color: #fff;
    font-size: 6em;
`;

const About = styled.div`
    position: absolute;
    bottom: 40px;
    & a {
        all: unset;
        cursor: pointer;
        text-decoration: underline;
        color: #fff;
    }
`;

export const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Page style={{ gap: 20 }}>
            <Title>Games</Title>
            <Button onClick={() => navigate("/tic-tac-toe")} delay={true}>Tic Tac Toe</Button>
            <Button onClick={() => navigate("/gomoku")} delay={true}>Gomoku</Button>
            <About>
                <a target="_blank" href="https://github.com/keyi6/ai-games/" rel="noopener noreferrer">https://github.com/keyi6/ai-games/</a>
            </About>
        </Page>
    );
};
