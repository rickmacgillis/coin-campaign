import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import { Router } from '../routes';
import web3 from '../eth/web3-adapter';
import Campaign from '../eth/campaign';

class RequestRow extends Component {
    state = {
        loadingApprove: false,
        loadingFinalize: false,
    };

    onApprove = async () => {
        this.setState({ loadingApprove: true });

        const account = await web3.eth.getAccounts();
        const campaign = Campaign(this.props.address);
        try {
            await campaign.methods.approveRequest(this.props.id).send({
                from: account[0],
            });
            Router.replaceRoute('/campaigns/' + this.props.address + '/requests');
        } catch (error) {
            alert(error.message);
        }
        this.setState({ loadingApprove: false });
    }

    onFinalize = async () => {
        this.setState({ loadingFinalize: true });

        const account = await web3.eth.getAccounts();
        const campaign = Campaign(this.props.address);
        try {
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: account[0],
            });
            Router.replaceRoute('/campaigns/' + this.props.address + '/requests');
        } catch (error) {
            alert(error.message);
        }
        this.setState({ loadingFinalize: false });
    }

    render() {
        const { Row, Cell } = Table;
        const { id, request } = this.props;
        const readyToFinalize = request.approvalCount > (this.props.totalApprovers/2);

        return (
            <Row disabled={ request.complete } positive={ readyToFinalize && !request.complete }>
                <Cell>{ id }</Cell>
                <Cell>{ request.description }</Cell>
                <Cell>{ web3.utils.fromWei(request.value, 'ether') }</Cell>
                <Cell>{ request.recipient }</Cell>
                <Cell>{ request.approvalCount } / { this.props.totalApprovers }</Cell>
                <Cell>
                    {
                        request.complete || readyToFinalize ? null : (
                            <Button color="green" basic onClick={ this.onApprove } loading={ this.state.loadingApprove }>Approve</Button>
                        )
                    }
                </Cell>
                <Cell>
                    {
                        request.complete ? null : (
                            <Button color="teal" basic onClick={ this.onFinalize } loading={ this.state.loadingFinalize }>Finalize</Button>
                        )
                    }
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;
