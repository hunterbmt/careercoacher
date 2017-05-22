import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Row, Col, Button, Modal, InputNumber, Checkbox, Collapse, Icon, Radio } from 'antd';
import Loading from './Loading';
import { getData, update } from './firebase';
import logo from './logo.png';
const { Header, Content } = Layout;
const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;
class SetWeight extends Component {
  state = {
    loading: true,
    defaultWeight: 0,
    constraints: { minRange: 0, maxRange: 0, title: '', weight: {} },
    disabledSetWeight: []
  }

  getTitle() {
    switch (this.props.title) {
      case 'SE':
      case 'SA':
      case 'SSE':
        this.setState({
          constraints: {
            ...this.state.constraints,
            title: 'AVG ' + this.props.title
          }
        });
        break;
      default:
        this.setState({
          title: ''
        });
    }
  }

  findOneByTitle(baseline) {
    const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
    _.map(baseline, (baseline, key) => {
      if (baseline.name === this.state.constraints.title) {
        getData(`baseline/${key}/${option}/competencies/${this.props.index}/proficiency`)
          .then((value) => this.setState({ defaultWeight: value })
          );
      }
    });
  }

  getDefaultWeight() {
    getData('baseline')
      .then((baseline) => this.findOneByTitle(baseline));
  }

  setStateForQuestion = (questions) => {
    let disabledSetWeight = []
    _.map(questions, () => disabledSetWeight.push(true))
    this.setState({
      questions,
      disabledSetWeight,
      loading: false
    })
  }
  componentDidMount() {
    this.getTitle();
    this.getDefaultWeight();
    const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
    getData(`competencies/${option}/${this.props.index}/questions`)
      .then((questions) => this.setStateForQuestion(questions))
  }
  openHint(hint) {
    this.setState({
      visible: true,
      hint
    });
  }
  closeHint = () => {
    this.setState({
      visible: false
    });
  }

  setValueForMinRange(value) {
    if (value > this.state.constraints.maxRange) {
      this.setState({
        constraints: {
          ...this.state.constraints,
          maxRange: value,
          minRange: value
        }
      })
    } else {
      this.setState({
        constraints: {
          ...this.state.constraints,
          minRange: value
        }
      })
    }
  }

  changeMin(value) {
    _.isNumber(value) ?
      this.setValueForMinRange(value)
      : null
  }

  changeMax(value) {
    _.isNumber(value) ?
      this.setState({
        constraints: {
          ...this.state.constraints,
          maxRange: value
        }
      }) : null
  }

  changeWeight(value, index) {
    _.isNumber(value)?
      this.setState({
        constraints: {
          ...this.state.constraints,
          weight: {
            ...this.state.constraints.weight,
            [index]: value
          }
        }
      })
      : null
  }

  onRadioSetWeightChange(index, e) {
    this.state.disabledSetWeight[index] = true
    if (e.target.value === 'none') {
      this.setState({
        constraints: {
          ...this.state.constraints,
          weight: {
            ...this.state.constraints.weight,
            [index]: 0
          }
        }
      })
    }
    else if (e.target.value === 'default') {
      this.state.disabledSetWeight[index] = true
      this.setState({
        constraints: {
          ...this.state.constraints,
          weight: {
            ...this.state.constraints.weight,
            [index]: this.state.defaultWeight
          }
        }
      })
    } else {
      this.state.disabledSetWeight[index] = false
      this.setState({
        disabledSetWeight: this.state.disabledSetWeight
      })
    }

  }

  saveConstraints() {
    let indexTitle;
    switch (this.props.title) {
      case 'SE':
        indexTitle = 0;
        break;
      case 'SSE':
        indexTitle = 1;
        break;
      case 'SA':
        indexTitle = 2;
        break;
    }

    const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
    update(`competencies/${option}/${this.props.index}/constraints/${indexTitle}`, this.state.constraints);
  }

  render() {
    if (this.state.loading) return <Loading />
    const questions = this.state.questions
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{ height: 64, padding: 10 }} />
            </Col>
          </Row>
        </Header>
        <Layout>
          <Content style={{ margin: 16, background: '#fff', padding: '0 20px' }}>
            {
              <Row type='flex' style={{ flexDirection: 'column' }}>
                <Row type='flex' justify='left' style={{ padding: '10px 0' }}>
                  <h2>{this.props.name}</h2>
                </Row>
                <Row type='flex' justify='left' style={{ padding: '10px 0' }}>
                  <h3>{`Set weight/constraints for ${this.state.constraints.title}`}</h3>
                </Row>
                <Row type='flex' justify='left' style={{ padding: '10px 0' }}>
                  <h3>{`Default weight: ${this.state.defaultWeight}`}</h3>
                </Row>
                <Row type='flex' justify='left' style={{ padding: '10px 0' }}>
                  <Checkbox>Use default weight for all questions</Checkbox>
                </Row>
                <Row type='flex' justify='left' style={{ padding: '10px 0' }}>
                  <div>
                    <h3>Range</h3>
                    <InputNumber min={0} defaultValue={0} onChange={(value) => this.changeMin(value)} /><Icon type="arrow-right" />
                    <InputNumber min={this.state.constraints.minRange} defaultValue={0} value={this.state.constraints.maxRange} onChange={(value) => this.changeMax(value)} />
                  </div>
                </Row>
              </Row>

            }
            <div className='steps-content'>
              <Row type='flex'>
                {
                  _.map(questions, (question, index) =>
                    <Col span={12} className='question-content'>
                      {
                        _.isEqual(question.type, 'freetext') ?
                          null
                          :
                          <div>
                            <Collapse accordion style = {{marginBottom: 10}}>
                              <Panel header={`Question ${index + 1}`} key={index}>
                                <p>{question.desc} {!_.isEmpty(question.hint) ? <Button shape="circle" icon="question" size="small" onClick={() => this.openHint(question.hint)} /> : null}</p>
                              </Panel>
                            </Collapse>
                            <RadioGroup onChange={(e) => this.onRadioSetWeightChange(index, e)} defaultValue='none'>
                              <Radio value='none'>No constraint</Radio>
                              <Radio value='default'>Use default weight for this question</Radio>
                              <Radio value='customize'>Set another weight</Radio>
                              <InputNumber min={0} max={4} disabled={this.state.disabledSetWeight[index]} defaultValue={this.state.defaultWeight} onChange={(value) => this.changeWeight(value,index)}/>
                            </RadioGroup>
                          </div>
                      }
                    </Col>

                  )
                }

              </Row>
              <Row type='flex' justify='center' style={{ padding: '10px 0' }}>
                <Button type="primary" onClick={() => this.saveConstraints()}>Save changes</Button>
              </Row>
            </div>
          </Content>
        </Layout>
        <Modal title="Hint" visible={this.state.visible}
          onOk={this.closeHint}
          onCancel={this.closeHint}
          footer={[
            <Button key="back" size="large" type="primary" onClick={this.closeHint}>Ok</Button>
          ]}
        >
          {_.isString(this.state.hint) ?
            <p style={{ fontSize: 14 }}>{this.state.hint}</p> :
            _.map(this.state.hint, (hint, language) =>
              <p style={{ fontSize: 14 }}>: {hint}</p>
            )
          }

        </Modal>
      </Layout>
    );
  }
}

export default SetWeight;