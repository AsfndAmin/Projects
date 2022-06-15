import styled from "styled-components";
import { Row, Col, Container } from "react-bootstrap";
import { Form, Input, Checkbox, Button } from "antd";
import stakingBg from "assets/images/stakingBg.png";
export const LoginContainer = styled(Container)``;
export const LoginRow = styled(Row)`
  display: flex;
  justify-content: center;
`;
export const LoginCol = styled(Col)`
  border: 1px solid #fff;
  border-radius: 14px;
  margin-bottom: 2rem;
`;

export const LogoImg = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-top: 15rem;
  padding-bottom: 2rem;

  @media (max-width: 991px) {
    margin-top: 1rem;
  }
`;

export const LoginMain = styled.div`
  background: url(${stakingBg}) no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-position: center center;
  background-attachment: fixed;

  margin-top: -8rem;
`;
export const LoginProfileImg = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 8rem;
`;
export const LoginForm = styled(Form)`
  padding: 6rem;

  @media (max-width: 517px) {
    padding: 2rem;
  }
`;
export const InputValue = styled(Input)`
  border: none !important;

  border-bottom: 2px solid white !important;
  background: transparent !important;
  margin-top: 1rem;
  padding: 0.5rem;
  .ant-input::placeholder {
    color: white;
  }

  & > .ant-input {
    background: transparent !important;
    font-size: 1.4rem;
    box-shadow: none;
  }
  & > .ant-input[value] {
    color: white !important;
  }
  & > .ant-input {
    color: white !important;
  }
  &:focus {
    box-shadow: none;
  }
  & > .ant-input-prefix {
    color: white;
    font-size: 1.5rem;
    margin-right: 1rem;
  }
`;
export const Checkboxs = styled(Checkbox)`
  color: white;
`;

export const LoginButton = styled(Button)`
  width: 100%;
  background: #fbf57d;
  border: none;
  border-radius: 15px;
  color: black;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
`;
