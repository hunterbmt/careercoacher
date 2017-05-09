import React, {Component} from 'react';
import _ from 'lodash';
import { Layout, Row, Col, Button} from 'antd';
import QuestionInput from './QuestionInput';
import {getData, update, database} from './firebase';
import logo from './logo.png';
const { Header, Content } = Layout;

const conflicts = [
  {
    compentency: 'Programming Language',
    question: 'How confident you are with your ability in task performing without helps or instructions',
    type: 'scale',
    selfAssessment: 4,
    managerAssessment: 3
  },
  {
    compentency: 'Programming Language',
    question: 'How you evaluate your awareness about common performance issues in JS',
    type: 'scale',
    selfAssessment: 2,
    managerAssessment: 3
  },
  {
    compentency: 'Programming Language',
    question: 'How confident you are with code designing tasks',
    type: 'scale',
    selfAssessment: 3,
    managerAssessment: 4
  },
  {
    compentency: 'Programming Language',
    type: 'option',
    desc: 'How about another/ advances programming paradigms',
    options: [
      "I don't know any other programming paradigms",
      "I hear about some others paradigms such as OOP or functional programming",
      "I have good knowledge about others paradigms but not yet apply them into projects",
      "I apply others paradigms in projects and can see clearly benefit of applying those"
    ],
    selfAssessment: 'I have good knowledge about others paradigms but not yet apply them into projects',
    managerAssessment: 'I hear about some others paradigms such as OOP or functional programming'
  },
  {
    compentency: 'Source Control',
    question: 'Conflict example question 5',
    type: 'scale',
    selfAssessment: 3,
    managerAssessment: 1
  },
  {
    compentency: 'Web backend',
    question: 'Conflict example question 6',
    type: 'scale',
    selfAssessment: 2,
    managerAssessment: 1
  }
]

class CompareAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selfAnswer : [],
      managerAnswer : [],
      conflicts : []
    }
  }

  componentDidMount() {
    this.getSelfAnswerDataToState(this.props.name);
    this.getManagerAnswerDataToState(this.props.name);

  }

  getSelfAnswerDataToState = (name) => {
    getData(`answers/${name}`)
    .then((answer) =>
    this.setState({
      selfAnswer: answer
    }));
  }
  getManagerAnswerDataToState = (name) => {
    getData(`answers/${name}_manager`)
    .then((answer) =>
    this.setState({
      managerAnswer: answer
    }));
  }
  render() {
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
            <Row type='flex' justify='center' style={{padding: '10px 0'}}>
              <h2>Assessment comparation for {this.props.name}</h2>
            </Row>
            <Row type='flex' justify='center' style={{padding: '10px 0'}}>
              <h3>Please discuss and resolve conflict below </h3>
              <getData />
            </Row>
            <div className='steps-content'>
              <Row type='flex'>
                {
                  _.map(conflicts, (conflict, index) =>
                    <Col span={12} className='question-content'>
                      <h3>Question {index + 1}: {conflict.question} ({conflict.compentency})</h3>
                      <div style={{width: '100%', display: 'flex', flexDirection: 'column', marginTop: 5, marginLeft: 15}}>
                        <div>
                          <h4>Seft-assessment: </h4> <QuestionInput type={conflict.type} value={conflict.selfAssessment} disabled/>
                        </div>
                        <div>
                          <h4>Manager assessment: </h4> <QuestionInput type={conflict.type} value={conflict.managerAssessment} disabled/>
                        </div>
                      </div>
                      <div style={{marginTop: 10}}>
                        <h4>Final result</h4> <QuestionInput type={conflict.type} options={conflict.options}/>
                      </div>
                    </Col>
                  )
                }
              </Row>
            </div>
            <div className='steps-action'>
              <Button
                type='primary'
                size='large'
                style={{
                  width: 80
                }}
              >
                Resolve
              </Button>
              <Button
                size='large'
                style={{
                  marginLeft: 20,
                  width: 80
                }}
              >
                Close
              </Button>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default CompareAssessment;
