export default function(state={}, action){
    switch(action.type){
        case 'GET_ALLHOTELS':
            return{...state, hotels:action.payload.data.getAllHotels.result}
        default:
            return state
    }
}

