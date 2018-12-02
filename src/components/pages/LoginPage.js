//React Module
import React from 'react';
import { View, Text, TextInput, TouchableOpacity,
    Dimensions, 
    StyleSheet
} from 'react-native';

//Third-Party Module
import LinearGradient from 'react-native-linear-gradient';

//User Module
import { toast } from '../../function/common';
import { ThemeConsumer } from 'react-native-elements';


class LoginPage extends React.Component{
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        this.state = {
            test: null,
            valid:{
                ID: false,
                PW: false,
            },
            forms:{
                ID: '',
                PW: ''
            }
        }

        this.pressLoginButton = this.pressLoginButton.bind(this);
    }
    //user_Method
    pressLoginButton(){
        const {navigate} = this.props.navigation;

        this.checkUserValid();

        navigate('MainPage');

        if(this.state.valid.ID && this.state.valid.PW)
            navigate('MainPage');
        else{
            this.setState({
                valid:{
                    ID: false,
                    PW: false
                }
            },()=>{toast(`Check your ID and Password`);})
        }
    }

    checkUserValid(){
        const user_info = {ID:'cmj9597@naver.com', PW:'test1234'};
        
        Object.keys(this.state.forms).map((property)=>{
            if(this.state.forms[property] === user_info[property]){
                this.state.valid[property] = true;
            }
        });
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
                            placeholderTextColor='#ffffff'
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
        return(
            <TouchableOpacity style={[styles.form, styles.button]} onPress={this.pressLoginButton}>
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text>login</Text>
                </View>
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
        backgroundColor: '#f774a5',
    },
    button:{
        marginTop: 60,
        backgroundColor: '#ffffff'
    }
})


export default LoginPage;