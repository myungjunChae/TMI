import React, { Component, createContext } from 'react';

const Context = createContext();

const { Provider, Consumer: SampleConsumer } = Context;

class SampleProvider extends Component {
    state = {
        updateState: true
    }

    actions = {
        forceUpdate: () => {
            console.log('forceUpdate');
            this.setState({updateState: !this.updateState});
        }
    }

    render() {
        const { state, actions } = this;
        const value = { state, actions };
        return (
            <Provider value={value}>
                {this.props.children}
            </Provider>
        );
    }
}

export { SampleProvider, SampleConsumer };