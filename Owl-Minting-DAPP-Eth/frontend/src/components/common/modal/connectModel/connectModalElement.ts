import styled from "styled-components";
import { Row, Col } from "react-bootstrap";

export const MainModel = styled.div``;

export const ModelsData = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  width: 400px;
  height: 300px;

  background: ${(p) => p.theme.model.connectModelbg && p.theme.model.connectModelbg};

  border: "2px solid #000";
  text-align: center;
  border-radius: 30px 30px 30px 30px;
  @media (max-width: 420px) {
    width: 370px;
    height: 300px;
  }

  @media (max-width: 380px) {
    width: 330px;
    height: 300px;
  } ;
`;

export const ConnectButton = styled.button`
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  border-radius: 30px;
  width: 360px;
  height: 110px;

  background: ${(p) =>
    p.theme.model.connectModelbtnBgColor && p.theme.model.connectModelbtnBgColor};
  color: ${(p) =>
    p.theme.model.connectModelbtnTextColor && p.theme.model.connectModelbtnTextColor};
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transition: 0.3s ease-in-out;
  cursor: pointer;

  border: none;
  font-weight: 700;
  font-size: 19px;
  @media (max-width: 415px) {
    width: 300px;
  }
`;

export const ConnectIcon = styled.img`
  width: 60px;
  margin-right: 1rem;
`;
