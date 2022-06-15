import styled, { css } from "styled-components";

import { Link } from "react-router-dom";
 
import { Input } from "antd";
import { Nav, Navbar, Image } from "react-bootstrap";

 

interface Props {
  icon2?: string;
  searchNav?: string;
  illuminatiLogo?: boolean;
}

export const PrimaryNavbar = styled(Navbar)`
  padding: 3rem 0;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  background: #000 !important;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    height: 100px;
    background: #ffee00;
    clip-path: polygon(0 1%, 50% 11%, 100% 0, 0 0);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: #ffee00;

    border-bottom: 50%;
  }
`;

export const Navs = styled(Nav)<Props>`
  margin-right: auto;
  margin-left:20rem;
 
 
  & > .nav-link {
    font-size: 14px !important;
    font-weight: 600;
    color: #FFEE00 !important;
    margin-left: 0.9rem;
  }

  @media (max-width:1440px) {
  margin-left: 13rem;
   }
   
  @media (max-width:1200px) {
  margin-left: 10rem;
    
  }
 
  @media (max-width:567px) {
  margin-left: 6rem;
    
  }
`;


export const NavLink = styled(Link)`
  padding: 0.85rem;
`;

export const NavbarCollapse = styled(Navbar.Collapse)``;

export const NavLogo = styled.img<Props>`
   max-width   :100% ;

  ${(p) => p.illuminatiLogo && css`
 
   max-width   :100% ;
    
  `}
`;

export const NavProfileIcon = styled(Image)<Props>``;
