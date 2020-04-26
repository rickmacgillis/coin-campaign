import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../eth/factory';
import web3 from '../../eth/web3-adapter';
import { Router } from '../../routes';

class NewCampaign extends Component {

    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false,
    };

    onSubmit = async event => {
        event.preventDefault();
        this.setState({
            errorMessage: '',
            loading: true,
        });

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(this.state.minimumContribution).send({
                from: accounts[0],
            });

            Router.pushRoute('/');
        } catch (error) {
            this.setState({
                errorMessage: 'Either you declined the transaction, or the input was invalid.',
            });
        }
        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={ this.onSubmit } error={ !!this.state.errorMessage }>
                    <Message error header="Something went wrong..." content={ this.state.errorMessage } />
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            type="number"
                            label="Wei"
                            labelPosition="right"
                            value={ this.state.minimumContribution }
                            onChange={ event => this.setState({ minimumContribution: event.target.value }) }
                        />
                    </Form.Field>
                    <Button primary loading={ this.state.loading }>Create!</Button>
                </Form>
            </Layout>
        );
    }

}

export default NewCampaign;
