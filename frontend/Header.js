import React from 'react';

function Header(props){
    return(
        <header>
            <h1>CONTADOR: {props.counter}</h1>
        </header>
    );
}

export default Header;