import React from 'react';
import _ from 'lodash';
import { Radio, Input, Switch, Icon} from 'antd';
import Scale from './Scale';
const RadioGroup = Radio.Group;

const QuestionInput = (props) => {
  switch(props.type) {
    case 'scale':
      return <Scale value={props.value} disabled={props.disabled} onChange={props.onChange}/>;
    case 'option':
      if (_.isEmpty(props.options) && props.value) return <Radio style={{whiteSpace: 'pre-wrap'}} defaultChecked disabled>{props.value}</Radio>
      return <RadioGroup
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
        value={props.value}
        disabled={props.disabled}
        size='large'
        onChange={({target}) => props.onChange(target.value)}
        >
        {_.map(props.options, (option, index) =>
          <Radio value={index + 1} style={{whiteSpace: 'pre-wrap'}}>{option}</Radio>
        )}
      </RadioGroup>;
    case 'freetext':
      return <Input type='textarea' rows={4} value={props.value} onChange={({target}) => props.onChange(target.value)}/>;
    case 'switch':
      return <Switch checked={!!props.value} checkedChildren={<Icon type='check' />} unCheckedChildren={<Icon type='cross' />} onChange={props.onChange}/>;
    default:
      return null;
  }
}

export default QuestionInput;
