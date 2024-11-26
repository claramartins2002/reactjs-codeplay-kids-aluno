import React,{useContext, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {FiAlignRight,FiXCircle } from "react-icons/fi";
import logo from '../../img/logo.png';
import { MdVideogameAsset, MdMenuBook, MdHome } from 'react-icons/md';

import './styles.css';
import { AuthContext } from '../../AuthContext';

const Navbarmenu = () => {

    const { logout } = useContext(AuthContext); // Pega a função de login do contexto
    const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redireciona para a home após login
  };


    const [isMenu, setisMenu] = useState(false);
    const [isResponsiveclose, setResponsiveclose] = useState(false);
    const toggleClass = () => {
      setisMenu(isMenu === false ? true : false);
      setResponsiveclose(isResponsiveclose === false ? true : false);
  };

    let boxClass = ["main-menu menu-right menuq1"];
    if(isMenu) {
        boxClass.push('menuq2');
    }else{
        boxClass.push('');
    }

    return (
    <header className="header__middle">
        <div className="menu-container">
            <div className="row">

                {/* Add Logo  */}
                <div className="header__middle__logo">
                    <NavLink exact activeClassName='is-active' to="/">
                        <img src={logo} alt="logo" /> 
                    </NavLink>
                </div>

                <div className="header__middle__menus">
                    <nav className="main-nav " >

                    {/* Responsive Menu Button */}
                    {isResponsiveclose === true ? <> 
                        <span className="menubar__button" style={{ display: 'none' }} onClick={toggleClass} > <FiXCircle />   </span>
                    </> : <> 
                        <span className="menubar__button" style={{ display: 'none' }} onClick={toggleClass} > <FiAlignRight />   </span>
                    </>}

                    <ul className={boxClass.join(' ')}>
                    <li className="menu-item " >
                        <NavLink className='is-active' to={`/`}><MdHome/> Minhas atividades </NavLink> 
                        </li>              
                    <li className="menu-item " >
                        <NavLink className='is-active' to={`/jogos/drawing`}><MdVideogameAsset/> Desenho Livre </NavLink> 
                        </li>
                        <li className="menu-item " >
                        <NavLink  className='is-active' onClick={handleLogout} > Sair </NavLink> 
                        </li>
                    </ul>
                    </nav>     
                </div>   
            </div>
	    </div>
    </header>
    )
}

export default Navbarmenu;