import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Elements, { ListItem } from 'react-native-elements'
import { StyledView } from './style/style';

class ItemList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {id: '1', name:'unkown1', state:'connected'},
                {id: '2', name:'unkown2', state:'connected'},
                {id: '3', name:'unkown3', state:'connected'},
                {id: '4', name:'unkown4', state:'connected'},
                {id: '5', name:'unkown5', state:'connected'},
            ]
        };
    }

    renderList = (item) => {
        return(
            <View>
                <Text>{item.name}</Text>
                <Text>{item.state}</Text>
            </View>
        )
    }

    render() {
        return (
            <View>
                <Text>Item List</Text>
                <FlatList 
                    data={this.state.data}
                    renderItem={({item})=>(
                        this.renderList(item)
                    )}
                    keyExtractor={item => item.id}/>
            </View>
        );
    }
}

export default ItemList;