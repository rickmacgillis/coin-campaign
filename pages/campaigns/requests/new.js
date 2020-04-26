import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../eth/campaign';
import web3 from '../../../eth/web3-adapter';
import { Link, Router } from '../../../routes';

class RequestNew extends Component {

    state = {
        description: '',
        value: '',
        recipient: '',
        errorMessage: '',
        loading: false,
    };

    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({
            loading: true,
            errorMessage: '',
        });

        const accounts = await web3.eth.getAccounts();
        const campaign = Campaign(this.props.address);

        const { description, value, recipient } = this.state;
        try {
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
            ).send({ from: accounts[0] });

            Router.pushRoute('/campaigns/' + this.props.address + '/requests');
        } catch (error) {
            this.setState({
                errorMessage: error.message,
            });
        }

        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <h3>New Request</h3>
                <Link route={ '/campaigns/' + this.props.address + '/requests' }>
                    <a>Back to Requests List</a>
                </Link>
                <Form error={ !!this.state.errorMessage } onSubmit={ this.onSubmit }>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={ this.state.description }
                            onChange={ event => this.setState({ description: event.target.value }) }
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                            value={ this.state.value }
                            onChange={ event => this.setState({ value: event.target.value }) }
                            label="Ether"
                            labelPosition="right"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={ this.state.recipient }
                            onChange={ event => this.setState({ recipient: event.target.value }) }
                        />
                    </Form.Field>
                    <Message error header="Something went wrong..." content={ this.state.errorMessage } />
                    <Button primary loading={ this.state.loading }>Create Request</Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;
