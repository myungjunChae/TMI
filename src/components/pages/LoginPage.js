//React Module
import React from 'react';
import { View, Text, TextInput, TouchableOpacity,
    Dimensions, 
    StyleSheet
} from 'react-native';

//Third-Party Module
import LinearGradient from 'react-native-linear-gradient';

//User Module


class LoginPage extends React.Component{
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        this.state = {
            forms:{
                ID: '',
                PW: ''
            }
        }
    }
    //user_Method
    pressLoginButton(){
        console.log(this.state.forms);
    }

    //user_setMethod
    setFormsData(property, data){
        this.state.forms[property] = data;
        this.forceUpdate();
    }

    //Render Method
    renderBackground(){
        backgroundColor = [backgroundColor_start, backgroundColor_end];
        return(
            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={backgroundColor} style={styles.background}>
                <View style={styles.content}>
                    <View style={{flexGrow:1}}>
                        {this.renderTitle()}
                    </View>
                    <View style={{flexGrow:1}}> 
                        {this.renderForm()}
                        {this.renderButton()}
                    </View>
                </View>
            </LinearGradient>
        );
    }

    renderTitle(){
        return(
            <View style={{top:100, flex:0, flexDirection:'column', alignItems:'center'}}>
                <Text style={styles.title}>TMI</Text>
                <Text style={styles.subTitle}>Things Management by IoT</Text>
            </View>
        );
    }

    renderForm(){
        return(
            <View>   
                {Object.keys(this.state.forms).map((property)=>(
                    <View key={property} style={[styles.form, styles.input]}>
                        <TextInput
                            style={{color:'#ffffff'}}
                            placeholder={property}
                            placeholderTextColor='#ff695e'
                            onChangeText={(input) => {
                                this.setFormsData(property, input); 
                            }}
                        />
                    </View>
                ))}
            </View>
        );
    }

    renderButton(){
        const {navigate} = this.props.navigation;
        return(
            <TouchableOpacity onPress={() => navigate('MainPage')}>
                <Text style={[styles.form, styles.button]}></Text>
            </TouchableOpacity>
        )
    }

    render(){
        return(
            <View>
                {this.renderBackground()}
            </View>
        );
    }
}

//color
const backgroundColor_start = '#e50099';
const backgroundColor_end = '#ff695e';
const inputColor = '#ff695e'

const win = Dimensions.get('window');

const styles = StyleSheet.create({
    background:{
        width: win.width,
        height: win.height
    },
    content:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    title:{
        color: '#ffffff',
        fontSize: 60,
        fontWeight: 'bold'
    },
    subTitle:{
        color: '#ffffff'
    },
    form:{
        top: 20,
        width: 260,
        height: 40,
        borderRadius: 20,
        marginTop: 20
    },
    input:{
        backgroundColor: '#ffffff',
    },
    button:{
        marginTop: 60,
        backgroundColor: '#ffffff'
    }
})


export default LoginPage;