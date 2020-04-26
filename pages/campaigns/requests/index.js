import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../eth/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);

        const totalRequests = await campaign.methods.getRequestsCount().call();
        const totalApprovers = await campaign.methods.approversCount().call();
        const requests = await Promise.all(
            Array(parseInt(totalRequests)).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );

        return { address, requests, totalRequests, totalApprovers };
    }

    renderRow() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                request={ request }
                id={ index }
                key={ index }
                totalApprovers={ this.props.totalApprovers }
                address={ this.props.address }
            />
        });
    }

    render() {

        const { Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={ '/campaigns/' + this.props.address + '/requests/new' }>
                    <a>
                        <Button primary floated="right" style={{ marginBottom: '10px' }}>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount (Ether)</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        { this.renderRow() }
                    </Body>
                </Table>
                <div>Found { this.props.totalRequests } Requests.</div>
            </Layout>
        );
    }
}

export default RequestIndex;
