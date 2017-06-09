import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Layout, Steps, Row, Col, Button, Modal, BackTop } from 'antd';
import QuestionInput from './QuestionInput';
import Loading from './Loading';
import Summary from './Summary'
import { getData, writeAnswers, update } from './firebase';
import logo from './logo.png';
const { Header, Content } = Layout;
const Step = Steps.Step;
const interval = 60000;

function Welcome(props) {
  return (
    <Row type='flex' style={{ flexDirection: 'column' }}>
      <Row type='flex' justify='center' style={{ padding: '10px 0' }}>
        <h2>Welcome {props.name}</h2>
      </Row>
      <Row type='flex' justify='center' style={{ padding: '10px 0' }}>
        <h3>{props.content} </h3>
      </Row>
    </Row>
  );
}
class SelfAssessment extends Component {
  state = {
    current: 0,
    loading: true,
    answers: {}
  }

  isFinalPage = () => window.location.href.indexOf('final') > -1;

  getAnswerPath(props) {
    if (this.isFinalPage()) return `${props.name}_final`;
    return _.isEmpty(props.manager) ? props.name : `${props.name}_manager`;
  }

  componentDidMount() {
    const part = this.getAnswerPath(this.props);
    Promise.all([getData(`answers/${part}`), getData('competencies'), getData('profiles'), getData('project_baseline'), getData('BU_projects'), getData(`summary/${this.props.name}`)])
      .then(([answers, competencies, profiles, project_baseline, BU_projects, summary]) => {
        this.setState({
          answers: answers || {},
          indexProfile: _.findKey(profiles, ['aliasName', this.props.name]),
          customCompetencies: _.find(profiles, ['aliasName', this.props.name]).customCompetencies,
          coreCompetencies: competencies.Kms_core,
          optionalCompetencies: competencies.Kms_optional,
          projectRequiredCompetencies: _.find(project_baseline, {
            'name': _.find(profiles, ['aliasName', this.props.name]).title,
            'projectName': _.find(
              BU_projects, (project) => {
                return _.some(project.members, (memberID) =>
                  _.isEqual(memberID, _.toNumber(_.findKey(profiles, ['aliasName', this.props.name]))))
              }).name
          }).competencies,
          summary: _.last(summary)
        })
        this.getQuestion()
      }
      );
    this.autoSaveInterval = setInterval(() => {
      if (this.state.answers !== this.lastAnswers) {
        this.lastAnswers = this.state.answers;
        writeAnswers(part, this.state.answers);
      }
    }, interval);
  }

  componentWillUnmount() {
    clearInterval(this.autoSaveInterval);
  }

  getQuestion() {
    const questions = _.clone(this.state.coreCompetencies)
    _.forEach(this.state.projectRequiredCompetencies, (value) => {
      questions.push(_.find(this.state.optionalCompetencies, ['name', value.name]))
    })
      _.forEach(this.state.customCompetencies, (value) => {
        questions.push(_.find(this.state.optionalCompetencies, ['name', value]))
      })
    this.setState({
      questions,
      loading: false
    })
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
    this.layout.scrollTop = 0;
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
    this.layout.scrollTop = 0;
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

  saveCustomCompetencyLevels = () => {
    const customCompetenciesResult = _.pick(this.state.answers,this.state.customCompetencies)
    let customLevels
    let i = 0
    _.forEach(customCompetenciesResult,(weights,competenciesName)=>{
      let range = _.sum(weights)
      const currentCompentencyConstraint = _.find(this.state.optionalCompetencies,['name',competenciesName]).constraints
      const level = _.find(currentCompentencyConstraint,(constraint)=>{ 
        return _.inRange(range, constraint.minRange, constraint.maxRange) }).level
      customLevels = {
        ...customLevels,
        [i++] :{
          name: competenciesName,
          proficiency: level
        }
      }
    })
    update(`profiles/${this.state.indexProfile}/competencies/custom`,customLevels)
  }

  onDone = () => {
    const part = _.isEmpty(this.props.manager) ? this.props.name : `${this.props.name}_manager`;
    this.setState({
      saving: true
    });
    //this.saveCustomCompetencyLevels()
    writeAnswers(part, this.state.answers).then(() => window.location.replace('/careercoacher/#/finish'));
  }

  onChangeQuestionInput = (value, competenciesName, index) => {
    value = value? 4 :_.isBoolean(value)? 0 : value
    this.setState({
      answers: {
        ...this.state.answers,
        [competenciesName]: {
          ...(this.state.answers[competenciesName] || {}),
          [index]: value
        }
      }
    })
  }

  render() {
    if (this.state.loading) return <Loading />;
    const questions = this.state.questions;
    const currentCompentency = questions[this.state.current];
    return (
      <div>
        -        <BackTop />
        <Layout style={{ height: '100%' }}>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Row type='flex' justify='space-between' style={{ height: '100%' }}>
              <Col span={4}>
                <img alt='logo' src={logo} style={{ height: 64, padding: 10 }} />
              </Col>
            </Row>
          </Header>
          <Layout ref={(ref) => this.layout = ReactDOM.findDOMNode(ref)}>
            <Content style={{ margin: 16, background: '#fff', padding: '0 20px' }}>
              {
                !this.isFinalPage() ?
                  _.isEmpty(this.props.manager) ?
                    <Welcome name={this.props.name} content="Please answer questions below for your self-assement" />
                    :
                    <Welcome name={this.props.manager} content={`Please answer questions below for ${this.props.name}'s assement`} />
                  :
                  <Welcome name='' content={`This is final assessment of ${this.props.name}`} />
              }
              <Row style={{ padding: '20px 0' }} type='flex'>
                <Steps current={this.state.current}>
                  {_.map(questions, (question) =>
                    <Step title={question.name} />
                  )}
                </Steps>
              </Row>
              {
                this.isFinalPage() ?
                  <Row type='flex' justify='center' style={{ padding: '10px 0' }}>
                    <Summary data={this.state.summary[currentCompentency.name]} />
                  </Row>
                  :
                  null
              }
              <div className='steps-content'>

                <Row type='flex'>
                  {
                    _.map(currentCompentency.questions, (question, index) =>
                      <Col span={12} className='question-content'>
                        <h3>Question {index + 1}: <span style={{ whiteSpace: 'pre-wrap' }}>{question.desc}</span> {!_.isEmpty(question.hint) ? <Button shape="circle" icon="question" size="small" onClick={() => this.openHint(question.hint)} /> : null}</h3>
                        <div style={{ width: '100%' }}>
                          {
                            !this.isFinalPage() ?
                              <QuestionInput {...question} onChange={(value) => this.onChangeQuestionInput(value, currentCompentency.name, index) }
                                value={_.get(this.state.answers, `${currentCompentency.name}.${index}`)}
                              />
                              :
                              <QuestionInput {...question} disabled
                                value={_.get(this.state.answers, `${currentCompentency.name}.${index}`)}
                              />
                          }
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
                  !this.isFinalPage() && this.state.current === questions.length - 1
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
              <p style={{ fontSize: 14 }}>{this.state.hint}</p> :
              _.map(this.state.hint, (hint, language) =>
                <p style={{ fontSize: 14 }}>{getLanguage(language)}: {hint}</p>
              )
            }

          </Modal>
        </Layout>
      </div >
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
