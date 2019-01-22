import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';



//actions
import { GetAllHotels } from '../actions';


//Component
import HotelList from '../components/HotelList';
import Banner  from '../components/Banner';


class Home extends Component{

    componentDidMount(){
        this.props.GetAllHotels();
    }

    render(){
        return(
            <div>
                <center>
                <img src={'https://i.ibb.co/vdvVmkm/logo.png'} className="logo"/>
                </center>
                <Banner/>
                <HotelList hotelData={this.props.hotellist.hotels}/>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        hotellist:state.hotelListState
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({GetAllHotels},dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);