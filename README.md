Hotel Booking with Reservation List Using React, React Native and GraphQl
================================
## Graphql Apollo Server API hosted on heroku.
#Backend

Api Cretaed with graphQl Hosted on Herkou Server

Base Url: https://api-gql.herokuapp.com/graphql

query{
    getAllHotels{
      result{
        _id
        name
        city
        price
        distance
        details
        image
        rating
      }
    }
  }

#React Web App

Create using create-react-app
App consumed using apollo boost
and graphql

npm install
npm start

## REACT NATIVE Booking App

1. Go to project root directory called as "HotelDemoApp"
2. Run npm install
3. yarn start 
4. It should launch the browser , from the left pane click on the button 'Run on iOS Simulator' . 
5. It should launch the simulator and the app should be shown .





