import React from "react";
import { MainRow, MainContainer, MainCol } from "components/common";
import { InfoSectionMain } from "./element";
import {AiFillTwitterSquare,BsDiscord,SiDiscord } from 'react-icons/all'
const InfoSection = () => {
  return (
    <InfoSectionMain>
      <MainContainer>
        <MainRow>
          <MainCol lg={6}>
            <h1 className="title">Join Our Discord</h1>
            <h3 className="descriptionTitle    ">
              Where Members become creators
            </h3>

            <p className="description    ">
            JOIN US NOW ON DISCORD AND BE A PART OF THE ILLUMINATI OWL FAIMLY 24/7 COMMUNITY, CHAT WITH THE FOUNDERS
            </p>
          </MainCol>
          <MainCol lg={6}>
              
              <div className="socailMenu">
                   <ul>
                     <li>
                     <a href="https://twitter.com/illowlsNFT" target="_blank">
                           <AiFillTwitterSquare size={50} color="#fff"/>
                         </a> 
                       </li>
                       <li>
                     <a href="https://discord.com/invite/BFfBkHtU2P" target="_blank">
                           <SiDiscord className="discordIcon"  size={50}  color="#000"/>
                         </a> 
                       </li>
                   </ul>
              </div>
                
          </MainCol>
        </MainRow>
           <MainRow>
             <MainCol>
               <p className="copyright">Copyright © 2022 The Illuminati Group, All Right Reserved</p>
             </MainCol>
           </MainRow>
      </MainContainer>
    </InfoSectionMain>
  );
};

export default InfoSection;
