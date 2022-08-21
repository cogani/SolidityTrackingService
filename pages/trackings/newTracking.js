import React, { Component ,useState, useEffect, Suspense } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import trackingFactory from '../../ethereum/TrackingContractFactory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

//import { GoogleApiWrapper } from '../auxiliary/geolocation';
import   GoogleMapReact  from 'google-map-react';

import { RMap, ROSM, RLayerVector, RFeature, ROverlay, RStyle } from "rlayers";
//import locationIcon from '../../svg/location.png';
import { fromLonLat } from "ol/proj";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import { Geolocation as OLGeoLoc } from "ol";
import axios from 'axios';




class NewTracking extends Component {
  state = {
    item: '',
    forWhom: '',
    postalAddressRecipient: '',
    ethAddressRecipient: '',
    observations: '',
    loading: false,
     data: null,
     datas:null

  };


static defaultProps = {
    center: {lat: 59.95, lng: 30.33},
    zoom: 11
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      const result = await trackingFactory.methods
        .createTracking(this.state.item,
        this.state.forWhom, this.state.postalAddressRecipient, this.state.ethAddressRecipient,
        this.state.observations)
        .send({
          from: accounts[0]
        });
        console.log('state ',this.state);
        console.log('Result new Tracking creation ',result);

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

async getDataAxios(){
    const response =
      await axios.get("https://nominatim.openstreetmap.org/search?q=g41+5hp&format=json")
    console.log(response.data)

    return response;

}


componentDidMount(){
         const coordsArray=[];
         axios.get("https://nominatim.openstreetmap.org/search?q=g41+5hp&format=json")
        .then(x=>{
          coordsArray.push(x.data[0]);
          this.setState({ data: coordsArray })
          console.log("xxxxx>", coordsArray[0]);
          console.log("--------",x.data[0]);
        });
        

    }

async getData() {
    // create a new XMLHttpRequest
    const xhr = new XMLHttpRequest();
    let result2;

    // get a callback when the server responds
    xhr.addEventListener('load', () => {
      // update the state of the component with the result here
      console.log("---------->",xhr.responseText)
      result2=xhr.responseText;
    })
    // open the request with the verb and the url
    xhr.open('GET', 'https://nominatim.openstreetmap.org/search?q=g41+5hp&format=json')
    // send the request
    const result =xhr.send();
     console.log("result",result2);
     return result2;
  }





render() {
 // let pointGeoInfo;
 //  let details = this.state.data[0];
 //  let lat=details["lat"];
 //  let long=details["lon"]
 //   console.log("DONDE2---",lat);
 //   console.log("DONDE2---",long);
 console.log("DATA:",this.state.data);
  


    const coords: Record<string, Coordinate> = {
  origin: [2.364, 48.82],
  ArcDeTriomphe: [2.295, 48.8737],
};



    
     const initializeMap = (Map) => {
 return GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAPS_API_KEY,
  libraries: ['places', 'visualization'],
  LoadingContainer,
 })(Map)
}

  const { googleMapsApiKey } = "AIzaSyCfTkXZo06rfXsBxKXXinOKlE-yuz8ies0";
   const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };

  const AnyReactComponent = ({text}: any) => <div>{text}</div>;

  const center = fromLonLat([2.364, 48.82]);
  console.log("zzzzzzzz",this.state.data);

    return (
      <Layout>

        <h3>Create a new Tracking</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Brief description</label>
            <Input
              labelPosition="right"
              value={this.state.item}
              onChange={event =>
                this.setState({ item: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              label="For whom"
              labelPosition="left"
              value={this.state.forWhom}
              onChange={event =>
                this.setState({ forWhom: event.target.value })}
            />
            <Input
              label="Postal address"
              labelPosition="left"
              value={this.state.postalAddressRecipient}
              onChange={event =>
                this.setState({ postalAddressRecipient: event.target.value })}
            />
            <Input
              label="Eth address"
              labelPosition="left"
              value={this.state.ethAddressRecipient}
              onChange={event =>
                this.setState({ ethAddressRecipient: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Observations</label>
            <Input
              labelPosition="right"
              value={this.state.observations}
              onChange={event =>
                this.setState({ observations: event.target.value })}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
        <div style={{ height: '400px', width: '800px' }}>
       <GoogleMapReact
  
      bootstrapURLKeys={{key: 'AIzaSyCfTkXZo06rfXsBxKXXinOKlE-yuz8ies0'}}
         defaultCenter={{lat: 0.95, lng: 30.33}}
         defaultZoom={11}
          >
               <AnyReactComponent
            lat={11.0168}
            lng={76.9558}
            text="My Marker"
          />
                </GoogleMapReact>


        {this.state.data === null ? 
                <div>Loading</div>:<div>{this.state.data[0]["lon"]} - {this.state.data[0]["lat"]}</div>
            }

    
     
     
   <RMap
        width={"100%"}
        height={"60vh"}
        initial={{ center: center, zoom: 10 }}
      >
        <ROSM />
         <RLayerVector zIndex={10}>
          <RStyle.RStyle>
          <RStyle.RIcon src={"../../svg/location.jpeg"} anchor={[3, 3]} />
        </RStyle.RStyle>
        <RFeature
          geometry={new Point(fromLonLat(coords.ArcDeTriomphe))}
          onClick={(e) =>
            e.map.getView().fit(e.target.getGeometry().getExtent(), {
              duration: 250,
              maxZoom: 15,
            })
          }
        >
          <ROverlay className="example-overlay">
            Arc de Triomphe
            <br />
            <em>&#11017; click to zoom</em>
          </ROverlay>
        </RFeature>


        <RFeature
       geometry={new Point(fromLonLat([3.295, 48.8737]))}
          onClick={(e) =>
            e.map.getView().fit(e.target.getGeometry().getExtent(), {
              duration: 250,
              maxZoom: 15,
            })
          }
        >
          <ROverlay className="example-overlay">
            Arc de Triomphe222
            <br />
            <em>&#11017; click to zoom</em>
          </ROverlay>
        </RFeature>

     

        </RLayerVector>
      </RMap>

        </div>
      </Layout>
    );
  }
}

export default NewTracking;
