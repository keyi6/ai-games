import React from "react";
import sample from "lodash/sample";
import styled from "styled-components";

const COLOR_LIST = ['#606470', '#3c79ce', '#F9CE00', '#4CAF50', '#FF9800'];

export const Page = styled.main`
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${sample(COLOR_LIST)};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
