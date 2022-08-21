import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import trackingFactory from '../ethereum/TrackingContractFactory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
  static async getInitialProps() {
   // console.log("----------------- factory:", factory);
    console.log("----------------- trackingFactory:", trackingFactory);
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    const trackings = await trackingFactory.methods.getDeployedTrackings().call();

    return { campaigns, trackings };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  renderTrackings() {
    const items = this.props.trackings.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/trackings/${address}`}>
            <a>View Tracking</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Trackings</h3>
          {this.renderTrackings()}

          <Link route="/trackings/newTracking">
            <a>
              <Button
                floated="right"
                content="Create Tracking"
                icon="add circle"
                primary
              />
            </a>
          </Link>

        


        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
