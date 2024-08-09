import React, { PropsWithChildren, useCallback, useRef, useState } from "react";
import styled from "styled-components";

const ButtonWrapper = styled.button`
    all:  unset;
    min-width: 140px;
    text-align: center;
    color: #333;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 2.8px;
    background-color:  #fff;
    padding: 15px 50px;
    border-radius: 5rem;
    box-shadow:  1px 2.9px 16px #aaa;
    transition: 0.6s cubic-bezier(0.01, 1.69, 0.99, 0.94); 
    cursor: pointer;

    &:hover {
        box-shadow: 3px 4.9px 16px #aaa;
        letter-spacing:  5px
    }

    &:focus {
        transition: 0.6s cubic-bezier(0.01, 1.69, 0.99, 0.94); 
        padding: 15px 2px;
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        text-align: center;
        font-size: 5rem;
        border-radius: 0%;
    }
`;

export interface IButtonProps {
    onClick?: () => void;
    /**
     * If set true, the `onClick` will be trigger after animation
     */
    delay: boolean;
}

export const Button = ({
    children,
    onClick = () => {},
    delay = false,
}: PropsWithChildren<IButtonProps>) => {
    const [active, setActive] = useState<boolean>(false);
    const ref = useRef<HTMLButtonElement>(null);

    const onClickWithAnimation = useCallback(() => {
        if (active) return;

        if (!delay) onClick();

        setActive(true);
        ref.current?.focus();
        setTimeout(() => {
            setActive(false);
            ref.current?.blur();
            if (delay) onClick();
        }, 700);
    }, [onClick]);

    return (
        <ButtonWrapper ref={ref} onClick={onClickWithAnimation}>
            {children}
        </ButtonWrapper>
    );
};