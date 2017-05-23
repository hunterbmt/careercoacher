import React, { Component } from 'react'
import _ from 'lodash'
import { Layout, Steps, Row, Col, Button, message } from 'antd'
import QuestionInput from './QuestionInput'
import { getData, writeAnswers } from './firebase'
import logo from './logo.png'
import Loading from './Loading'
const { Header, Content } = Layout
const Step = Steps.Step


class CompareAssessment extends Component {
  state = {
    conflicts: {},
    loading: true,
    finalAnswers: {},
    current: 0
  }

  error = () => {
    message.error('You need to resolve all conflicts')
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    Promise.all([getData('/competencies'), getData(`answers/${this.props.name}`), getData(`answers/${this.props.name}_manager`)])
      .then(([competencies, selfAnswers, managerAnswers]) => {
        this.setState({
          loading: false,
          competencies,
          conflicts: this.getConflictsView(selfAnswers, managerAnswers),
          finalAnswers: managerAnswers
        })
      })
  }
  getConflictsView = (selfAnswers, managerAnswers) => {
    const conflicts = _.mergeWith(selfAnswers, managerAnswers, (selfAnswer, managerAnswer) =>
      _.map(selfAnswer, (answer, index) => [answer, managerAnswer[index]])
    )
    return _.omitBy(
      _.mapValues(conflicts, (answers) => _.omitBy(answers, (answer) => answer[0] === answer[1]))
    , _.isEmpty)
  }


  next() {
    const current = this.state.current + 1
    this.setState({ current })
  }
  prev() {
    const current = this.state.current - 1
    this.setState({ current })
  }
  openHint(hint) {
    this.setState({
      visible: true,
      hint
    })
  }
  closeHint = () => {
    this.setState({
      visible: false
    })
  }

  saveFinalAnswers(finalAnswers) {
    writeAnswers(`${this.props.name}_final`, this.state.finalAnswers)
    window.location.replace(`/#/compare/${this.props.name}/final`)
  }

  onChangeAnswer = (value, index, currentCompetencyName) => {
    this.state.finalAnswers[currentCompetencyName][index] = value
    this.setState({finalAnswers:this.state.finalAnswers})
  }

  getValueByQuestion = (question, value) =>
    question.options ? question.options[value - 1] : value

  getCurrentConstraintByRange = (range, competenciesName,isCore) =>
      isCore?
      _.filter(_.find(this.state.competencies.Kms_core, { name: competenciesName }).constraints, (constraint) => { return _.inRange(range, constraint.minRange, constraint.maxRange)})[0]
      :
      _.filter(_.find(this.state.competencies.Kms_optional, { name: competenciesName }).constraints, (constraint) =>{ return _.inRange(range, constraint.minRange, constraint.maxRange)})[0]
  

  render() {
    if (this.state.loading) return <Loading />
    const competenciesName = Object.keys(this.state.conflicts)
    const listConflicts = Object.values(this.state.conflicts)
    const currentCompetencyName = competenciesName[this.state.current]
    const this_is_core_questions = (_.find(this.state.competencies.Kms_core, { name: currentCompetencyName }) == null)? false: true
    let currentQuestion
    let currentRange = _.sum(_.get(this.state.finalAnswers,[currentCompetencyName]))
    let currentConstrain = this.getCurrentConstraintByRange(currentRange, currentCompetencyName, this_is_core_questions)
    //console.log(currentConstrain)
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
            <Row style={{ padding: '20px 0' }} type='flex'>
              <h3>Your {currentCompetencyName} is in range {currentRange}, this range is in {currentConstrain.title}</h3>
            </Row>
            <div className='steps-content'>
              <Row type='flex'>
                {
                  _.map(listConflicts[this.state.current], (conflict, index) =>
                  _.isEqual(currentQuestion[index].type,'freetext')?
                    null
                    :
                    <Col span={12} className='question-content'>
                      {_.inRange(_.get(this.state.finalAnswers, `${currentCompetencyName}.${index}`),currentConstrain.weight[index])?
                        <h3 style={{background:'#fffaad'}}>Question {_.toNumber(index) + 1}: {currentQuestion[index].desc} ({competenciesName[this.state.current]})</h3>
                        :
                        <h3>Question {_.toNumber(index) + 1}: {currentQuestion[index].desc} ({competenciesName[this.state.current]})</h3>
                      }
                      
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: 5, marginLeft: 15 }}>
                        <div>
                          <h4>Seft-assessment: </h4> <QuestionInput
                            type={currentQuestion[index].type}
                            value={this.getValueByQuestion(currentQuestion[index], conflict[0])}
                            disabled />
                        </div>
                        <div>
                          <h4>Manager assessment: </h4> <QuestionInput
                            type={currentQuestion[index].type}
                            value={this.getValueByQuestion(currentQuestion[index], conflict[1])}
                            disabled />
                        </div>
                      </div>
                      <div style={{ marginTop: 10}}>
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
    )
  }
}

export default CompareAssessment
