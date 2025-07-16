import { useContext, useState } from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem } from "reactstrap";
import { NavLink } from 'react-router-dom';

import logo from '../../Assests/Images/logo_mini.png';
import { AuthContext } from "../../Services/Contexts/AuthContext";

const Header = () => {
  const {authState, connectWallet, logout}  = useContext(AuthContext);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isAuthenticated = authState.isAuthenticated;
  const role = authState.stakeholder.role;
  const style = {
    authButton: {
      fontWeight: 'bolder',
      color: '#fff',
    },
    authText: {
      color: '#fff',
    }
  }

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  }

  const roleNavLinks = () => {
    switch(role) {
      case 'admin':
        return (
          <>
          <NavItem>
            <NavLink to="/admin/verify/farmer" className="nav-link">Verificar Productores</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/verify/manufacturer" className="nav-link">Verificar Procesadoras</NavLink>
          </NavItem>
          </>
        )
      case 'farmer':
        return (
          <>
          <NavItem>
            <NavLink to={`/farmers/${authState.stakeholder.id}`} className="nav-link">Perfil</NavLink>
          </NavItem>
          </>
        )
      case 'manufacturer':
        return (
          <>
          <NavItem>
            <NavLink to={`/manufacturers/${authState.stakeholder.id}`} className="nav-link">Perfil</NavLink>
          </NavItem>
          </>
        )
      case 'new': 
        return (
          <>
          <NavItem>
            <NavLink to="register" className="nav-link">Registrarse</NavLink>
          </NavItem>
          </>
        )
      default:
        return (
          <>
          <NavItem>
            <NavLink to="profile" className="nav-link">Perfil</NavLink>
          </NavItem>
          </>
        )
    }
  }

  return (
    <div className="container">
      <Navbar 
        color="warning"
        expand='md' 
        dark
      >
        <NavbarBrand>
          <img src={logo} />
          Soluciones de Cadena de Suministro Global
        </NavbarBrand>
        <NavbarToggler onClick={toggleNav} >
          {isNavOpen?
            <i className="fa fa-times"></i>
          :
            <i className="fa fa-bars"></i>
          }
        </NavbarToggler>
        <Collapse navbar isOpen={isNavOpen}>
          <Nav className="mx-auto" navbar >
            { isAuthenticated?
              <>
              <NavItem>
                <NavLink className="nav-link" to="/">
                  Panel
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/products">
                  Productos
                </NavLink>
              </NavItem>
              { roleNavLinks() }
              </>
            :
              ""
            }
          </Nav>
          <Nav className="ms-auto" navbar>
            { isAuthenticated?
              <>
              <NavbarText style={style.authText}>
                {authState.formattedAddress} &nbsp;
              </NavbarText>
              <NavItem>
                <NavbarText type="button" onClick={logout} style={style.authButton}>
                  <i className="fa fa-sign-out fa-lg"/>Cerrar Sesión
                </NavbarText>
              </NavItem>
              </>
            :
              <>
              <NavItem>
                <NavbarText type="button" onClick={connectWallet} style={style.authButton}>
                <i className="fa fa-sign-in fa-lg"/> Iniciar Sesión
                </NavbarText>
              </NavItem>
              </>
            }
          </Nav>
        </Collapse>
      </Navbar>
      
    </div>
  )
}
export default Header;