import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu, Icon, Row, Col, Button, Modal, Input, Card, Table, Select } from 'antd';
import ProfilePage from './ProfilePage';
import CurrentBaseline from './CurrentBaseline';
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
      loading: true,

      filterDropdownVisible: false,
     
      selectedBaseline : 0,

      baselineListDataSource : [],
    
      baselineListColumns : [{
        title: 'No',
        dataIndex: 'no',
        key: 'no',
      }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      }, { 
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => this.onSelectBaseline(record.no)} key={record.name}>Edit 一 {record.name}</a>
            <span className="ant-divider" />
            <a>Delete</a>
            <span className="ant-divider" />
            <a className="ant-dropdown-link">
              More actions <Icon type="down" />
            </a>
          </span>
        ),
      }]
    };
  }
  
  componentDidMount() {
    Promise.all([getData('baseline')]).then(([baselineList]) =>
      this.setState({
        baselineList,
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

  onSelectBaseline = (e) => {
    console.log(e);
    this.setState({
      baselineList : [],
      selectedBaseline : e,
      loading : false
    })
  }

  render() {
    if (this.state.loading) return <Loading />;
    
    _.map(this.state.baselineList, (item, index) => {
      var object = {
        key: index,
        no: index,
        name: item.name
      };
      this.state.baselineListDataSource.push(object);
    })
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
          
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
          <Col span={8}>
          <Layout>
            <Content style={{ margin: '0 16px' }}>
              <Card title='All Role Profiles' style={{ width: '100%' }}>
                
                <Table dataSource={this.state.baselineListDataSource} columns={this.state.baselineListColumns} />
              </Card>
            </Content>
          </Layout>
          </Col>

          <Col span={16}>
            <CurrentBaseline selectedBaseline={this.state.selectedBaseline} />
          </Col>
        </Row>

        </Layout>
      </Layout>
    );
  }
}

class AddNewProfilePopup extends Component {
  state = {
    loading: false,
    visible: false,
    newBaseline: '',
    newCompetency: '',
    baselineList : []
  }

  componentDidMount() {
    Promise.all([getData('baseline')]).then(([baselineList]) =>
      this.setState({
        baselineList,
        loading: false
      })
    );
  }

  handleBaselineChange = (e) => {
    this.setState({
      newBaseline: e.target.value
    });
    //console.log("changed baseline to " + this.state.newBaseline);
  }

  handleCompetencyChange = (e) => {
    this.setState({
      newCompetency: e.target.value
    });
    //console.log("changed competency to " + this.state.newCompetency);
  }

  saveBaseline() {
    var data = {
      '1': this.state.newBaseline
    }
   
  }

  saveCompetency() {
    var data = {
      '1': this.state.newCompetency
    }
   
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

  children = []

  render() {
    _.map(this.state.baselineList, (item, index) =>(
      this.children.push(<Option key={index}>{item.name}</Option>)
    ));
    
    return (
      <div>
        <Button type="primary" size="large" onClick={this.showModal}>
          Add New Baseline
        </Button>
        <Modal
          visible={this.state.visible}
          title="Add New Baseline"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>Return</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
              Submit
            </Button>
          ]}
        >
          <p>Baseline Name: </p>
          <Input placeholder="Baseline...." value={this.state.newBaseline} onChange={this.handleBaselineChange.bind(this)} />
          <p>Please choose competencies: </p>
          <Input placeholder="Competency...." value={this.state.newCompetency} onChange={this.handleCompetencyChange.bind(this)} />
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={['a10', 'c12']}
            
          >
            {this.children}
          </Select>
        </Modal>
      </div>
    );
  }
}

export default RoleProfile;
