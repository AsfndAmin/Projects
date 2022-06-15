import styled from "styled-components";
import bg from "assets/images/owls_background2.png";

export const MainHeroSection = styled.div`
  background: url(${bg}) no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
 
 

 
  .heroRightCol
  {
      margin-top: 10rem;
  }

  .heroRightCol > .price
  {
    color: ${(p) => p.theme.heroTextColor};
    text-align: center;
  }
  .heroRightCol > .title
  {
    color: ${(p) => p.theme.heroTextColor};

    text-align: center;

  }
  .heroRightCol > .mintPrice
  {
    color: ${(p) => p.theme.heroTextColor};
    text-align: center;

  }
  .heroRightCol > .owls
  {
    color: ${(p) => p.theme.heroTextColor};

    text-align: center;

  }
  
  
  
`;
export const HeroImg = styled.img`
  width: 560px;
  height: 560px;
  margin-top: 5rem;

  @media (max-width:990px) {
     max-width: 100%;
     height: auto;
  }
`;
