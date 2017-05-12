import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu, Icon, Row, Col, Button, Modal, Input, Card, Table } from 'antd';
import ProfilePage from './ProfilePage';
import Loading from './Loading';
import './App.css';
import logo from './logo.png';
import { getData, update, insert, getNewIndex } from './firebase';
const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class RoleProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      mode: 'inline',
      loading: true
    };
  }

  componentDidMount() {
    Promise.all([getData('baseline/0/name'), getData('baseline/0/competencies')]).then(([baseline, competencyList]) =>
      this.setState({
        baseline,
        competencyList,
        selectedProfile: _.first(competencyList),
        loading: false
      })
    );
    console.log(Object.keys(this.state.competencyList));
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

  create() {
    // A post entry.
    var data = {
      'competencies': {
        '0': 'Coding',
        '1': 'Version Control'
      },
      'baseline': {
        '0': '0',
        '1': '1'
      }
    }
    insert(`roleProfile`, data);
  }

  render() {
    if (this.state.loading) return <Loading />;
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{ height: 64, padding: 10 }} />
            </Col>
            <Col style={{ paddingRight: 20 }}>
              <AddNewProfilePopup />
            </Col>
          </Row>
        </Header>
        <Layout>

          <Layout>
            <Content style={{ margin: '0 16px' }}>
              <Card title='Role Profile' style={{ width: '34%' }}>
                <h1>Baseline :</h1>
                <p>{this.state.baseline}</p>
                <h1>Competencies Required:</h1>
                {_.map(this.state.competencyList, (item, index) => 
                  <div>
                  <a>{index}</a> : <a>{item}</a>
                  </div>
                )}
              </Card>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

class AddNewProfilePopup extends Component {
  state = {
    loading: false,
    visible: false,
    newBaseline : '',
    newCompetency: ''
  }

  handleBaselineChange = (e) => {
    this.setState({
      newBaseline : e.target.value
    });
    console.log("changed baseline to " + this.state.newBaseline);
  }

  handleCompetencyChange = (e) => {
    this.setState({
      newCompetency : e.target.value
    });
    console.log("changed competency to " + this.state.newCompetency);
  }

  saveBaseline() {
    var data = {
      '1' : this.state.newBaseline
    }
    insert('roleProfile/baseline', data);
  }

  saveCompetency() {
    var data = {
      '1' : this.state.newCompetency
    }
    insert('roleProfile/competencies', data);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  
  handleOk = () => {
    this.setState({ loading: true });
    this.saveBaseline();
    this.saveCompetency();
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  render() {
    return (
      <div>
        <Button type="primary" size="large" onClick={this.showModal}>
          Add New Role Profile
        </Button>
        <Modal
          visible={this.state.visible}
          title="Add New Group"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>Return</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
              Submit
            </Button>
          ]}
        >
          <p>Baseline: </p>
          <Input placeholder="Baseline...." value={this.state.newBaseline} onChange={this.handleBaselineChange.bind(this)} />
          <p>Competency: </p>
          <Input placeholder="Competency...." value={this.state.newCompetency} onChange={this.handleCompetencyChange.bind(this)} />
        </Modal>
      </div>
    );
  }
}

export default RoleProfile;
