import React, {Component} from 'react';
import { Timeline, Select, Row, Col, Card, Tag } from 'antd';
import _ from 'lodash';
//import CompentencyRadar from './CompentencyRadar';
import CompentencyConfig from './CompentencyConfig';
import Loading from './Loading';

import {getData, update} from './firebase';

const Option = Select.Option;

const compentencies = [
  'Programming Language',
  'Source Control',
  'Web back-end',
  'Web front-end',
  'Mobile',
  'Desktop',
  'Database',
  'Enterprise',
  'Cloud',
  'DevOps',
  'Test',
  'Report',
  'ETL',
  'Big Data',
  'Effective Communication',
  'Customer Focus',
  'Achievement Orientation',
  'Developing Others',
  'Self Development'
]

const getSelectedCompentencies = (profile) => {
  const configuratedCompentencies = profile.configuratedCompentencies;
  if (!_.isEmpty(configuratedCompentencies)) return configuratedCompentencies;
  const nonEmptyCompentencies = _.reduce(profile.compentencies, (result, proficiency, compentency) => {
    if (proficiency > 0) result.push(compentency);
    return result;
  }, []);
  return nonEmptyCompentencies;
}

export default class ProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      compareAgain: 'Previous PA',
      loading: true
    }
  }

  componentDidMount() {
    this.getProfileDataToState(this.props.profile);
  }

  componentWillReceiveProps(props) {
    if(props.profile !== this.props.profile) {
      this.getProfileDataToState(props.profile);
    }
  }

  getProfileDataToState = (profile) =>  {
    this.setState({
      loading: true
    });
    getData(`profiles/${profile}`)
    .then((profileData) => this.setState({
      profile: profileData,
      loading: false
    }));
  }

  render() {
    if (this.state.loading) return <div style={{height: 600}}><Loading /> </div>;
    const profile = this.state.profile;
    //const radarData = [this.getBaseLineData(this.state.compareAgain), profile];
    const selectedCompentencies = getSelectedCompentencies(profile);
    return (
      <Row type="flex" style={{padding: '20px 10px 10px'}}>
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
              <Option value="Previous PA">Compare with previous PA</Option>
              <Option value="Next Level">Compare with next level</Option>
            </Select>
          </Row>
          <Row type="flex" justify="center">

          </Row>
        </Col>
        <Col span={9} offset={1}>
          <Row type='flex' justify='end'>
            <CompentencyConfig
              compentencies={compentencies}
              selectedCompentencies={selectedCompentencies}
              removeCompentency={this.removeCompentency}
              addCompentency={this.addCompentency}
            />
          </Row>
          <Row style={{paddingTop: 10}}>
            <Card title={`${profile.name} - ${profile.title}`} style={{fontSize: 14}}>
              <div style={{padding: '10px 0'}}>
                <span style={{fontWeight: 800, paddingRight: 10}}>Summary: </span>
                <span>{profile.summary}</span>
              </div>
              <div>
                <span style={{fontWeight: 800, paddingRight: 10}}>Skills: </span>
                <span>
                  {_.map(profile.skills, (skill) =>
                    <Tag>{skill}</Tag>
                  )}
                </span>
              </div>
            </Card>
          </Row>
          <Row style={{paddingTop: 10}}>
            <Card title='Compentency historical'>
              <Timeline pending={<a href="#">See more</a>}>
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

  comparationOnChange = (comparation) => this.setState({compareAgain: comparation})

  getBaseLineData = (baselineName) => _.find(this.props.baseline, (baseline) => baseline.name === baselineName)

  removeCompentency = (compentency) => {
    const targetProfile = this.state.profile;
    const configuratedCompentencies = _.filter(getSelectedCompentencies(targetProfile), (value) => compentency !== value);
    this.setState({
      profile: {
        ...targetProfile,
        configuratedCompentencies
      }
    });
    this.updateConfiguratedCompentencies(configuratedCompentencies);
  }
  addCompentency = (compentency) => {
    const targetProfile = this.state.profile;
    const configuratedCompentencies = _.concat(getSelectedCompentencies(targetProfile), compentency);
    this.setState({
      profile: {
        ...targetProfile,
        configuratedCompentencies
      }
    });
    this.updateConfiguratedCompentencies(configuratedCompentencies);
  }
  updateConfiguratedCompentencies = (configuratedCompentencies) => {
    update(`/profiles/${this.props.profile}/configuratedCompentencies`, configuratedCompentencies)
  }
};
