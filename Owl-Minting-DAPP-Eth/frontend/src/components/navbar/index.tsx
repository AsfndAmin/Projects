import logo from "assets/icons/logo2.gif";
import illumninateLogo from "assets/images/iaall_owl.gif";

import { SearchOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";

import * as N from "./navbarElements";

import { MainContainer } from "components/common";

interface Props {
  icon2?: string;
  className?: string;
  searchNav?: string;
  illuminatiLogo?:boolean;
}

const Navbar: React.FC<Props> = ({ className, icon2, searchNav }) => {
  return (
    <div className=" ">
      <N.PrimaryNavbar
        className="meta-sphere-navbar"
        collapseOnSelect
        bg="light"
        expand="lg"
        variant="dark"
      >
        <MainContainer>
          <N.PrimaryNavbar.Brand as={Link} to="/" href="/">
            <N.NavLogo src={logo} width={200}></N.NavLogo>
          </N.PrimaryNavbar.Brand>
          <N.PrimaryNavbar.Toggle aria-controls="navbarScroll" />
          <N.NavbarCollapse id="navbarScroll">

          <N.Navs navbarScroll>
            <N.Navs.Link as={Link} to="/" href="/">
            <N.NavLogo src={illumninateLogo}  illuminatiLogo  ></N.NavLogo>
            </N.Navs.Link>
          
          </N.Navs>
          

          <N.Navs  >
            <N.Navs.Link as={Link} to="/" href="/">
              Home
            </N.Navs.Link>
            <N.Navs.Link as={Link} to="/my-collection" href="/my-collection">
              Community
            </N.Navs.Link>
          </N.Navs>
          </N.NavbarCollapse>

        </MainContainer>
      </N.PrimaryNavbar>
    </div>
  );
};

export default Navbar;
