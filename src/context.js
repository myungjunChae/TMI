import React, { Component, createContext } from 'react';

const Context = createContext();

const { Provider, Consumer: SampleConsumer } = Context;

class SampleProvider extends Component {
    state = {
        info: []
    }

    actions = {
        setLostDeviceInfo: (value) => {
            console.log(value);
            let title = value.title;
            let latitude = Number(value.location.split(',')[0]);
            let longitude = Number(value.location.split(',')[1]);

            this.state.info.push({
                position:{
                    latitude, 
                    longitude
                },
                title
            });
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