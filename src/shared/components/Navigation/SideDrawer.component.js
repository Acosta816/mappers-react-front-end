import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.styles.css';

const SideDrawer = props => {

    const sideDrawerContent = (
        <CSSTransition in={props.show} timeout={200} classNames="slide-in-left" mountOnEnter unmountOnExit>
            <aside onClick={props.onClick} className="side-drawer">{props.children}</aside>
        </CSSTransition>);

    return ReactDOM.createPortal(sideDrawerContent, document.getElementById('drawer-hook'));
}

export default SideDrawer;
