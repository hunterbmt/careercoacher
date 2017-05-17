import React, { Component } from 'react';
import { Layout, Button, Input, Select, Row, Col, Modal, Table, Icon } from 'antd';
import { getData, insert, update } from './firebase';
import _ from 'lodash';
import Loading from './Loading';
import QuestionInput from './QuestionInput';
import Scale from './Scale';
import ReactDOM from 'react-dom';
import logo from './logo.png';

const { Header, Content } = Layout;


const Option = Select.Option;

class QuestionCompetency extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visibleEdit: false,
      showEditPopup: false,
      visible: false,
      selectValue: 'scale',
      question: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      answer5: '',
      hint: '',
      selectedIndex : 0,
      dataQuestion: [],
      dataSource: [],
      questionDataDetail: {},
      loading: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
    this.handleChangeAnswer1 = this.handleChangeAnswer1.bind(this);
    this.handleChangeAnswer2 = this.handleChangeAnswer2.bind(this);
    this.handleChangeAnswer3 = this.handleChangeAnswer3.bind(this);
    this.handleChangeAnswer4 = this.handleChangeAnswer4.bind(this);
    this.handleChangeHint = this.handleChangeHint.bind(this);
  }

  handleChangeQuestion(e) {
    this.setState({ question: e.target.value });

  }

  handleChangeAnswer1(e) {
    this.setState({ answer1: e.target.value });
  }

  handleChangeAnswer2(e) {
    this.setState({ answer2: e.target.value });
  }

  handleChangeAnswer3(e) {
    this.setState({ answer3: e.target.value });
  }

  handleChangeAnswer4(e) {
    this.setState({ answer4: e.target.value });
  }

  handleChangeAnswer5(e) {
    this.setState({ answer5: e.target.value });
  }

  handleChangeHint(e) {
    this.setState({ hint: e.target.value });
  }

  handleChange(value) {
    this.setState({
      selectValue: `${value}`
    })
  }

  saveOption() {
    var newDataOption = {
      "desc": this.state.question,
      "hint": this.state.hint,
      "options": [this.state.answer1, this.state.answer2, this.state.answer3, this.state.answer4, this.state.answer5],
      "type": this.state.selectValue
    }

    update(`competencies1/${this.props.name}/questions/12`, newDataOption);

  }

  saveOthers() {
    var newDataOthers = {
      "desc": this.state.question,
      "hint": this.state.hint,
      "type": this.state.selectValue
    }

    console.log(newDataOthers);

    update(`competencies1/${this.props.name}/questions/12`, newDataOthers);

  }


  saveQuestion(type) {
    if (type === 'option') {
      this.saveOption();
    } else {
      this.saveOthers();
    }
  }


  componentDidMount() {
    getData(`competencies1/${this.props.name}/questions`)
      .then((data) => this.setState({
        dataQuestion: data,
        loading: false
      }));


  }



  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleSave = (e) => {
    this.setState({
      visible: false
    });
    this.saveQuestion(this.state.selectValue);
  }

  handleCancel = (e) => {

    this.setState({
      visible: false,
    });
  }


  editOption(index) {
    var newDataOption = {
      "desc": this.state.question,
      "hint": this.state.hint,
      "options": [this.state.answer1, this.state.answer2, this.state.answer3, this.state.answer4, this.state.answer5],
      "type": this.state.selectValue
    }

    update(`competencies1/${this.props.name}/questions/${index}`, newDataOption);

  }

   saveOthers(index) {
    var newDataOthers = {
      "desc": this.state.question,
      "hint": this.state.hint,
      "type": this.state.selectValue
    }

    console.log(newDataOthers);

    update(`competencies1/${this.props.name}/questions/${index}`, newDataOthers);

  }


  handleEdit = (e) => {
    this.setState({
      showEditPopup: false
    });
  }

  handleEditCancel = (e) => {

    this.setState({
      showEditPopup: false,
    });
  }



  optionQuestionType(type) {
    if (type === "option") {
      return (
        <div>
          <h3>Please input the question</h3>
          <Input type="textarea" value={this.state.question} onChange={this.handleChangeQuestion} />
          <h3>Please input hint for this question</h3>
          <Input type="textarea" value={this.state.hint} onChange={this.handleChangeHint} />
          <h3>Please input the first answer :</h3>
          <Input type="textarea" value={this.state.answer1} onChange={this.handleChangeAnswer1} />
          <h3>Please input the second answer :</h3>
          <Input type="textarea" value={this.state.answer2} onChange={this.handleChangeAnswer2} />
          <h3>Please input the third answer :</h3>
          <Input type="textarea" value={this.state.answer3} onChange={this.handleChangeAnswer3} />
          <h3>Please input the fourth answer :</h3>
          <Input type="textarea" value={this.state.answer4} onChange={this.handleChangeAnswer4} />
          <h3>Please input the fifth answer :</h3>
          <Input type="textarea" value={this.state.answer5} onChange={this.handleChangeAnswer5} />
        </div>
      );
    } else {
      return (
        <div>
          <h3>Please input the question</h3>
          <Input type="textarea" value={this.state.question} onChange={this.handleChangeQuestion} />
          <h3>Please input hint for this question</h3>
          <Input type="textarea" value={this.state.hint} onChange={this.handleChangeHint} />
        </div>
      );
    }
  }

  columns = [{
    title: 'No',
    dataIndex: 'no',
    key: 'no',
  }, {
    title: 'Question',
    dataIndex: 'question',
    key: 'question',
  }, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a onClick={() => this.onSelectQuestion(record.no)}>Edit</a>
        <span className="ant-divider" />
        <a onClick={this.showModalDelete}>Delete</a>
      </span>
    ),
  }];

  onSelectQuestion(index) {
    var realIndex = index - 1 ;
    getData(`competencies1/${this.props.name}/questions/${realIndex}`)
      .then((detailQuestionData) =>this.setState({
        questionDataDetail: detailQuestionData,
        showEditPopup: true
      }));  
  }




   renderOptionQuestionType(detailQuestion) {
  if (detailQuestion.type === "option") {
      return (
        <div>
          <h3>Question</h3>
          <Input type="textarea" defaultValue={detailQuestion.desc}  onChange={this.handleChangeQuestion} />
          <h3>Hint</h3>
          <Input type="textarea" defaultValue={detailQuestion.hint}  onChange={this.handleChangeHint}  />
          <h3>First answer :</h3>
          <Input type="textarea" defaultValue={_.nth(detailQuestion.options,0)}  onChange={this.handleChangeAnswer1} />
          <h3>Second answer :</h3>
          <Input type="textarea" defaultValue={_.nth(detailQuestion.options,1)}  onChange={this.handleChangeAnswer2} />
          <h3>Third answer :</h3>
          <Input type="textarea" defaultValue={_.nth(detailQuestion.options,2)}  onChange={this.handleChangeAnswer3} />
          <h3>Fourth answer :</h3>
          <Input type="textarea" defaultValue={_.nth(detailQuestion.options,3)}  onChange={this.handleChangeAnswer4} />
          <h3>Fifth answer :</h3>
          <Input type="textarea" defaultValue={_.nth(detailQuestion.options,4)}  onChange={this.handleChangeAnswer5} />
        </div>
      );
    } else {
      return (
        <div>
          <h3>Question</h3>
          <Input type="textarea" defaultValue={detailQuestion.desc}  />
          <h3>Hint</h3>
          <Input type="textarea" defaultValue={detailQuestion.hint} />
        </div>
      );
    }
  }

 
  getDataSouce() {
    _.map(this.state.dataQuestion, (item, index) => {
      var object = {
        no: index + 1,
        question: item.type
      }
      this.state.dataSource.push(object);
    })
   
  }


  render() {
    if (this.state.loading) return <div style={{ height: 600 }}><Loading /> </div>;
    this.getDataSouce();
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{ height: 64, padding: 10 }} />
            </Col>
          </Row>
        </Header>
        <Row type="flex" justify="space-around" align="middle">
          <Col span={8}></Col>
          <Col span={8}>
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={this.showModal}>Add new question</Button>
            <Modal title="Create new question" visible={this.state.visible}
              onOk={this.handleSave} onCancel={this.handleCancel}>
              <h3>Please choose question types: </h3>
              <Select defaultValue={this.state.selectValue} style={{ width: 120 }} onChange={this.handleChange}>
                <Option value="scale">Scale</Option>
                <Option value="option">Option</Option>
                <Option value="freetext">freetext</Option>
                <Option value="switch">Switch</Option>
              </Select>
              {this.optionQuestionType(this.state.selectValue)}
            </Modal>
            <Modal title="Edit question" visible={this.state.showEditPopup}
              onOk={this.handleEdit} onCancel={this.handleEditCancel}>
              {
               this.renderOptionQuestionType(this.state.questionDataDetail)
              }            
            </Modal>
          </Col>
        </Row>
        <Row style={{ margin: 100 }}>
          <Col><Table columns={this.columns} dataSource={this.state.dataSource} /></Col>
        </Row>
      </Layout>

    );
  }
}


export default QuestionCompetency;
