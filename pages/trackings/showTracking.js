import React, { Component } from 'react';
import { Fragment,Table, Icon,Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Tracking from '../../ethereum/tracking';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

import { RMap, ROSM, RLayerVector, RFeature, ROverlay, RStyle } from "rlayers";
//import locationIcon from '../../svg/location.png';
import { fromLonLat } from "ol/proj";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import { Geolocation as OLGeoLoc } from "ol";

import axios from 'axios';

class TrackingShow extends Component {

  state = {
     coordsArray: []
  };


  static async getInitialProps(props) {
    const tracking = Tracking(props.query.address);

    const summary = await tracking.methods.getSummary().call();
    const _milestoneLength = await tracking.methods.getMilestoneLength().call();
    
    console.log("Summary",summary);

    
    const _milestones = await Promise.all(
      Array(parseInt(_milestoneLength))
        .fill()
        .map((element, index) => {
          
          // const _coordsArray =  this.state.coordsArray==null?[]:this.state.coordsArray;
          // this.setState({ coordsArray: _coordsArray })
          let _coordsArray=[];
          return tracking.methods.milestones(index).call().then(milestone=>
            {
              const mLocation= milestone.location.replace(" ","+");
               console.log("mLocation",mLocation);
              if(mLocation!==""){
                  console.log("Obtaining long-lat for: ", mLocation);

                  console.log("mLocation",mLocation);
                  
                   const url = `https://nominatim.openstreetmap.org/search?q=${mLocation}&format=json`;
                   console.log("URL:", url)
                   axios.get(url)
                  .then(x=>{
                    console.log("URLzzzzzzz:", x.data[0])
                    //_coordsArray.push(x.data[0]);
                    //const cArrayIndex = this.state.coordsArray;
                   // cArrayIndex.push(x.data[0])
                    const text =`Location for ${mLocation}: ${JSON.stringify(x.data[0])} `;
                   // this.state.coordsArray.push(x.data[0]);
                   // this.setState({ coordsArray:  })
                    console.log("XXXXXXXXXXXXXXX",text);
                  });
              }


              console.log("milestone", milestone)
              return milestone;
            }
            );
        })
    );

    console.log("Milestones:", _milestones);


    const terminado = summary[7]?"True":"False";

    return {
      address: props.query.address,
      manager: summary[0],
      item: summary[1],
      fromWhom: summary[2],
      postalAddressRecipient: summary[3],
      ethAddressRecipient: summary[4],
      observations: summary[5],
      when: summary[6],
      complete: terminado,
      trackingEthAddress: props.query.address,
      milestoneCount: _milestoneLength,
      milestones: _milestones
    };

  }


  state = {
    name: '',
    location: '',
    postalAddressRecipient: '',
    subjectAddress: '',
    observations: '',
    loading: false,
    milestoneCount:0,
    milestones: null,
    coordsArray:null
  };

componentDidMount(){
  console.log("Loading componentDidMount");
        const postCode = "g41+5hp";
         const _coordsArray=[];
         const url = `https://nominatim.openstreetmap.org/search?q=${postCode}&format=json`;
         console.log("URL:", url)
         axios.get(url)
        .then(x=>{
          console.log("URLzzzzzzz:", x.data[0])
          _coordsArray.push(x.data[0]);
          this.setState({ coordsArray: _coordsArray })
          console.log("HIIIIIIIIIII>", _coordsArray[0]);
        });
    }


 renderMilestones() {
  return(
   <div>
   <h4>Milestone: {this.props.milestoneCount}</h4>
   <Table celled>
      <Table.Header>
         <Table.Row>
            <Table.HeaderCell>ETH address</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Where</Table.HeaderCell>
            <Table.HeaderCell>When</Table.HeaderCell>
             <Table.HeaderCell>Observations</Table.HeaderCell>
         </Table.Row>
      </Table.Header>
      <Table.Body>
         {this.renderMilestone()}
      </Table.Body>
    </Table>
     
    </div>
  );
 }


  renderMap() {
    const center= {lat: 59.95, lng: 30.33};
        const coords: Record<string, Coordinate> = {
  origin: [2.364, 48.82],
  ArcDeTriomphe: [2.295, 48.8737],
};


    return(
     <RMap
        width={"500px"}
        height={"500px"}
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
      )
  }

 renderMilestone() {
console.log("mmmmmmmm", this.props.milestones);  

    let rows;
    if(this.props.milestoneCount>0){
    rows = this.props.milestones.map(i => {
      const hasIssues = i.observations===""?"":"false"
      const isClossingStep="x";
      const clossingStep = isClossingStep===""?"":"true";
      const noEpochTime = new Date(i.when*1000).toString();
      return (
       <Table.Row
          disabled={clossingStep}
          error={hasIssues}
          key={i.subjectAddress}>
            <Table.Cell>{i.subjectAddress}</Table.Cell>
            <Table.Cell>{i.name}</Table.Cell>
            <Table.Cell>{i.location}</Table.Cell>
            <Table.Cell>{noEpochTime}</Table.Cell>
            <Table.Cell>{i.observations}</Table.Cell>
        </Table.Row>
      );
    });
  }else{
     return (
       <Table.Row></Table.Row>)
  }

    return rows;
  }





  renderCards() {
    const {
      address,
      manager,
      item,
      fromWhom,
      postalAddressRecipient,
      ethAddressRecipient,
      observations,
      when,
      complete
    } = this.props;

    console.log("renderCards:",this.props);

    const trackingCreationDateNoEpoch = new Date(when*1000).toString();

    const items = [
     {
        header: address,
        meta: 'ETH of the tracking',
        description:
          'ETH address of the tracking',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: item,
        meta: 'item',
        description:
          'Brief description of the tracking.'
      },
      {
        header: fromWhom,
        meta: 'Name of the recipient',
        description:
          'Recipient name'
      },
      {
        header: ethAddressRecipient,
        meta: 'ethAddressRecipients',
        description:
          'ETH address of the Recipient',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: observations,
        meta: 'observations',
        description:
          'Any related observation.'
      },
       {
        header: trackingCreationDateNoEpoch,
        meta: 'when',
        description:
          'Date of the creation of the tracking'
      },
       {
        header: complete,
        meta: 'tracking completed',
        description:
          'Specify is the tracking has been finished.'
      }


    ];

    console.log("renderCards:",items);

    return <Card.Group items={items} />;
  }

  render() {
    console.log("this.props.complete", this.props.complete)
    const isMilestoneAdditionEnabled = this.props.complete==="True"?true:false;
    console.log("disabled={isMilestoneAdditionEnabled}", isMilestoneAdditionEnabled);
    return (
      <Layout>
      <h2>Trancking info</h2>
        <Grid>
          <Grid.Row >
            <Grid.Column computer={16} only='compute'>{this.renderCards()}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column >{this.renderMilestones()}</Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/trackings/${this.props.address}/requests`}>
                <a>
                  <Button disabled={isMilestoneAdditionEnabled} primary>Add milestone</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        
        {this.state.coordsArray === null ? 
                <div>Loading ...</div>:
                <div>{this.state.coordsArray[0]["lon"]} - {this.state.coordsArray[0]["lat"]}</div>
        }
          <div>{this.renderMap()}</div>
        }
      </Layout>
    );
  }
}

export default TrackingShow;
