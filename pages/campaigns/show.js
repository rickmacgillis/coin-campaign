import React, { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import { Link } from '../../routes';
import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';
import Campaign from '../../eth/campaign';
import web3 from '../../eth/web3-adapter';

class CampaignShow extends Component {

    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            address: props.query.address,
            minimumContribution: summary[0],
            campaignBalance: summary[1],
            totalRequests: summary[2],
            approversCount: summary[3],
            manager: summary[4],
        };
    }

    renderCards() {
        const items = [
            {
                header: this.props.manager,
                meta: "Campaign Manager's Address",
                description: "This is the Ethereum address of the person or company who created this campaign, and can create requests to withdrawal money.",
                style: {
                    overflowWrap: 'break-word'
                },
            },
            {
                header: this.props.minimumContribution,
                meta: "Minimum Contribution (Wei)",
                description: "You must at least contribute this amount to become a contributer to this campaign.",
            },
            {
                header: this.props.totalRequests,
                meta: "Total Number of Payment Requests",
                description: "Requests get approved by campaign contributors.",
            },
            {
                header: this.props.approversCount,
                meta: "Total Contributors",
                description: "Total number of people who have contributed - Contributors also must vote to approve payment requests from the manager.",
            },
            {
                header: web3.utils.fromWei(this.props.campaignBalance, 'ether'),
                meta: "Campaign Balance (Ether)",
                description: "This is the total amount of ether invested in this campaign.",
            },
        ];

        return <Card.Group items={ items } />;
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            { this.renderCards() }
                        </Grid.Column>

                        <Grid.Column width={6}>
                            <ContributeForm address={ this.props.address } />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={ '/campaigns/' + this.props.address + '/requests' }>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;
