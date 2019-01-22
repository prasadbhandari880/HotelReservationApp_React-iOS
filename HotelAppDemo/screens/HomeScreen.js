import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
    Alert,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';

import createApolloClient from './apollo';
import gql from 'graphql-tag';
import { ApolloProvider } from 'react-apollo';
import { Query , Mutation} from 'react-apollo'
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import DatePicker from 'react-native-datepicker'

var cancelIcon = require("../assets/images/t_icon_cancel.png");



const FETCH_TODOS = gql`
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
      reviews
    }
  }
}
`;

const BOOK_HOTEL = gql`
  mutation ($fkHotelId: String!,$checkInDate: String!,$checkOutDate: String!){
    createReservation(input:{fkHotelId:$fkHotelId,checkInDate:$checkInDate,checkOutDate:$checkOutDate}){
      errors{
        key
        value
      },
      result{
        _id
        name
        city
        price
        distance
        details
        image
        rating
        reviews
      }
    } 
  }
`;


let  client = null

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
    super(props)
    this.state = {data:[] , isVisible : false , startBooking:false, selectedHotelId: '' }
    client = new ApolloClient({
      link: createHttpLink({ uri: 'https://api-gql.herokuapp.com/graphql' }),
      cache: new InMemoryCache()
    })

    this.createReservation = this.createReservation.bind(this);
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.renderBookingDialog = this.renderBookingDialog.bind(this);

  }

  render() {
    return (
      <View style={styles.container}>
      <ApolloProvider client={client}>
      {this.renderBookingDialog()}
      {this.state.startBooking && this.bookHotel()}

      <Query
      query={FETCH_TODOS}
    >
      {
        ({data, error, loading}) => {
          if(data){
            // this.setState({data:data})
            return(
              <SafeAreaView>
            <FlatList
            data={data.getAllHotels && data.getAllHotels.result}
            renderItem={({item}) => this.renderItem(item)}
            ItemSeparatorComponent = {() => this.renderSeperator()}
          />
          </SafeAreaView>
            )
          }
          if(error){
            return null
          }
          else if (loading) {
            return (
            <View> 
              <Text> 
              Loading ... 
              </Text>
               </View>
               )
          }
             
        }
      }
    </Query>
   </ApolloProvider>
   </View>
    );
  }

  renderSeperator = () => {
    return(
      <View style = {{height:0.2,backgroundColor:'gray'}}/>
    )
  }

  renderItem = (item) => {
    return(
    <View style = {{height:160}}>
      <View style = {{flexDirection:'row' , flex:1 }}>
        <Image source = {{uri:item.image}} style = {{width:80, height:120 , margin:10 , backgroundColor:'red'}} />
        <View>
          <Text style = {styles.headingTextStyle} numberOfLines = {1}>{item.name}</Text>
          <Text style = {styles.subheadingTextStyle}>{item.city}</Text>
          <View style = {{flexDirection:'row' , alignItems:'space-between'}}>
            <Text style = {styles.ratingTextStyle}>{item.rating}/5</Text>
            <Text style = {{fontSize:16 , fontWeight:'500', marginLeft:150}}>{item.price}$</Text>
          </View>
          <Text style = {styles.reviewTextStyle}>{item.reviews}</Text>
          <TouchableOpacity onPress={() => this.onBookingPress(item)} style = {{backgroundColor:'orange' , marginLeft:155 , height:40 , marginTop:-15 ,  justifyContent:'center', alignItems:'center'}}>
              <Text style = {{fontSize:16 , color:'white' , fontWeight:'500'}}> Book Now </Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
    )
  }


  onCloseDialog() {
      this.setState({isVisible:false})
  }

  renderBookingDialog() {
    return(
      <Modal visible={this.state.isVisible} transparent animationType="slide">
       <View
          style={[
            styles.container,
            {
              backgroundColor: "rgba(0,0,0,0.8)",
              borderRadius: 10
            }
          ]}>

          <View style = {{justifyContent:'center',alignItems:'center' , marginTop:50, backgroundColor:'white', paddingBottom:100, paddingTop:100}}>
            <TextInput style = {styles.textInputStyle}
             placeholder = ' Enter Customer Name'
             placeholderTextColor = 'gray'
                       onChangeText={(text) => this.setState({text})}>
            </TextInput>
            {this.renderCheckinDatePicker()}
            {this.renderCheckoutDatePicker()}
            {this.bookHotel()}

              <TouchableOpacity onPress = {this.onCloseDialog} style = {{backgroundColor:'orange' , height:40 , marginTop:25 , marginLeft:10, justifyContent:'center', alignItems:'center' , width:275, borderRadius:4}}>
                  <Text style = {{fontSize:16 , color:'white' , fontWeight:'500'}}> Go Back</Text>
              </TouchableOpacity>

          </View>
        </View>
      </Modal>
    )
  }

  renderCheckinDatePicker = () => {
    return(
      <DatePicker
      style={{width: 200 , marginTop:10 , color:'white'}}
      date={this.state.checkinDate}
        mode="date"
        placeholder="Select Checkin Date"
        format="YYYY-MM-DD"
        minDate="1970-05-01"
        maxDate="2096-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36,
            textColor:'black'
          },
          dateText:{
            color:'black'
          }
        }}
        onDateChange={(date) => {
          this.setState({checkinDate: date})
        }}
      />
    )
  }

  renderCheckoutDatePicker = () => {
    return(
      <DatePicker
        style={{width: 200 , marginTop:10}}
        date={this.state.checkoutDate}
        mode="date"
        placeholder="Select Checkout Date"
        format="YYYY-MM-DD"
        minDate="1970-05-01"
        maxDate="2096-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          },
          dateText:{
            color:'black'
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setState({checkoutDate: date})}}
      />
    )
  }

  bookHotel = () => {
    // const { text , checkinDate } = this.state;
    return(
        <TouchableOpacity onPress = {this.createReservation} style = {{backgroundColor:'rgba(54,182,39,0.8)' , height:40 , marginTop:25 , marginLeft:10, justifyContent:'center', alignItems:'center' , width:275, borderRadius:4}}>
            <Text style = {{fontSize:16 , color:'white' , fontWeight:'500'}}> Book Now </Text>
        </TouchableOpacity>
    )
}

  onBookingPress = (item) => {
    this.setState({
        isVisible:true,
        selectedHotelId:item._id
    })
  }




 createReservation()   {
     this.setState({
         isVisible:false
     })

     const fkHotelId = this.state.selectedHotelId
     const checkInDate = this.state.checkinDate
     const checkOutDate = this.state.checkoutDate

        client.mutate({
            variables: { fkHotelId,
                checkInDate,
                checkOutDate},
            mutation: BOOK_HOTEL,
        })
            .then(result => {

                Alert.alert("Success", "Congratulations! Your hotel booked successfully")

            })
            .catch(error => {
                console.log(error)
            });
    }



  onConfirmBookingPress = () => {
    this.setState({startBooking:true})

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headingTextStyle :{
    fontSize:16 ,
    paddingTop:15,
    maxWidth:225

  },
  subheadingTextStyle :{
    fontSize:13 ,
    paddingTop:5,
  },
  ratingTextStyle :{
    fontSize:13 ,
    fontWeight:'500',
    paddingTop:40,
    color:'green'
  },
  reviewTextStyle :{
    fontSize:13 ,
    fontWeight:'300',
    paddingTop:2,
    color:'gray'
  },
  textInputStyle :{
    width:275,
    height:40,
    borderRadius:10,
    backgroundColor:'white',
    fontSize:16,
      borderColor:'grey',
      borderWidth:1,
      paddingLeft:10


  }
});
