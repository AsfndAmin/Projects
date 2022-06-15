import styled, { css } from "styled-components";

import { Container, Row, Col } from "react-bootstrap";

export const MainContainer = styled(Container)``;

export const MainRow = styled(Row)``;

export const MainCol = styled(Col)``;

export const Button = styled.button`
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.58rem;

  background: rgb(254, 255, 137);
  border: none;
  padding: 1rem 0rem;
  width: 15rem;
  border-radius: 30px;
  font-weight: 600;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    transform: scale(1.1);
    transition: all 0.2s linear;
  }
`;
