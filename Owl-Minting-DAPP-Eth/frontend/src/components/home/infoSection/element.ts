import styled from 'styled-components'

export const InfoSectionMain= styled.div`
   
   background: #000000;
   padding: 6rem;
   padding-bottom: 0;
   .title
   {
       color: white;
   }
   .descriptionTitle
   {
    color: white;

   }

   .description
   {
    color: white;
    letter-spacing: 0.3rem;

   }
   .socailMenu ul 
   {
    display: flex;
    gap: 0.5rem;
   }
   .socailMenu ul li
   {
    list-style: none;
    
   }
   .socailMenu ul  .discordIcon
   {
    background: white;
    margin-top: 0.3rem;
    padding: 0.5rem;
    width: 2.45rem;
    height: 2.45rem;
    border-radius: 2px;
   }
.copyright
{
    color: white;
    text-align: center;
}
   
   @media (max-width:990px) {
   padding: 2rem;
      
  }
`
;