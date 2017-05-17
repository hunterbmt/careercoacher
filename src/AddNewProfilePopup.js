import React, {Component} from 'react';
import _ from 'lodash';
import { Layout, Menu, Icon, Row, Col, Button, Modal, Input } from 'antd';
import ProfilePage from './ProfilePage';
import Loading from './Loading';
import './App.css';
import logo from './logo.png';
import {getData} from './firebase';
import GroupManagement from './GroupManagement';
import {Router, Link} from 'react-router-component';

const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class AddNewProfilePopup extends Component {
  state = {
    loading: false,
    visible: false,
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({ loading: true });
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
        <Button type='primary' size='large' onClick={this.showModal}>
          Add New Group
        </Button>
        <Modal
          visible={this.state.visible}
          title='Add New Group'
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key='back' size='large' onClick={this.handleCancel}>Return</Button>,
            <Button key='submit' type='primary' size='large' loading={this.state.loading} onClick={this.handleOk}>
              Submit
            </Button>,
          ]}
        >
          <p>Group Name: </p>
          <Input placeholder='Group Name....' />
        </Modal>
      </div>
    );
  }
}

export default AddNewProfilePopup;