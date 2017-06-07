import React, {Component} from 'react'
import { Checkbox, Modal, Button, Row, Col } from 'antd'
import _ from 'lodash'

export default class CompentencyConfig extends Component {
  state = {
    open: false
  }

  render() {
    const {
      compentencies
    } = this.props
    const chunkedCompentencyList = _.chunk(compentencies, 2)
    return (
      <div>
        <Button
          onClick={this.open}
          shape="circle"
          icon="setting"
          style={{width: 40, height: 40, fontSize: 20, display: 'flex', justifyContent: 'center'}}/>
          <Modal title="Profile Setting" visible={this.state.open}
            onOk={this.close} onCancel={this.close}
          >
            {_.map(chunkedCompentencyList, ([first, second]) =>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={this.isSelected(first)}
                    value={first}
                    onChange={this.compentencyOnChange}>
                    {first}
                  </Checkbox>
                </Col>
                <Col span={12}>
                  {
                    !_.isEmpty(second) ?
                    <Checkbox
                      checked={this.isSelected(second)}
                      value={second}
                      onChange={this.compentencyOnChange}>
                      {second}
                    </Checkbox> : null
                  }
                </Col>
              </Row>
            )}
          </Modal>
      </div>
    )
  }
  isSelected = (value) => _.indexOf(this.props.selectedCompentencies, value) > -1
  open = () => this.setState({open: true})
  close = () => this.setState({open: false})
  compentencyOnChange = (e) => {
    const checked = e.target.checked
    const value = e.target.value
    if (!checked) {
      this.props.removeCompentency(value)
    } else {
      this.props.addCompentency(value)
    }
  }
}
