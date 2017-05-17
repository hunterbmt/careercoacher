import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu, Icon, Row, Col, Button, Modal, Input, Card, Table, InputNumber, Popconfirm, message  } from 'antd';
import ProfilePage from './ProfilePage';
import Loading from './Loading';
import './App.css';
import logo from './logo.png';
import { getData, update, insert, getNewIndex } from './firebase';
const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class CurrentBaseline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      mode: 'inline',
      loading: true,
      showEditProfilePopup : false,
      visible : false,

      filterDropdownVisible: false,
      searchText: '',
      selectedCompetency : '',
      selectedCompetencyLevel : '',

      baseline : [],
      competencyList : [],
      currentBaselineDataSource : [],

      currentBaselineColumns : [{
        title: 'Competencies',
        dataIndex: 'competencies',
        key: 'competencies',
      }, {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
      }, { 
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => this.onSelectCompetency(record.competencies, record.level)} key={record.level}>Edit 一 {record.competencies} Level</a>
            <span className='ant-divider' />
            <Popconfirm title='Are you sure delete this item?' onConfirm={this.onConfirmDelete} onCancel={this.onConfirmCancelDelete} okText='Yes' cancelText='No'>
            <a>Delete</a>
            </Popconfirm>
          </span>
        ),
      }]
    };
  }

  onConfirmDelete = () => {
    message.success('Click on Yes');
  }

  onConfirmCancelDelete = () => {
    message.error('Click on No');
  }

  onSelectCompetency = (c, l) => {
    this.setState({
      showEditProfilePopup : true,
      selectedCompetency : c,
      selectedCompetencyLevel : l,
    })
  }

  componentDidMount() {
    Promise.all([getData(`baseline/${this.props.selectedBaseline}/name`), getData(`baseline/${this.props.selectedBaseline}/competencies`)]).then(([baseline, competencyList]) =>
      this.setState({       
        baseline,
        competencyList,
        currentBaselineDataSource : [], 
        loading: false
      })
    );
   
  }

  
  componentWillReceiveProps(nextProps) {
    Promise.all([getData(`baseline/${nextProps.selectedBaseline}/name`), getData(`baseline/${nextProps.selectedBaseline}/competencies`)]).then(([baseline, competencyList]) =>
      this.setState({
        currentBaselineDataSource : [],       
        competencyList,
        baseline
      })
    );
    
  }

  handleBaselineChange = (e) => {
    this.setState({
      newBaseline: e.target.value
    });
   
  }

  handleCompetencyChange = (e) => {
    this.setState({
      newCompetency: e.target.value
    });
  }

  showModal = () => {
    this.setState({
      showEditProfilePopup: true,
    });
  }

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, showEditProfilePopup: false });
    }, 3000);
  }

  handleCancel = () => {
    this.setState({ showEditProfilePopup : false });
  }

  resetDataSource =  () => {
    this.setState({
      currentBaselineDataSource : []
    })
  }

  render() {
     _.map(this.state.competencyList, (item, index) => {
    var object = {
      key: index,
      competencies: index,
      level: item
    };
    this.state.currentBaselineDataSource.push(object)
  });
    return(
    <div>
    <Layout>
      <Content style={{ margin: '0 16px' }}>
        <Card title='Role Profile' style={{ width: '100%' }}>
          <h1>Baseline : {this.state.baseline}</h1>
          <h2>Competencies Required:</h2>
          <Table dataSource={this.state.currentBaselineDataSource} columns={this.state.currentBaselineColumns} />
        </Card>
      </Content>
    </Layout>
    <Modal
      visible={this.state.showEditProfilePopup}
      title='Edit Competency'
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      footer={[
        <Button key='back' size='large' onClick={this.handleCancel}>Return</Button>,
        <Button key='submit' type='primary' size='large' loading={this.state.loading} onClick={this.handleOk}>
          Save
        </Button>
      ]}
    >
      <p>{this.props.something}</p>
      <p>Competencies: </p>
      <Input placeholder='Coding....' value={this.state.selectedCompetency} onChange={this.handleBaselineChange.bind(this)} disabled='true'/>
      <p>Proficency: </p>
      <InputNumber min={0} max={4} defaultValue={this.state.selectedCompetencyLevel} onChange={this.handleBaselineChange.bind(this)} />
    </Modal>
    </div>);  
    }
}

export default CurrentBaseline;