import React, {Component} from 'react';
import _ from 'lodash';
import { Layout, Menu, Icon, Row, Col, Button } from 'antd';
import ProfilePage from './ProfilePage';
import Loading from './Loading';
import './App.css';
import logo from './logo.png';
import {getData} from './firebase';

const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      mode: 'inline',
      loading: true
    };
  }
  componentDidMount() {
    Promise.all([getData('baseline'), getData('profileList')]).then(([baseline, profileList]) =>
      this.setState({
        baseline,
        profileList,
        selectedProfile: _.first(profileList),
        loading: false
      })
    );
  }
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }
  onSelectProfile = (e) => {
    this.setState({
      selectedProfile: e.key,
    });
  }
  render() {
    if (this.state.loading) return <Loading />;
    return (
      <Layout style={{height: '100%'}}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{height: '100%'}}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{height: 64, padding: 10}}/>
            </Col>
            <Col style={{paddingRight: 20}}>
              <Button type='primary' style={{height: 40, fontSize: 14}}>Add new profile</Button>
            </Col>
          </Row>
        </Header>
        <Layout>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Menu theme="dark"
              mode={this.state.mode}
              onClick={this.onSelectProfile}
              selectedKeys={[this.state.selectedProfile]}
            >
              <SubMenu
                key="sub1"
                title={<span><Icon type="user" /><span className="nav-text">Members</span></span>}
              >
                {
                  _.map(this.state.profileList, (profile) => <Menu.Item key={profile}>{profile}</Menu.Item>)
                }
              </SubMenu>
              <Menu.Item key='Report'>
                <span>
                  <Icon type="area-chart" />
                  <span className="nav-text">Report</span>
                </span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ margin: '0 16px' }}>
              <ProfilePage
                baseline={this.state.baseline}
                profile={this.state.selectedProfile}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default MainPage;
