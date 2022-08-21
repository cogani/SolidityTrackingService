import React, { Component } from 'react';
import { Message, Input, Form, Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import Tracking from '../../../ethereum/tracking';
import RequestRow from '../../../components/RequestRow';
import { Router } from '../../../routes';
import web3 from '../../../ethereum/web3';

class MilestoneIndex extends Component {
    static async getInitialProps(props) {
    const { address } = props.query;
    const tracking = Tracking(address);
    console.log("Tracking --------- :", tracking);

    console.log("address --------- :", address);

    const campaign = Campaign(address);

    console.log("Campaign ------- :", campaign);


    // const requestCount = await campaign.methods.getRequestsCount().call();
    // const approversCount = await campaign.methods.approversCount().call();

    // const requests = await Promise.all(
    //   Array(parseInt(requestCount))
    //     .fill()
    //     .map((element, index) => {
    //       return campaign.methods.requests(index).call();
    //     })
    // );

    // return { address, requests, requestCount, approversCount };
    return { address, tracking, campaign };
  }


  state = {
    name: '',
    location: '',
    postalAddressRecipient: '',
    subjectAddress: '',
    observations: '',
    loading: false,
    milestoneCount:0
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
       const accounts = await web3.eth.getAccounts();
       console.log("web3:", web3);
       const cProvider=web3.currentProvider;
       console.log("cProvider:", cProvider);
       const nose=await cProvider.request({ method: 'eth_requestAccounts'})
       console.log("nose:", nose);


        console.log("Campign XXXXXXX", this.props.campaign);
        console.log("tracking --------->", this.props.tracking);
        console.log("this.Campign XXXXXXX", this.campaign);
        console.log("STATE", this.state);

        const tranckingMethods = this.props.tracking.methods;

        console.log("getMilestoneLength", await tranckingMethods.getMilestoneLength().call());;

        console.log("this.state.subjectAddress ->>>>>>>>", this.state.subjectAddress);

      const newMilestone = await tranckingMethods
      .createMilestone(this.state.name, this.state.location, accounts[0], this.state.observations)
        .send({
          from: accounts[0]
        });


        console.log('state ',this.state);
        console.log('Result new Tracking creation ',newMilestone.subjectAddress);

      const origin = '/trackings/'+ this.props.address;
         console.log('Coming back to ',origin);

      Router.pushRoute(origin);
      console.log("STATE", getMilestoneLength.getMilestoneLength());;
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
    this.setState({ milestoneCount: getMilestoneLength.getMilestoneLength() });
  };


  render() {
     const { Header, Row, HeaderCell, Body } = Table;

    return (
       <Layout>
        <h3>Milestone</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add Milestone
            </Button>
          </a>
        </Link>
        <div>Address of the tracking contract: <i>{this.props.address}</i></div>



  <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Name</label>
            <Input
              labelPosition="right"
              value={this.state.name}
              onChange={event =>
                this.setState({ name: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              label="location"
              labelPosition="left"
              value={this.state.location}
              onChange={event =>
                this.setState({ location: event.target.value })}
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

        

      </Layout>
      
    );
  }
}

export default MilestoneIndex;
