import React, { Component } from 'react';
import { Timeline, Select, Row, Col, Card, Tag, message } from 'antd';
import _ from 'lodash';
import CompetencyRadar from './CompetencyRadar';
import CompentencyConfig from './CompentencyConfig';
import Loading from './Loading';

import { getData, update,getLastIndex } from './firebase';

const Option = Select.Option;


const getSelectedCompetencies = (profile) => {
  const configuratedCompetencies = profile.configuratedCompetencies;
  if (!_.isEmpty(configuratedCompetencies)) return configuratedCompetencies;
  const nonEmptyCompetencies = _.reduce(profile.compentecies, (result, proficiency, competency) => {
    if (proficiency > 0) result.push(competency);
    return result;
  }, []);
  return nonEmptyCompetencies;
}

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compareAgain: 'Previous Assessment',
      visible: false,
      loading: true
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  getLastIndexCustomCompetency = (customCompetency) =>{
    getLastIndex(`profiles/${this.props.id}/pendding`).then((lastId) => this.saveCustomCompetency(lastId,customCompetency))
  }

  saveCustomCompetency = (lastId,customCompetencies) =>{
    let index = _.toNumber(lastId) + 1
    update(`profiles/${this.props.id}/pendding/${index}`,customCompetencies)
    message.success('save custom competency successfully',3)
  }

  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.getLastIndexCustomCompetency(values.customCompetency)
      form.resetFields();
      this.setState({ visible: false });
    });
  }


  componentWillMount() {
    Promise.all([getData(`profiles/${this.props.id}`),getData(`profiles/${this.props.id}/competencies/required`), getData(`competencies/Kms_optional`),getData(`profiles/${this.props.id}/competencies/custom`)])
      .then(([personalProfile, required, kmsOptional,custom]) =>
        this.setState({
          profile: personalProfile,
          customCompetencies: _.difference(_.map((_.filter(kmsOptional, ['activated', true])), 'name'), _.map(_.concat(required,custom), 'name')),
          loading: false
        }))
  }

  render() {
    if (this.state.loading) return <div style={{ height: 600 }}><Loading /> </div>;
    const profile = this.state.profile;
    const radarData = [this.props.previousCompetencies, this.props.currentCompetencies];
    const selectedCompetencies = getSelectedCompetencies(profile);
   
    return (
      <Row type="flex" style={{ padding: '20px 10px 10px' }}>
        <Col span={14}>
          <Row>
            <Select
              showSearch
              size="large"
              style={{ width: 200 }}
              defaultValue={this.state.compareAgain}
              placeholder="Select a comparation"
              optionFilterProp="children"
              onChange={this.comparationOnChange}
              filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="AVG SE">Compare with avg SE</Option>
              <Option value="AVG SSE">Compare with avg SSE</Option>
              <Option value="AVG SA">Compare with avg SA</Option>
              <Option value="Previous Assessment">Compare with previous assessment</Option>
              <Option value="Next Level">Compare with next level</Option>
            </Select>
          </Row>
          <Row type="flex" justify="center">
            <CompetencyRadar
              data={radarData}
              competencies={selectedCompetencies}
            />
          </Row>
        </Col>
        <Col span={9} offset={1}>
          <Row type='flex' justify='end'>
            <Col span={6} offset={6}>
            </Col>
            <Col span={6} offset={6}><CompentencyConfig
              compentencies={_.map(this.props.currentCompetencies, (item) => item.name)}
              selectedCompentencies={selectedCompetencies}
              removeCompentency={this.removeCompentency}
              addCompentency={this.addCompentency}
            /></Col>
          </Row>
          <Row style={{ paddingTop: 10 }}>
            <Card title={`${profile.name} - ${profile.title}`} style={{ fontSize: 14 }}>
              <div style={{ padding: '10px 0' }}>
                <span style={{ fontWeight: 800, paddingRight: 10 }}>Summary: </span>
                <span>{profile.summary}</span>
              </div>
              <div>
                <span style={{ fontWeight: 800, paddingRight: 10 }}>Skills: </span>
                <span>
                  {_.map(profile.skills, (skill) =>
                    <Tag>{skill}</Tag>
                  )}
                </span>
              </div>
            </Card>
          </Row>
          <Row style={{ paddingTop: 10 }}>
            <Card title='Compentency historical'>
              <Timeline pending={<a href="#">See more...</a>}>
                {_.map(profile.historical, (historical) =>
                  <Timeline.Item color="green">
                    <p>{historical.time}</p>
                    {_.map(historical.changelog, (change) => <p>{change}</p>)}
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>
          </Row>
        </Col>
      </Row>
    )
  }

  comparationOnChange = (comparation) => this.setState({ compareAgain: comparation })

  removeCompentency = (compentency) => {
    const targetProfile = this.state.profile;
    const configuratedCompetencies = _.filter(getSelectedCompetencies(targetProfile), (value) => compentency !== value);
    this.setState({
      profile: {
        ...targetProfile,
        configuratedCompetencies
      }
    });
    this.updateConfiguratedCompetencies(configuratedCompetencies);
  }
  addCompentency = (compentency) => {
    const targetProfile = this.state.profile;
    const configuratedCompetencies = _.concat(getSelectedCompetencies(targetProfile), compentency);
    this.setState({
      profile: {
        ...targetProfile,
        configuratedCompetencies
      }
    });
    this.updateConfiguratedCompetencies(configuratedCompetencies);
  }

  updateConfiguratedCompetencies = (configuratedCompetencies) => {
    update(`/profiles/${this.props.id}/configuratedCompetencies`, configuratedCompetencies)
  }
}