import React from 'react';
import {Route, Switch} from "react-router-dom";
import Header from './header';
import HomePage from './home';
import Comments from './comments';

function Main(){
    return(
        <div>
            <Header />
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/comments" component={Comments} />
            </Switch>
        </div>
    )
}

export default Main;