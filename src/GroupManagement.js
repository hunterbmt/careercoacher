import React, {Component} from 'react';
import _ from 'lodash';
import { Layout, Row, Col, Button, Card, Tag} from 'antd';
import QuestionInput from './QuestionInput';
import logo from './logo.png';
import CompentencyConfig from './CompentencyConfig';
import Loading from './Loading';
import {getData, update} from './firebase';
import ProfilePage from './ProfilePage';

const { Header, Content } = Layout;

export default class GroupManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading : true,
      members : ["default member 1", "default member 2"]
    };

  }

  componentDidMount() {
    this.getGroupDataToState(this.props.project);

    Promise.all([getData('baseline'), getData('profileList')]).then(([baseline, profileList]) =>
      this.setState({
        baseline,
        profileList,
        selectedProfile: _.first(profileList)
      })
    );
  }

  componentWillReceiveProps(props) {
    if(props.project !== this.props.project) {
      this.getGroupDataToState(props.project);
    }
  }

  onSelectProfile = (e) => {
    this.setState({
      selectedProfile: e
    });
  }

  componentWillMount() {}

  componentWillUnmount() {}

  getGroupDataToState = (project) =>  {
    this.setState({
      loading: true
    });
    getData(`BU_projects/${project}`)
    .then((projectData) => this.setState({
      projectName: project,
      members: projectData.members,
      manager: projectData.manager,
      loading: false
    }));
  }

  render() {
    if (this.state.loading) return <div style={{height: 600}}><Loading /> </div>;
    return (
      <div>
        <Layout>
        <Content style={{ margin: '0 16px' }}>
        <Card title={this.state.projectName} style={{ width: '34%' }}>
        <h3>Manager : <Tag color="#108ee9">{this.state.manager}</Tag></h3>
        <h3>Members :</h3>
          {_.map(this.state.members, (member, index) =>
            <div>
              <Tag onClick={() => this.onSelectProfile(member)}  key={member}>{member}</Tag>
            </div>
          )}
        </Card>
        <Card>
        <ProfilePage
          baseline={this.state.baseline}
          profile={this.state.selectedProfile}
        />
        </Card>
        </Content>
        </Layout>
      </div>
    );
  }
}
