import { ToastAndroid, Vibration } from 'react-native'

function clone(obj){
    if(obj === null && typeof(obj) !== 'object')
        return obj;

    let copy = obj.constructor();

    for(let index in obj){
        if(obj.hasOwnProperty(index)){
            copy[index] = clone(obj[index]);
        }
    }

    return copy;
}

function toast(text){
    ToastAndroid.showWithGravity(
        text,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
    );
}

function vibrationOn(time){
    if(time === undefined)
        time = 1000;

    Vibration.vibrate(time);
}

function vibrationOff(){
    Vibration.cancel();
}

export { clone, toast, vibrationOn, vibrationOff };