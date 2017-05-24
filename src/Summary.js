import React from 'react';
import _ from 'lodash';
import { getData} from './firebase'
const Summary = (props) => {
    return <div>{
        
        _.map(props.data,(data,key)=>
            <h3>{key}</h3>
        )

    }</div>
    
}

export default Summary;
