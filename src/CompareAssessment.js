import React, {Component} from 'react';
import _ from 'lodash';
import { Layout, Steps, Row, Col, Button} from 'antd';
import QuestionInput from './QuestionInput';
import {getData, update, database, insert} from './firebase';
import logo from './logo.png';
import Loading from './Loading';

const { Header, Content } = Layout;
const Step = Steps.Step;
class CompareAssessment extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    managerAnswers: [],
    selfAnswers: [],
    conflicts : {},
    loading : true,
    finalAnswers: {},
    current: 0
  }

  componentDidMount() {
    this.getSelectedCompetenciesDataToState(this.props.name);
    this.setState({
      loading : false
    });
  }

  eachCompetencyQuestion(question, competency) {
    for(var i=0 ; i< question.length; i++) {
      if(this.state.selfAnswers[i] === this.state.managerAnswers[i]) {
        continue;
      }
      switch (question[i].type) {
        case 'option':
          this.setState({
            conflicts:{
              ...this.state.conflicts,
              [competency]: {
                ...this.state.conflicts[competency],
                [i]: {
                  type: 'option',
                  question: question[i].desc,
                  options: question[i].options,
                  selfAssessment: this.state.selfAnswers[i],
                  managerAssessment: this.state.managerAnswers[i]
                }
              }
            }});
          break;
        case 'scale':
          this.setState({
            conflicts:{
              ...this.state.conflicts,
              [competency]: {
                ...(this.state.conflicts[competency]),
                [i]: {
                  type: 'scale',
                  question: question[i].desc,
                  selfAssessment: this.state.selfAnswers[i],
                  managerAssessment: this.state.managerAnswers[i]
                }
              }
            }});
          break;

        case 'switch':
          this.setState({
            conflicts:{
              ...this.state.conflicts,
              [competency]: {
                ...(this.state.conflicts[competency]),
                [i]: {
                  type: 'switch',
                  question: question[i].desc,
                  selfAssessment: this.state.selfAnswers[i],
                  managerAssessment: this.state.managerAnswers[i]
                }
              }
            }});
            break;
        default:

      }
    }
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
  getQuestion(competency) {
    getData(`answers/${this.props.name}/${competency}`)
    .then((answer) =>
    this.setState({
        selfAnswers: answer
    }));
    getData(`answers/${this.props.name}_manager/${competency}`)
    .then((answer) =>
      this.setState({
          managerAnswers: answer
      }));
    getData(`competencies/${competency}/questions`)
    .then((ques) => this.eachCompetencyQuestion(ques, competency)
    );
  }

  handle(answer) {
    var competencies = Object.keys(answer);
    Object.values(competencies).map((competency) => this.getQuestion(competency));
  }

  getSelectedCompetenciesDataToState = (name) => {
    getData(`answers/${name}`)
    .then((answer) => this.handle(answer)
    );
  }

  saveFinalAnswers(finalAnswers) {
    insert(`answers/${this.props.name}_final`,this.state.finalAnswers);
    window.location.replace(`/#/compare/${this.props.name}/final`);
  }

  render() {
    if (this.state.loading) return <Loading />;
    const competenciesName = Object.keys(this.state.conflicts);
    const listConflicts = Object.values(this.state.conflicts);
    const currentCompetencyName = competenciesName[this.state.current];
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
            <Row style={{padding: '20px 0'}} type='flex'>
              <Steps current={this.state.current}>
                {_.map(competenciesName, (name) =>
                  <Step title={name} />
                )}
              </Steps>
            </Row>
            <div className='steps-content'>
              <Row type='flex'>
                {
                  _.map(listConflicts[this.state.current], (conflict, index) =>
                    <Col span={12} className='question-content'>
                      <h3>Question {index+1}: {conflict.question} ({competenciesName[this.state.current]})</h3>
                      <div style={{width: '100%', display: 'flex', flexDirection: 'column', marginTop: 5, marginLeft: 15}}>
                        <div>
                          <h4>Seft-assessment: </h4> <QuestionInput type={conflict.type} value={conflict.selfAssessment} disabled/>
                        </div>
                        <div>
                          <h4>Manager assessment: </h4> <QuestionInput type={conflict.type} value={conflict.managerAssessment} disabled/>
                        </div>
                      </div>
                      <div style={{marginTop: 10}}>
                        <h4>Final result</h4> <QuestionInput type={conflict.type} options={conflict.options} onChange={(value) => this.setState({
                          finalAnswers: {
                            ...this.state.finalAnswers,
                            [currentCompetencyName]: {
                              ...(this.state.finalAnswers[currentCompetencyName] || {}),
                              [index]: value
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
