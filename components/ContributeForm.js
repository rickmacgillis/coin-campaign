import React, { Component } from 'react';
import { Message, Button, Form, Input } from 'semantic-ui-react';
import { Router } from '../routes';
import Campaign from '../eth/campaign';
import web3 from '../eth/web3-adapter';

class ContributeForm extends Component {

    state = {
        contributionAmount: '',
        loading: false,
        success: false,
        errorMessage: '',
    };

    onSubmit = async event => {
        event.preventDefault();

        this.setState({
            loading: true,
            success: false,
            errorMessage: '',
        });

        const accounts = await web3.eth.getAccounts();
        const campaign = new Campaign(this.props.address);

        try {
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.contributionAmount, 'ether'),
            });

            this.setState({ success: true });

            Router.replaceRoute('/campaigns/' + this.props.address);
        } catch (error) {
            this.setState({
                errorMessage: 'Either you declined the transaction, or the input was invalid.',
            });
        }

        this.setState({
            loading: false,
            contributionAmount: '',
        });
    }

    render() {
        return (
            <Form onSubmit={ this.onSubmit } error={ !!this.state.errorMessage } success={ this.state.success }>
                <Message error header="Something went wrong..." content={ this.state.errorMessage } />
                <Message success header="All set!" content="Your contribution was successful." />
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input
                        type="number"
                        label="Ether"
                        labelPosition="right"
                        value={ this.state.contributionAmount }
                        onChange={ event => this.setState({ contributionAmount: event.target.value }) }
                    />
                </Form.Field>
                <Button primary loading={ this.state.loading }>Contribute!</Button>
            </Form>
        );
    }
}

export default ContributeForm;
