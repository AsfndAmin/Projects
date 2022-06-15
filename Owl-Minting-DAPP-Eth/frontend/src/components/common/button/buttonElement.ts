import styled, { css } from "styled-components";

interface Props {
  primary?: boolean;
  secondary?: boolean;
  buttonCenter?: boolean;
  buttonEnd?: boolean;
  navbarBtn?: boolean;
  connectWallet?: boolean;
}
export const MainButton = styled.button<Props>`
  :disabled {
    cursor: not-allowed;
    background: gray !important;
  }

  position: relative;
  overflow: hidden;

  &::before
  {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    background: #FFEE00;
    top: 0;
    left: 0;
    transform: translateX(-100%) rotate(45deg);
    transition: all 2s;
  }
  &:hover::before
  {
    transform: translateX(100%) rotate(45deg);


  }

  /* background: ${(p) =>
    p.theme.primaryBtn && p.primary && p.theme.primaryBtn}; */
  ${(p) =>
    p.primary &&
    css`
      padding: 0.5rem 2rem;
      border: none;

      font-weight: bold;
      border-radius: 0px;
    `}

  ${(p) =>
    p.buttonCenter &&
    css`
      display: flex;
      margin-left: auto;
      margin-right: auto;
    `} 


    ${(p) =>
    p.connectWallet &&
    css`
      padding: 0.5rem 2rem;
      color: ${(p) => p.theme.connectBtnText};
      margin-top: 1rem;
      margin-bottom: 1rem;
      font-weight: bold;
      border: 3px solid #ffee00;
      background: transparent;
    `}
`;

export const ButtonIcon = styled.img<Props>`
  margin-top: -0.3rem;
  margin-right: 0.3rem;
`;
