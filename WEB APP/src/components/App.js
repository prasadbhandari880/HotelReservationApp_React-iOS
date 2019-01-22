import React , {Component } from 'react';
import { BrowserRouter, Route} from 'react-router-dom';

//Containers
import Home from '../containers/Home';
import Reservation from '../containers/Reservation';


class App extends Component{
    render(){
        return(
            <BrowserRouter>
                <div>
                    <div className="logo"></div>
                    <br/>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/reservation" component={Reservation}></Route>
                </div>
            </BrowserRouter>
        )
    }
}

export default App;