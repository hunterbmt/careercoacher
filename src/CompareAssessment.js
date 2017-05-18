import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Steps, Row, Col, Button, Alert} from 'antd';
import QuestionInput from './QuestionInput';
import { getData, update} from './firebase';
import logo from './logo.png';
import Loading from './Loading';

const { Header, Content } = Layout;
const Step = Steps.Step;
let conflicts = {};
let finalAnswers = {};
class CompareAssessment extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    conflicts: {},
    loading: true,
    finalAnswers: {},
    current: 0,
    numberOfConflicsNotSolve: 0
  }

  componentDidMount() {
    Promise.all([getData('questions'),getData(`answers/${this.props.name}`),getData(`answers/${this.props.name}_manager`)])
      .then(([questions,selfAnswers,managerAnswers])=>{
        this.setState({
          questions: questions,
          selfAnswers : selfAnswers,
          managerAnswers : managerAnswers
        })
        this.getConflicts(this.props.name);
      })  
  }

  eachCompetencyQuestion(question, competency) {
    for (var i = 0; i < question.length; i++) {
      if (_.get(this.state.selfAnswers,`${competency}.${i}`) === _.get(this.state.managerAnswers,`${competency}.${i}`) ){   
          finalAnswers =  {
            ...finalAnswers,
            [competency]: {
              ...(finalAnswers[competency] || {}),
              [i]: _.get(this.state.selfAnswers,`${competency}.${i}`)
            }
          }
        continue;
      }
      switch (question[i].type) {
        case 'option':
          conflicts = {
            ...conflicts,
              [competency]: {
                ...conflicts[competency],
                [i]: {
                  isResolved: false,
                  type: 'option',
                  question: question[i].desc,
                  options: question[i].options,
                  selfAssessment:_.get(this.state.selfAnswers,`${competency}.${i}`),
                  managerAssessment: _.get(this.state.managerAnswers,`${competency}.${i}`)
                }
              }
          }       
          break;
        case 'scale':
          conflicts = {
            ...conflicts,
              [competency]: {
                ...conflicts[competency],
                [i]: {
                  isResolved: false,
                  type: 'scale',
                  question: question[i].desc,
                  options: question[i].options,
                  selfAssessment:_.get(this.state.selfAnswers,`${competency}.${i}`),
                  managerAssessment: _.get(this.state.managerAnswers,`${competency}.${i}`)
                }
              }
          }    
          break;

        case 'switch':
          conflicts = {
            ...conflicts,
              [competency]: {
                ...conflicts[competency],
                [i]: {
                  isResolved: false,
                  type: 'switch',
                  question: question[i].desc,
                  options: question[i].options,
                  selfAssessment:_.get(this.state.selfAnswers,`${competency}.${i}`),
                  managerAssessment: _.get(this.state.managerAnswers,`${competency}.${i}`)
                }
              }
          }    
          break;
        default:

      } 
    }
    this.setState({
      conflicts: conflicts,
      finalAnswers: finalAnswers,
      loading: false
    });
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

  findConflictsByCompetencyName(competency) {
    _.map(this.state.questions, (questions) => { 
      if (questions.competency === competency) {
        this.eachCompetencyQuestion(questions.questions,competency)
      }
    });
  }

  handle(answers) {
    _.map(Object.keys(answers),(competencyName)=>this.findConflictsByCompetencyName(competencyName));
  }

  getConflicts = (name) => {
    getData(`answers/${name}`)
      .then((answers) => this.handle(answers)
      );
  }
 
  isConflictsResolved(){
    _.map((this.state.conflicts),(conflicts)=>{
      _.map((conflicts),(conflicts)=>{
        if(conflicts.isResolved === false) {
          this.setState(prevState => ({
            numberOfConflicsNotSolve: prevState.numberOfConflicsNotSolve+1
          }))
        }
      })
    });
  }

  saveFinalAnswers(finalAnswers) {
    this.isConflictsResolved();
    if(this.state.numberOfConflicsNotSolve === 0) {
      update(`answers/${this.props.name}_final`, this.state.finalAnswers);
      window.location.replace(`/#/compare/${this.props.name}/final`);
    }
  }

  render() {
    if (this.state.loading) return <Loading />;
    const competenciesName = Object.keys(this.state.conflicts);
    const listConflicts = Object.values(this.state.conflicts);
    const currentCompetencyName = competenciesName[this.state.current];
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
            <Row type='flex' justify='center' style={{ padding: '10px 0' }}>
              <h2>Assessment comparation for {this.props.name}</h2>
            </Row>
            <Row type='flex' justify='center' style={{ padding: '10px 0' }}>
              <h3>Please discuss and resolve conflict below </h3>
            </Row>
            <Row style={{ padding: '20px 0' }} type='flex'>
              <Steps current={this.state.current}>
                {_.map(this.state.conflicts, (conflict, key) =>
                  <Step title={key} />
                )}
              </Steps>
            </Row>
            <div className='steps-content'>
              <Row type='flex'>
                {
                  _.map(listConflicts[this.state.current], (conflict, index) =>
                    <Col span={12} className='question-content'>
                      <h3>Question {index}: {conflict.question} ({competenciesName[this.state.current]})</h3>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: 5, marginLeft: 15 }}>
                        <div>
                          <h4>Seft-assessment: </h4> <QuestionInput type={conflict.type} value={conflict.selfAssessment} disabled />
                        </div>
                        <div>
                          <h4>Manager assessment: </h4> <QuestionInput type={conflict.type} value={conflict.managerAssessment} disabled />
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <h4>Final result</h4> <QuestionInput type={conflict.type} options={conflict.options} onChange={(value) => this.setState({
                          finalAnswers: {
                            ...this.state.finalAnswers,
                            [currentCompetencyName]: {
                              ...(this.state.finalAnswers[currentCompetencyName] || {}),
                              [index]: value
                            }
                          },
                          conflicts: {
                            ...this.state.conflicts,
                            [currentCompetencyName]: {
                              ...(this.state.conflicts[currentCompetencyName] || {}),
                              [index]:{
                                ...this.state.conflicts[currentCompetencyName][index],
                                isResolved: true
                              }                             
                            }
                          }
                        })}
                          value={_.get(this.state.finalAnswers, `${currentCompetencyName}.${index}`)}
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
                this.state.current < competenciesName.length - 1
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
                this.state.current === competenciesName.length - 1
                &&
                <Button
                  type="primary"
                  size='large'
                  style={{
                    width: 80
                  }}
                  onClick={() => this.saveFinalAnswers(this.state.finalAnswers)}
                >
                  Resolve
                </Button>
              }
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default CompareAssessment;
