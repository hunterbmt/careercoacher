import React, {Component} from 'react';
import {Rate} from 'antd';

export default class Scale extends Component {
  state = {
    value: this.props.value || 0
  }
  handleChange = (value) => {
    this.setState({value})
    this.props.onChange(value);
  }
  render() {
    const { value } = this.state;
    return (
      <span>
        <Rate onChange={this.handleChange} value={value} disabled={this.props.disabled}/>
        <span className="ant-rate-text">{this.getText(value)}</span>
      </span>
    );
  }

  getText = (value) => {
    switch (value) {
      case 1:
        return 'No knowledge';
      case 2:
        return 'Basic';
      case 3:
        return 'Normal';
      case 4:
        return 'Good';
      case 5:
        return 'Very good';
      default:
        return '';

    }
  }
}
