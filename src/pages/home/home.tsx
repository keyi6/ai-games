import React from "react";
import { Link } from "react-router-dom";

export const HomePage = () => {
    return (
        <div>
            <Link to="/tic-tac-toe">Tic Tac Toe</Link>
            <Link to="/gomoku">Gomoku</Link>
        </div>
    );
};
