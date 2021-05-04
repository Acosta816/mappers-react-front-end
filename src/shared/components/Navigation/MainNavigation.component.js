import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Backdrop from '../uiElements/Backdrop.component';
import MainHeader from './MainHeader.component';
import './MainNavigation.styles.css';
import NavigationLinks from './NavigationLinks.component';
import SideDrawer from './SideDrawer.component';
import logo from '../../../assets/images/travel.png';

//MainNavigation is a shell that will hold the <MainHeader> and pass things to it.
const MainNavigation = () => {
    //Creating sideDrawer open/closed state.
    const [drawerIsOpen, setDrawerIsOpen] = useState(() => false);

    //Made a toggleDrawer instead of one that opens and one that closes. Might use this instead.
    const toggleDrawerHandler = () => {
        setDrawerIsOpen(prevState => !prevState);
    };


    const openDrawerHandler = () => {
        setDrawerIsOpen(true);
    };

    const closeDrawerHandler = () => {
        setDrawerIsOpen(false);
    };



    return (
        <>
            {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
            <SideDrawer onClick={closeDrawerHandler} show={drawerIsOpen}>
                <nav className="main-navigation__drawer-nav">
                    <NavigationLinks />
                </nav>
            </SideDrawer>

            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={() => openDrawerHandler()}>
                    <span />
                    <span />
                    <span />
                </button>
                <Link className="nav-logo-link" to="/"><img className="nav-logo" src={logo} alt="logo" /></Link>
                <h1 className="main-navigation__title">
                    <Link to="/">MAPPERS</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavigationLinks />
                </nav>
            </MainHeader>
        </>

    )
}

export default MainNavigation;
