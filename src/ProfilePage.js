import React, { Component } from 'react';
import { Timeline, Select, Row, Col, Card, Tag, Button } from 'antd';
import _ from 'lodash';
import CompetencyRadar from './CompetencyRadar';
import CompentencyConfig from './CompentencyConfig';
import Loading from './Loading';
import CreateCustomCompetencyPersonalProfile from './CreateCustomCompetencyPersonalProfile'

import { getData, update } from './firebase';

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

  // saveCustomCompetncy = (customCompetency) =>{
  //   update(`profiles/`)
  // }

  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.saveCustomCompetncy(values.customCompetency)
      form.resetFields();
      this.setState({ visible: false });
    });
  }


  componentWillMount() {
    Promise.all([getData(`profiles/${this.props.id}/competencies`), getData(`profiles/${this.props.id}`),
    getData(`profiles/${this.props.id}/competencies/required`), getData(`competencies/Kms_optional`)])
      .then(([personalCompetencies, personalProfile, required, kmsOptional]) =>
        this.setState({
          competencies: Object.keys(personalCompetencies),
          profile: personalProfile,
          customCompetencies: _.difference(_.map((_.filter(kmsOptional, ['activated', true])), 'name'), _.map(required, 'name')),
          loading: false
        }))
  }

  render() {
    if (this.state.loading) return <div style={{ height: 600 }}><Loading /> </div>;
    const profile = this.state.profile;
    const radarData = [this.props.previousCompetencies, this.props.presentCompetencies];
    const selectedCompetencies = getSelectedCompetencies(profile);
    const optionalCompetency = _.map(this.state.customCompetencies, (item) => (
      <Option value={item}>{item}</Option>
    ))
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
              <Button icon="file-add" shape="circle" style={{ width: 40, height: 40, fontSize: 20 }} onClick={this.showModal}></Button>
              <CreateCustomCompetencyPersonalProfile
                ref={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
                optionalCompetency={optionalCompetency}
                onChangeOption={this.onChangeOption}
              />
            </Col>
            <Col span={6} offset={6}><CompentencyConfig
              compentencies={this.state.competencies}
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
};
