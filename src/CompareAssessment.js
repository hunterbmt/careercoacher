import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Steps, Row, Col, Button, message } from 'antd';
import QuestionInput from './QuestionInput';
import { getData, update } from './firebase';
import logo from './logo.png';
import Loading from './Loading';

const { Header, Content } = Layout;
const Step = Steps.Step;


class CompareAssessment extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    conflicts: {},
    loading: true,
    finalAnswers: {},
    current: 0
  }

  conflicts = {};
  finalAnswers = {};

  error = () => {
    message.error('You need to resolve all conflicts');
  };

  componentDidMount() {
    Promise.all([getData('competencies'), getData(`answers/${this.props.name}`), getData(`answers/${this.props.name}_manager`)])
      .then(([competencies, selfAnswers, managerAnswers]) => {
        this.setState({
          competencies,
          selfAnswers,
          managerAnswers
        })
        this.getConflicts(this.props.name);
      })
  }

  getConflicts = (name) => {
    getData(`answers/${name}`)
      .then((answers) => this.handle(answers)
      );
  }

  handle(answers) {
    _.map(Object.keys(answers), (competencyName) => this.findConflictsByCompetencyName(competencyName));
  }

  findConflictsByCompetencyName(competencyName) {
    let core_competency = _.find(this.state.competencies.Kms_core, { name: competencyName })
    let optinal_competency = _.find(this.state.competencies.Kms_optional, { name: competencyName })
    if(core_competency == null) {
      this.eachCompetencyQuestion(optinal_competency.questions, competencyName)
    } else {
      this.eachCompetencyQuestion(core_competency.questions, competencyName)
    }
    
  }

  eachCompetencyQuestion(question, competency) {
    for (let i = 0; i < question.length; i++) {
      if (_.get(this.state.selfAnswers, `${competency}.${i}`) === _.get(this.state.managerAnswers, `${competency}.${i}`)) {
        this.finalAnswers = {
          ...this.finalAnswers,
          [competency]: {
            ...(this.finalAnswers[competency] || {}),
            [i]: _.get(this.state.selfAnswers, `${competency}.${i}`)
          }
        }
        continue;
      }
      switch (question[i].type) {
        case 'option':
          this.conflicts = {
            ...this.conflicts,
            [competency]: {
              ...this.conflicts[competency],
              [i]: {
                isResolved: false,
                selfAssessment: _.get(this.state.selfAnswers, `${competency}.${i}`),
                managerAssessment: _.get(this.state.managerAnswers, `${competency}.${i}`)
              }
            }
          }
          break;
        case 'scale':
          this.conflicts = {
            ...this.conflicts,
            [competency]: {
              ...this.conflicts[competency],
              [i]: {
                isResolved: false,
                selfAssessment: _.get(this.state.selfAnswers, `${competency}.${i}`),
                managerAssessment: _.get(this.state.managerAnswers, `${competency}.${i}`)
              }
            }
          }
          break;

        case 'switch':
          this.conflicts = {
            ...this.conflicts,
            [competency]: {
              ...this.conflicts[competency],
              [i]: {
                isResolved: false,
                selfAssessment: _.get(this.state.selfAnswers, `${competency}.${i}`),
                managerAssessment: _.get(this.state.managerAnswers, `${competency}.${i}`)
              }
            }
          }
          break;
        default:

      }
    }
    this.setState({
      conflicts: this.conflicts,
      finalAnswers: this.finalAnswers,
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

  saveFinalAnswers(finalAnswers) {
    let numOfConflicsNotSolve = 0;
    _.map((this.state.conflicts), (conflicts) => {
      _.map((conflicts), (conflicts) => {
        if (conflicts.isResolved === false) {
          numOfConflicsNotSolve = numOfConflicsNotSolve + 1;
        }
      })
    });

    if (numOfConflicsNotSolve === 0) {
      update(`answers/${this.props.name}_final`, this.state.finalAnswers);
      window.location.replace(`/#/compare/${this.props.name}/final`);
    } else {
      this.error()
    }
  }

  onChangeAnswer = (value, index, currentCompetencyName) => {
    this.setState({
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
          [index]: {
            ...this.state.conflicts[currentCompetencyName][index],
            isResolved: true
          }
        }
      }
    })
  }


  render() {
    if (this.state.loading) return <Loading />;
    const competenciesName = Object.keys(this.state.conflicts);
    const listConflicts = Object.values(this.state.conflicts);
    const currentCompetencyName = competenciesName[this.state.current];
    const this_is_core_questions = (_.find(this.state.competencies.Kms_core, { name: currentCompetencyName }) == null)? false: true;
    let currentQuestion;
    if(this_is_core_questions) {
      currentQuestion = _.find(this.state.competencies.Kms_core, { name: currentCompetencyName }).questions
    } else{
      currentQuestion = _.find(this.state.competencies.Kms_optional, { name: currentCompetencyName }).questions
    }
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
                      <h3>Question {index}: {currentQuestion[index].desc} ({competenciesName[this.state.current]})</h3>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: 5, marginLeft: 15 }}>
                        <div>
                          <h4>Seft-assessment: </h4> <QuestionInput type={currentQuestion[index].type} value={conflict.selfAssessment} disabled />
                        </div>
                        <div>
                          <h4>Manager assessment: </h4> <QuestionInput type={currentQuestion[index].type} value={conflict.managerAssessment} disabled />
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <h4>Final result</h4> <QuestionInput type={currentQuestion[index].type} options={currentQuestion[index].options} onChange={(value) => this.onChangeAnswer(value, index, currentCompetencyName)}
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
