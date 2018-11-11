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

export { clone };