import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Backdrop from './Backdrop.component';


import './Modal.styles.css';
//this modal Overlay is the content basically of what will go over the backdrop. In one case, we will have a map.
//the content is structured to be a skeletal div that contains an empty header and a form that holds a div and a footer.
//You will pass content of your choosing to the header's h2 element, the form's div and the form's footer. All as props.
const ModalOverlay = props => {
    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    );

    return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

//this this the function that will be returned. We will be using the above declared ModalOverlay in it.
//We will render the ModalOverlay with the Backdrop as the background.
//ModalOverlay will get it's props when we use <Modal /> somewhere in our app and pass it props which it 
//will then pass to ModalOverlay via ...spread operator
const Modal = props => {
    return (
        <>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={200}
                classNames="modal">

                <ModalOverlay {...props} />

            </CSSTransition>

        </>
    )
}

export default Modal;
