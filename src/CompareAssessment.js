import React, { Component } from 'react'
import _ from 'lodash'
import { Layout, Steps, Row, Col, Button, message, BackTop } from 'antd'
import QuestionInput from './QuestionInput'
import { getData, writeAnswers, update, getLastIndex } from './firebase'
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
    Promise.all([getData('competencies'), getData(`answers/${this.props.name}`), 
      getData(`answers/${this.props.name}_manager`), getData('profiles'), 
      getData('project_baseline'), getData('baseline'), getData('BU_projects')])
      .then(([competencies, selfAnswers, managerAnswers, profiles, projectBaseline, baseline, BU_projects]) => {
        this.setState({
          loading: false,
          competencies,
          conflicts: this.getConflictsView(selfAnswers, managerAnswers),
          finalAnswers: managerAnswers,
          profile: _.find(profiles, ['aliasName', this.props.name]),
          indexProfile: _.findKey(profiles, ['aliasName', this.props.name]),
          coreBaseline: _.map(baseline, 'Kms_core'),
          projectRequired: _.filter(projectBaseline, ['projectName', _.find(BU_projects, (project) => 
          { 
            return _.some(project.members, (memberID) => 
              _.isEqual(memberID, _.toNumber(_.findKey(profiles, ['aliasName', this.props.name])))) 
          }).name])
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


  next(competenciesName, level) {
    const current = this.state.current + 1
    this.setState({
      current,
      levels: {
        ...this.state.levels,
        [this.state.current]:
        {
          name: competenciesName,
          proficiency: level
        }
      }
    })
  }
  prev(competenciesName, level) {
    const current = this.state.current - 1
    this.setState({
      current,
      levels: {
        ...this.state.levels,
        [this.state.current]:
        {
          name: competenciesName,
          proficiency: level
        }
      }
    })
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

  isMatchBaseline = (baselines) => {
    let isMatch = true
    _.forEach(baselines, (value) => {
      _.gte(_.toNumber(_.find(this.state.levels, ['name', value.name]).proficiency), _.toNumber(value.proficiency)) ?
        null
        :
        isMatch = false
    })
    return isMatch
  }

  findNewTitle() {
    let title = 'SE'
    let baseline
    _.forEach(this.state.projectRequired, (value, key) => {
      let competencies
      _.isUndefined(value) ? null :
        competencies = _.concat(value.competencies, this.state.coreBaseline[value.coreId].competencies)
      baseline = {
        ...baseline,
        [key]: {
          competencies,
          title: value.name
        }
      }
    })
    _.forEach(baseline, (value) =>
      this.isMatchBaseline(value.competencies) ?
        title = value.title
        :
        null
    )
    return title
  }

  saveConfiguratedCompetencies=()=>{
    update(`profiles/${this.state.indexProfile}/configuratedCompetencies`,
      _.map(_.concat(_.map(this.state.levels),this.state.profile.competencies.custom),'name')
    )
  }

  saveProficiencies = () => {
    if(!_.isUndefined(this.state.profile.competencies)) {
      update(`profiles/${this.state.indexProfile}/preCompetencies`, this.state.profile.competencies)
    }  
    update(`profiles/${this.state.indexProfile}/competencies/required`, this.state.levels)
    update(`profiles/${this.state.indexProfile}/title`, this.findNewTitle())
    this.saveConfiguratedCompetencies()
    this.saveHistory()
  }

  saveSummary = (lastIndex) => {
    let newIndex = _.toNumber(lastIndex) + 1
    update(`summary/${this.props.name}/${newIndex}`, this.underWeightsState)
    window.location.replace(`/#/compare/${this.props.name}/final`)
  }

  createChangeLog(lastIndex) {
    const currentTitle = this.findNewTitle()
    const lastTitle = this.state.profile.title
    let promotion
    switch (currentTitle) {
      case 'SE':
        if (_.isEqual(lastTitle, 'SSE') || _.isEqual(lastTitle, 'SA')) {
          promotion = 'Demote to SE'
        }
        break;
      case 'SSE':
        if (_.isEqual(lastTitle, 'SE')) {
          promotion = 'Promote to SEE'
        }
        if (_.isEqual(lastTitle, 'SA')) {
          promotion = 'Demote to SEE'
        }
        break;
      case 'SA':
        if (_.isEqual(lastTitle, 'SSE') || _.isEqual(lastTitle, 'SE')) {
          promotion = 'Promote to SA'
        }
        break;
      default:
    }
    let history
    let i = 0
    _.lt(lastIndex, 0) ?
      _.map(this.state.levels, (competency) =>
        history = {
          ...history,
          [i++]: `${competency.name} proficiency started at level ${competency.proficiency}`
        }
      )
      :
      _.map(this.state.levels, (competency) =>
        _.isEqual(competency.proficiency, _.find(this.state.profile.competencies.required, ['name', competency.name]).proficiency) ?
          history = {
            ...history,
            [i++]: `${competency.name} proficiency remain at level ${competency.proficiency}`
          }
          :
          _.lt(competency.proficiency, _.find(this.state.profile.competencies.required, ['name', competency.name]).proficiency) ?
            history = {
              ...history,
              [i++]: `Decreasing ${competency.name} proficiency to level ${competency.proficiency}`
            }
            :
            history = {
              ...history,
              [i++]: `Increasing ${competency.name} proficiency to level ${competency.proficiency}`
            }
      )
    if (_.isString(promotion)) {
      history = {
        ...history,
        [i++]: promotion
      }
    }
    return history
  }

  saveHistory = () => {
    getLastIndex(`profiles/${this.state.indexProfile}/historical`).then((lastIndex) => {
      let changelog = this.createChangeLog(lastIndex)
      let newIndex = _.toNumber(lastIndex) + 1
      let history = {
        changelog,
        time: new Date(_.now()).toLocaleDateString()
      }
      update(`profiles/${this.state.indexProfile}/historical/${newIndex}`, history)
    })
  }

  saveFinalAnswers(competenciesName, level) {
    this.setState({
      levels: {
        ...this.state.levels,
        [this.state.current]:
        {
          name: competenciesName,
          proficiency: level
        }
      }
    }, () => this.saveProficiencies())

    writeAnswers(`${this.props.name}_final`, this.state.finalAnswers)
    getLastIndex(`summary/${this.props.name}`).then((lastIndex) => this.saveSummary(lastIndex))

  }

  getUnderWeight = (weights, answers, competenciesName) => {
    let underWeights
    _.map(answers, (answer, index) =>
      _.lt(answer, weights[index]) ?
        underWeights = {
          ...underWeights,
          [index]: {
            weight: weights[index],
            under: answer
          }
        }
        :
        null
    )
    _.isUndefined(underWeights) ? null
      :
      this.underWeightsState = {
        ...this.underWeightsState,
        [competenciesName]: underWeights
      }
  }

  onChangeAnswer = (value, index, currentCompetencyName) => {
    let newFinalAnswers = this.state.finalAnswers
    newFinalAnswers[currentCompetencyName][index] = value
    this.setState({ finalAnswers: newFinalAnswers })
  }

  getValueByQuestion = (question, value) =>
    question.options ? question.options[value - 1] : value

  filterUndifinedObjects = (objects) =>
    _.filter(objects, (o) => { return _.isObject(o) })

  getCurrentConstraintByRange = (range, competenciesName, isCore) =>
    isCore ?
      _.filter(this.filterUndifinedObjects(_.find(this.state.competencies.Kms_core, { name: competenciesName }).constraints), (constraint) =>
      { return _.inRange(range, constraint.minRange, constraint.maxRange) })[0]
      :
      _.filter(this.filterUndifinedObjects(_.find(this.state.competencies.Kms_optional, { name: competenciesName }).constraints), (constraint) =>
      { return _.inRange(range, constraint.minRange, constraint.maxRange) })[0]

  render() {

    if (this.state.loading) return <Loading />
    const competenciesName = Object.keys(this.state.conflicts)
    const listConflicts = Object.values(this.state.conflicts)
    const currentCompetencyName = competenciesName[this.state.current]
    const isCore = _.some(this.state.competencies.Kms_core, ['name', currentCompetencyName])
    let currentQuestion
    let currentRange = _.sum(_.get(this.state.finalAnswers, [currentCompetencyName]))
    let currentConstrain = this.getCurrentConstraintByRange(currentRange, currentCompetencyName, isCore)
    this.getUnderWeight(currentConstrain.weight, this.state.finalAnswers[currentCompetencyName], currentCompetencyName)
    isCore ?
      currentQuestion = _.find(this.state.competencies.Kms_core, { name: currentCompetencyName }).questions
      :
      currentQuestion = _.find(this.state.competencies.Kms_optional, { name: currentCompetencyName }).questions

    return (
      <div>
        <BackTop />
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
                <h3>Your {currentCompetencyName} is in level {currentConstrain.level}</h3>
              </Row>
              <Row>
                <strong style={{ color: '#d73435' }}>*The highlighted questions mean that you are not meet the requirement of this level </strong>
              </Row>
              <div className='steps-content'>
                <Row type='flex'>
                  {
                    _.map(listConflicts[this.state.current], (conflict, index) =>
                      _.isEqual(currentQuestion[index].type, 'freetext') ?
                        null
                        :
                        <Col span={12} className='question-content'>
                          {_.lt(_.get(this.state.finalAnswers, `${currentCompetencyName}.${index}`), currentConstrain.weight[index]) ?
                            <h3 style={{ background: '#fffaad' }}>Question {_.toNumber(index) + 1}: {currentQuestion[index].desc} ({competenciesName[this.state.current]})</h3>
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
                    onClick={() => this.prev(currentCompetencyName, currentConstrain.level)}
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
                    onClick={() => this.next(currentCompetencyName, currentConstrain.level)}
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
                    onClick={() => this.saveFinalAnswers(currentCompetencyName, currentConstrain.level)}
                  >
                    Resolve
                </Button>
                }
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default CompareAssessment
