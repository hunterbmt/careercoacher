import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Steps, Row, Col, Button, Modal } from 'antd';
import QuestionInput from './QuestionInput';
import Loading from './Loading';

import {getData, writeAnswers} from './firebase';
import logo from './logo.png';
const { Header, Content } = Layout;
const Step = Steps.Step;


class SelfAssessment extends Component {
  state = {
    current: 0,
    loading: true,
    answers: {}
  }

  componentDidMount() {
    getData('questions')
      .then((questions) => this.setState({
        questions,
        loading: false
      }));
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
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

  onDone = () => {
    const part = _.isEmpty(this.props.manager) ? this.props.name : `${this.props.name}_manager`;
    this.setState({
      saving: true
    });
    writeAnswers(part, this.state.answers).then(() => window.location.replace('/careercoacher/#/finish'));
  }

  render() {
    if (this.state.loading) return <Loading />;

    const questions = this.state.questions;
    const currentCompentency = questions[this.state.current];
    return (
      <Layout style={{height: '100%'}}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{height: '100%'}}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{height: 64, padding: 10}}/>
            </Col>
          </Row>
        </Header>
        <Layout>
          <Content style={{ margin: 16, background: '#fff', padding: '0 20px'}}>
            {
              _.isEmpty(this.props.manager) ?
              <Row type='flex' style={{flexDirection: 'column'}}>
                <Row type='flex' justify='center' style={{padding: '10px 0'}}>
                  <h2>Welcome {this.props.name}</h2>
                </Row>
                <Row type='flex' justify='center' style={{padding: '10px 0'}}>
                  <h3>Please answer questions below for your self-assement </h3>
                </Row>
              </Row> :
              <Row type='flex' style={{flexDirection: 'column'}}>
                <Row type='flex' justify='center' style={{padding: '10px 0'}}>
                  <h2>Welcome {this.props.manager}</h2>
                </Row>
                <Row type='flex' justify='center' style={{padding: '10px 0'}}>
                  <h3>Please answer questions below for {this.props.name} s assement </h3>
                </Row>
              </Row>
            }
            <Row style={{padding: '20px 0'}} type='flex'>
              <Steps current={this.state.current}>
                {_.map(questions, (question) =>
                  <Step title={question.competency} />
                )}
              </Steps>
            </Row>
            <div className='steps-content'>
              <Row type='flex'>
                {
                  _.map(currentCompentency.questions, (question, index) =>
                    <Col span={12} className='question-content'>
                      <h3>Question {index + 1}: <span style={{whiteSpace: 'pre-wrap'}}>{question.desc}</span> {!_.isEmpty(question.hint) ? <Button shape="circle" icon="question" size="small" onClick={() => this.openHint(question.hint)}/> : null}</h3>
                      <div style={{width: '100%'}}>
                        <QuestionInput {...question} onChange={(value) => this.setState({
                          answers: {
                            ...this.state.answers,
                            [currentCompentency.competency]: {
                              ...(this.state.answers[currentCompentency.competency] || {}),
                              [index]: value
                            }
                          }
                        })}
                        value={_.get(this.state.answers, `${currentCompentency.competency}.${index}`)}
                        />
                      </div>
                    </Col>
                  )
                }
              </Row>
            </div>
            <div className='steps-action'>
              {
                this.state.current > 0
                &&
                <Button
                  style={{ marginRight: 8 }}
                  size='large'
                  onClick={() => this.prev()}
                >
                  Previous
                </Button>
              }
              {
                this.state.current < questions.length - 1
                &&
                <Button
                  type='primary'
                  size='large'
                  onClick={() => this.next()}
                >
                  Next
                </Button>
              }
              {
                this.state.current === questions.length - 1
                &&
                <Button
                  type="primary"
                  size='large'
                  onClick={this.onDone}
                  loading={this.state.saving}
                  disabled={this.state.saving}
                >
                  Done
                </Button>
              }
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
            <p style={{fontSize: 14}}>{this.state.hint}</p> :
            _.map(this.state.hint, (hint, language) =>
            <p style={{fontSize: 14}}>{getLanguage(language)}: {hint}</p>
          )
        }

        </Modal>
      </Layout>
    );
  }
}

function getLanguage(language) {
  switch (language) {
    case 'csharp':
      return 'C#';
    case 'js':
      return 'Javascript';
    case 'java':
      return 'Java';
    default:
      return '';

  }
}

export default SelfAssessment;
