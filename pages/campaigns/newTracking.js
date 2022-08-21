import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import trackingFactory from '../../ethereum/TrackingContractFactory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class NewTracking extends Component {
  state = {
    item: '',
    forWhom: '',
    postalAddressRecipient: '',
    ethAddressRecipient: '',
    observations: '',
    loading: false
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

  render() {
    return (
      <Layout>
        <h3>Create a new Tracking</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Item</label>
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
      </Layout>
    );
  }
}

export default NewTracking;
