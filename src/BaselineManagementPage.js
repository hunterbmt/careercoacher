import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu, Icon, Row, Col, Button, Modal, Input, Card, Table, Select, Tabs, Popconfirm, message } from 'antd';
import ProfilePage from './ProfilePage';
import CurrentBaseline from './CurrentBaseline';
import Loading from './Loading';
import './App.css';
import logo from './logo.png';
import { getData, update, insert, getNewIndex } from './firebase';
const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;

class BaselineManagementPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      mode: 'inline',
      loading: true,

      filterDropdownVisible: false,
     
      selectedBaseline : 0,

      coreBaselineListDataSource : [],
      optionalBaselineListDataSource : [],
    
      coreBaselineListColumns : [{
        title: 'No',
        dataIndex: 'no',
        key: 'no',
      }, {
        title: 'Competency',
        dataIndex: 'competency',
        key: 'competency',
      }, {
        title: 'Proficiency',
        dataIndex: 'proficiency',
        key: 'proficiency',
      }, { 
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => this.onSelectBaseline(record.no)} key={record.name}>Edit 一 {record.name}</a>
            <span className="ant-divider" />
            <Popconfirm title="Are you sure delete this item?" onConfirm={this.onConfirmDelete} onCancel={this.onConfirmCancelDelete} okText="Yes" cancelText="No">
            <a>Delete</a>
            </Popconfirm>
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
    Promise.all([getData('baseline'), getData(`baseline/${this.state.selectedBaseline}/Kms_core/competencies`), getData(`baseline/${this.state.selectedBaseline}/Kms_optional/competencies`)]).then(([baselineList, coreBaselineCompetencyList, optionalBaselineCompetencyList]) =>
      this.setState({
        baselineList,
        coreBaselineCompetencyList,
        optionalBaselineCompetencyList,
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

  callback = (key) => {
      console.log(key);
      this.setState({
          selectedBaseline : key
      }, () => console.log("Selected " + this.state.selectedBaseline))
  }

  render() {
    if (this.state.loading) return <Loading />;

    var baselineTabName = [];
    _.map(this.state.baselineList, (item, index) => {
      baselineTabName.push(
      <TabPane tab={item.name} key={index}>
          {
              
          }
      </TabPane>
      );
    })

    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{ height: 64, padding: 10 }} />
            </Col>
            <Col style={{ paddingRight: 20 }}>
             
            </Col>
          </Row>
        </Header>
        <Layout>
          
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
          <Col span={8}>
          <Layout>
            <Content style={{ margin: '0 16px' }}>
              <Card title='KMS Core Baselines' style={{ width: '100%' }}>
                <OptionalBaseline selectedBaseline={this.state.selectedBaseline}/>
              </Card>
            </Content>
          </Layout>
          </Col>

          <Col span={16}>
          <Card title='All Role Profiles' style={{ width: '100%' }}>
            <Tabs defaultActiveKey="0" onChange={this.callback}>
                {baselineTabName}
            </Tabs>
          </Card>
          </Col>
        </Row>

        </Layout>
      </Layout>
    );
  }
}

class CoreBaseline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource : [],
            selectedBaseline : 0,
            columns : [{
                title: 'No',
                dataIndex: 'no',
                key: 'no',
            }, {
                title: 'Competency',
                dataIndex: 'competency',
                key: 'competency',
            }, {
                title: 'Proficiency',
                dataIndex: 'proficiency',
                key: 'proficiency',
            }, { 
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                <span>
                    <a onClick={() => this.onSelectBaseline(record.no)} key={record.no}>Edit 一 {record.competency}</a>
                    <span className="ant-divider" />
                    <Popconfirm title="Are you sure delete this item?" onConfirm={this.onConfirmDelete} onCancel={this.onConfirmCancelDelete} okText="Yes" cancelText="No">
                    <a>Delete</a>
                    </Popconfirm>
                    <span className="ant-divider" />
                    <a className="ant-dropdown-link">
                    More actions <Icon type="down" />
                    </a>
                </span>
                ),
            }]
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            selectedBaseline : newProps.selectedBaseline
        }, () => Promise.all([getData(`baseline/${this.state.selectedBaseline}/Kms_core/competencies`)]).then(([coreBaselineCompetencyList]) =>
            this.setState({
                coreBaselineCompetencyList,
                loading: false
            })
        ))
    }

    componentDidMount() {
     Promise.all([getData(`baseline/${this.state.selectedBaseline}/Kms_core/competencies`)]).then(([coreBaselineCompetencyList]) =>
            this.setState({
                coreBaselineCompetencyList,
                loading: false
            })
        );
    }

    render() {
        var dataSource = [];
        _.map(this.state.coreBaselineCompetencyList, (item, index) => {
            console.log(item.proficiency);
            var object = {
                key : index,
                no: index,
                competency : Object.values(item.name),
                proficiency: item.proficiency
            };
            dataSource.push(object);
            console.log("dataSource " + dataSource);
        });
        return <Table dataSource={dataSource} columns={this.state.columns} />
    }

    onConfirmDelete = () => {
        message.success('Click on Yes');
    }

    onConfirmCancelDelete = () => {
        message.error('Click on No');
    }
}

class OptionalBaseline extends Component {
     constructor(props) {
        super(props);
        this.state = {
            dataSource : [],
            selectedBaseline : 0,
            columns : [{
                title: 'No',
                dataIndex: 'no',
                key: 'no',
            }, {
                title: 'Competency',
                dataIndex: 'competency',
                key: 'competency',
            }, {
                title: 'Proficiency',
                dataIndex: 'proficiency',
                key: 'proficiency',
            }, { 
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                <span>
                    <a onClick={() => this.onSelectBaseline(record.no)} key={record.no}>Edit 一 {record.competency}</a>
                    <span className="ant-divider" />
                    <Popconfirm title="Are you sure delete this item?" onConfirm={this.onConfirmDelete} onCancel={this.onConfirmCancelDelete} okText="Yes" cancelText="No">
                    <a>Delete</a>
                    </Popconfirm>
                    <span className="ant-divider" />
                    <a className="ant-dropdown-link">
                    More actions <Icon type="down" />
                    </a>
                </span>
                ),
            }]
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            selectedBaseline : newProps.selectedBaseline
        }, () => Promise.all([getData(`baseline/${this.state.selectedBaseline}/Kms_optional/competencies`)]).then(([optionalBaselineCompetencyList]) =>
            this.setState({
                optionalBaselineCompetencyList,
                loading: false
            })
        ))
    }

    componentDidMount() {
     Promise.all([getData(`baseline/${this.state.selectedBaseline}/Kms_optional/competencies`)]).then(([optionalBaselineCompetencyList]) =>
            this.setState({
                optionalBaselineCompetencyList,
                loading: false
            })
        );
    }

    render() {
        var dataSource = [];
        _.map(this.state.optionalBaselineCompetencyList, (item, index) => {
            console.log(item.proficiency);
            var object = {
                key : index,
                no: index,
                competency : Object.values(item.name),
                proficiency: item.proficiency
            };
            dataSource.push(object);
            console.log("dataSource " + dataSource);
        });
        return <Table dataSource={dataSource} columns={this.state.columns} />
    }

    onConfirmDelete = () => {
        message.success('Click on Yes');
    }

    onConfirmCancelDelete = () => {
        message.error('Click on No');
    }
}

export default BaselineManagementPage;
