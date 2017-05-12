import React, {Component} from 'react';
import _ from 'lodash';
import { Layout, Row, Col, Button} from 'antd';
import QuestionInput from './QuestionInput';
import {getData, update, database, insert} from './firebase';
import logo from './logo.png';
import Loading from './Loading';

const { Header, Content } = Layout;

class CompareAssessment extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    managerAnswers: [],
    selfAnswers: [],
    conflicts : [],
    loading : true,
    finalAnswers: {}
  }

  componentDidMount() {
    this.getSelectedCompetenciesDataToState(this.props.name);
    this.setState({
      loading : false
    });
  }

  eachCompetencyQuestion(question, competency) {
    for(var i=0 ; i< question.length; i++) {
      switch (question[i].type) {
        case 'option':
          this.state.conflicts.push({
            competency: competency,
            type: 'option',
            question: question[i].desc,
            options: question[i].options,
            selfAssessment: this.state.selfAnswers[i],
            managerAssessment: this.state.managerAnswers[i]
          });
          break;
        case 'scale':
          this.state.conflicts.push({
            competency: competency,
            type: 'scale',
            question: question[i].desc,
            selfAssessment: this.state.selfAnswers[i],
            managerAssessment: this.state.managerAnswers[i]
          });
          break;
        case 'switch':
          this.state.conflicts.push({
            competency: competency,
            type: 'switch',
            question: question[i].desc,
            selfAssessment: this.state.selfAnswers[i],
            managerAssessment: this.state.managerAnswers[i]
        });
          break;
        case 'freetext':
          this.state.conflicts.push({
            competency: competency,
            type: 'freetext',
            question: question[i].desc,
            selfAssessment: this.state.selfAnswers[i],
            managerAssessment: this.state.managerAnswers[i]
        });
            break;
        default:
          console.log("No idea");
      }
    }
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

    const conflicts = this.state.conflicts;
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
                      <h3>Question {index + 1}: {conflict.question} ({conflict.competency})</h3>
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
                            [conflict.competency]: {
                              ...(this.state.finalAnswers[conflict.competency] || {}),
                              [index]: value
                            }
                          }
                        })}
                        value={_.get(this.state.finalAnswers, `${conflict.competency}.${index}`)}
                        />
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
                onClick={() => this.saveFinalAnswers(this.state.finalAnswers)}
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
