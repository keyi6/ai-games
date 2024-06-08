import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage, TicTacToePage, GomokuPage } from './pages';
import './App.css';

const router = createBrowserRouter([
    {
        path: "/tic-tac-toe",
        element: <TicTacToePage />,
    },
    {
        path: "/gomoku",
        element: <GomokuPage />
    },
    {
        path: "/",
        element: <HomePage />
    },
]);

export const App = () => {
    return (
        <RouterProvider router={router} />
    );
};
