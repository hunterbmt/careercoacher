import React from 'react';
import { Card } from 'antd';
import _ from 'lodash';
const Summary = (props) => {
    return <Card title='Summary' extra={<a href="#">More</a>} style={{ width: 500}}>
        {       
        _.map(props.data,(data,key)=>
            _.isObject(data)?
            <div>At question {_.toNumber(key)+1}, you are {data.under} but we require {data.weight}</div>
            :
            null
        )}
        </Card>
    
}

export default Summary;
