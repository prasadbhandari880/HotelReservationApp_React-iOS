import { combineReducers } from 'redux';
import hotelListState from './Available_reducer';
import reservationData from './Booking_reducer'

const rootReducer = combineReducers({
    hotelListState,
    reservationData
})

export default rootReducer;