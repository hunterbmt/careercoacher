import React, { Component } from 'react';
import {Layout, Button, Input, Select, Row,Col } from 'antd';
import { getData, insert , update} from './firebase';
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
    this.state = { isCreate: false };
  }



  render() {
    return (
       <Layout style={{height: '100%'}}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{height: '100%'}}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{height: 64, padding: 10}}/>
            </Col>
          </Row>
        </Header>
        <Row type="flex" justify="space-around" align="middle">
          <Col span={8}></Col>
          <Col span={8}>
            <Button type="primary">Add new question</Button>
            <CreateQuestion />
          </Col>
          <Col span={8}></Col>
        </Row>
        </Layout>

    );
  }
}

class RenderQuestionAndAnswer extends Component {

  constructor(props) {
    super(props);
    this.state = { question: '', answer1: '', answer2: '', answer3: '', answer4: '', hint : '', data : [] };
  }

  handleChangeQuestion(e) {
    this.setState({question : e.target.value});
    console.log(this.state.question);
  }

  handleChangeAnswer1(e) {
    console.log(this.state.answer1);
   this.setState({answer1 : e.target.value}); 
  }

  handleChangeAnswer2(e) {
    console.log(this.state.answer2);
    this.setState({answer2 : e.target.value});
  }

  handleChangeAnswer3(e) {
    console.log(this.state.answer3);
    this.setState({answer3 : e.target.value});
  }

  handleChangeAnswer4(e) {
    console.log(this.state.answer4);
    this.setState({answer4 : e.target.value});
  }

  handleChangeHint(e){
    console.log(this.state.hint);
    this.setState({hint : e.target.value});
  }

  saveOption(){
  var newData =   {
  "desc" : this.state.question,
  "hint" : this.state.hint,
  "options" : [ this.state.answer1, this.state.answer2, this.state.answer3, this.state.answer4 ],
  "type" : "option"
    } 
    this.setState({ data : newData})
     console.log(this.state.data);
     update(`competencies1/BigData/questions/12`, this.state.data);
   
  }

  saveOthers(){

  }

  render() {
    if (this.props.selected === "option") {
      return (
        <div>
          <h3>Please input the question</h3>
          <Input type="textarea" value={this.state.question} onChange={this.handleChangeQuestion.bind(this)} />
          <h3>Please input hint for this question</h3>
          <Input type="textarea" value={this.state.hint} onChange={this.handleChangeHint.bind(this)} />
          <h3>Please input the first answer :</h3>
          <Input type="textarea" value={this.state.answer1} onChange={this.handleChangeAnswer1.bind(this)} />
          <h3>Please input the second answer :</h3>
          <Input type="textarea" value={this.state.answer2} onChange={this.handleChangeAnswer2.bind(this)} />
          <h3>Please input the third answer :</h3>
          <Input type="textarea" value={this.state.answer3} onChange={this.handleChangeAnswer3.bind(this)} />
          <h3>Please input the fourth answer :</h3>
          <Input type="textarea" value={this.state.answer4} onChange={this.handleChangeAnswer4.bind(this)} />
          <Button type="primary" onClick={this.saveOption.bind(this)}>Save</Button>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Please input the question</h3>
          <Input type="textarea" value={this.state.question} onChange={this.handleChangeQuestion.bind(this)} />
          <h3>Please input hint for this question</h3>
          <Input type="textarea" value={this.state.hint} onChange={this.handleChangeHint.bind(this)} />
          <Button type="primary" onClick={this.saveOthers.bind(this)} >Save</Button>
        </div>
      );
    }

  }
}

class CreateQuestion extends Component {

  constructor(props) {
    super(props);
    this.state = { selectValue: 'scale' };
  }


  handleChange(value) {
    this.setState({
      selectValue: `${value}`
    })
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <h3>Please choose question types: </h3>
        <Select defaultValue={this.state.selectValue} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
          <Option value="scale">Scale</Option>
          <Option value="option">Option</Option>
          <Option value="freetext">freetext</Option>
          <Option value="switch">Switch</Option>
        </Select>
        <RenderQuestionAndAnswer selected={this.state.selectValue} />
      </div>
    );
  }
}


export default QuestionCompetency;
