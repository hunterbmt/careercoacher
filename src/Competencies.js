import React, { Component } from 'react';
import { Layout, Modal, Switch, Icon, Button, Input, Row, Col } from 'antd';
import { getData, insert } from './firebase';
import _ from 'lodash';
import Loading from './Loading';
import './competency.css';
import { Router, Link } from 'react-router-component';
const { Header, Content } = Layout;
import logo from './logo.png';

var list;


class Competencies extends Component {

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.setState({ loading: false })
  }

  render() {
    if (this.state.loading) return <div style={{ height: 600 }}><Loading /> </div>;
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
            <CompetencyPopup />
            <CompetencyList />
          </Col>
          <Col span={8}></Col>
        </Row>
      </Layout>
    );
  }
}

class CompetencyList extends Component {
  constructor(props) {
    super(props);
    list = this;
    this.state = { arrayCompetencies: [] };
  }

  handle(competencyData) {
    this.setState({
      arrayCompetencies: Object.keys(competencyData)
    });

  }

  setArrayCompetencyData() {
    getData(`competencies1`)
      .then((competencyData) => this.handle(competencyData));
  }

  componentDidMount() {
    this.setArrayCompetencyData();
  }

  render() {
    return (
      <div>
        {
          this.state.arrayCompetencies.map((competency, index) => {
            return <Competency key={index} name={(competency)} />
          })
        }
      </div>
    );
  }
}

class CompetencyPopup extends Component {

  constructor(props) {
    super(props);
    this.state = { visible: false, competencyName: '' };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  addNewCompetency(competencyName) {
    var addNewCompetencyData = {
      "activated": false,
      "questions": [{
        "desc": "Please describe your ability to learn and research basic features of programming language. The ability on developing the programming solutions with technologies (Single or multiples). Example added below is for your reference.",
        "hint": "Your ability on recognizing and applying on I/O, ADO.NET/JDBC, Threading, Collection and data structure in C#/JAVA. Visualize and/or explain knowledge of common algorithms, data structure in problem solving. And be able to identify and implements the best solution for each problem.",
        "options": ["Solves almost simple problem by using flow control, collection, I/O and database", "Able to recognize and code dynamic programming solutions, solves some hard problems in implementing", "Recognizing and applying dynamic programming solutions, solves almost hard problems in implementing", "Recognizing and applying dynamic programming solutions, solves almost hardest problems with the best and generic solution in implementing to keep it simplest as possible, use visualization to explain other people"],
        "type": "option"
      }, {
        "desc": "How you evaluate your knowledge about language specific and up-to-date features",
        "hint": {
          "csharp": "async/await, exception filter, extension method, tuples, pattern matching, etc",
          "java": "lambda, HTTP 2 client, reactive stream, module system, Мulti-Resolution Image API, etc",
          "js": "Your knowledge about language specific features such as closure, function scope, hosting and up-to-date features such as promise, generator, lambda, etc"
        },
        "type": "scale"
      }, {
        "desc": "Do you acknowledge and apply coding in language main paradigm with design patterns/ anti-patterns and know how to apply popular architectural style to solve technical challenge of functional and non-functional. \ni.e prototyping for JS, OOP for C# and Java",
        "options": ["Has basic knowledge about language's main paradigm and some patterns", "Has knowledge about language's main paradigm and be able to implement some common patterns", "Has good knowledge about language's main paradigm and its benefit, be able to apply it in some components and layers within projects, be able to design small framework", "Very solid language's main paradigm in patterns and anti-patterns, be able to develop suitable framework for any architectural styles from client's requirement and/or choose the best one based on quality attribute of software architecture"],
        "type": "option"
      }, {
        "desc": "Do you have knowledge or experience in applying any other paradigms\ni.e functional programming, OOP, AOP, byte code manipulation or code generation, etc",
        "options": ["I don't know any other programming paradigms", "I hear about some others paradigms", "I have good knowledge about others paradigms but not yet apply them into projects", "I apply others paradigms in projects and can see clearly benefit of applying those"],
        "type": "option"
      }, {
        "desc": "Do you think how good are you in applying coding convention, coding quality, principles, best/bad practices in implementation to exceed coding quality? \nUsing SOLID, DRY, exception handling, code readability, maintainability etc... To design code structure, system decomposition into multiple layers, components and packages to support the scale and complexity of projects.",
        "options": ["Able to break up problem space and design solution as long as it is within the same class/component/layer", "Applying Coding convention, SOLID, DRY and be able to design almost solutions within current system with limit of support from other", "Has knowledge in almost best practice, principles to adapt coding quality at company level and solves almost problem/ and be able to provide almost solutions within the whole projects", "Has solid knowledge in almost in all best practice, principles to adapt coding quality world class level and solves almost problem, is key person who provides almost complex solutions of client. Visualize, consult and supportive for understanding technical team(s) to quick adapt with client's requirements"],
        "type": "option"
      }, {
        "desc": "Are you master of code review and refactor code? Have you researched, applied successful best practice and principles of all areas of coding quality, clean code which defined by industry standard and/or KA tool \nConducting code review with team/client and refactoring code from legacy code into clean, testable and elegant code",
        "type": "scale"
      }, {
        "desc": "How do you evaluate your knowledge about language's executions",
        "hint": {
          "csharp": "MSIL, CLR",
          "java": "JIT, bytecode, ATL, JVM",
          "js": "Knowledge about event loop, how JS code got executed, compiled, how JS execute async task."
        },
        "type": "scale"
      }, {
        "desc": "How do you evaluate your knowledge about coding standard and optimization framework? Applying successful on single or multiple frameworks, technologies and tools",
        "type": "scale"
      }, {
        "desc": "Have you ever designed training courses to teaching others in helping them improve their advance programming language skill at project level or at company-wide? Or even host the speech at technology events about advance programming language.",
        "options": ["Has no an experience", "Be able to train/coach for team members", "Training for the team in any project, conducting officially training at company wide", "Coaching all seniors, architects, higher positions and always earn high respect from others"],
        "type": "option"
      }, {
        "desc": "Have you ever designed and developed successful high performance system from framework or scratch? Or even fixed performance issue? Like some examples described at bellow.\n“Using tool, applying knowledge and techniques to identify the root cause. Do the deep investigation the problem to find out root cause and provide solution to fix performance issue completely” \n“Designing and developing a high performance framework from scratch successful or modify current frameworks to fit special need to solve technical challenges of functional and non-functional.”\nPlease rate your knowledge",
        "type": "scale"
      }, {
        "desc": "Did you make any contribution into sharping language's future ? Contributing into famous libs, frameworks also counted",
        "type": "switch"
      }, {
        "desc": "Do you have any comment?",
        "type": "freetext"
      }]
    }



    insert(`competencies1/${competencyName}`, addNewCompetencyData);
  }

  handleChange(e) {
    this.setState({ competencyName: e.target.value });
  }

  handleSave = (e) => {
    this.setState({
      visible: false
    });

    console.log(list.state.arrayCompetencies);

    this.addNewCompetency(this.state.competencyName);

    var newArrayCompetencies = list.state.arrayCompetencies.push(this.state.competencyName);

    list.setState({
      arrayCompetencies: newArrayCompetencies
    });

  }

  handleCancel = (e) => {

    this.setState({
      visible: false,
    });
  }


  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>Add new compentency</Button>
        <Modal title="Create new compentency" visible={this.state.visible}
          onOk={this.handleSave} onCancel={this.handleCancel}
        >
          <Input type='text' value={this.state.competencyName} onChange={this.handleChange.bind(this)} />
        </Modal>
      </div>
    );
  }
}

class Competency extends Component {

  constructor(props) {
    super(props);
    this.state = { checked: false };
  }


  onChange() {
    this.setState({ checked: !this.state.checked });
    var updateDataCompetency = {
      "activated": this.state.checked,
      "questions": [{
        "desc": "Please describe your ability to learn and research basic features of programming language. The ability on developing the programming solutions with technologies (Single or multiples). Example added below is for your reference.",
        "hint": "Your ability on recognizing and applying on I/O, ADO.NET/JDBC, Threading, Collection and data structure in C#/JAVA. Visualize and/or explain knowledge of common algorithms, data structure in problem solving. And be able to identify and implements the best solution for each problem.",
        "options": ["Solves almost simple problem by using flow control, collection, I/O and database", "Able to recognize and code dynamic programming solutions, solves some hard problems in implementing", "Recognizing and applying dynamic programming solutions, solves almost hard problems in implementing", "Recognizing and applying dynamic programming solutions, solves almost hardest problems with the best and generic solution in implementing to keep it simplest as possible, use visualization to explain other people"],
        "type": "option"
      }, {
        "desc": "How you evaluate your knowledge about language specific and up-to-date features",
        "hint": {
          "csharp": "async/await, exception filter, extension method, tuples, pattern matching, etc",
          "java": "lambda, HTTP 2 client, reactive stream, module system, Мulti-Resolution Image API, etc",
          "js": "Your knowledge about language specific features such as closure, function scope, hosting and up-to-date features such as promise, generator, lambda, etc"
        },
        "type": "scale"
      }, {
        "desc": "Do you acknowledge and apply coding in language main paradigm with design patterns/ anti-patterns and know how to apply popular architectural style to solve technical challenge of functional and non-functional. \ni.e prototyping for JS, OOP for C# and Java",
        "options": ["Has basic knowledge about language's main paradigm and some patterns", "Has knowledge about language's main paradigm and be able to implement some common patterns", "Has good knowledge about language's main paradigm and its benefit, be able to apply it in some components and layers within projects, be able to design small framework", "Very solid language's main paradigm in patterns and anti-patterns, be able to develop suitable framework for any architectural styles from client's requirement and/or choose the best one based on quality attribute of software architecture"],
        "type": "option"
      }, {
        "desc": "Do you have knowledge or experience in applying any other paradigms\ni.e functional programming, OOP, AOP, byte code manipulation or code generation, etc",
        "options": ["I don't know any other programming paradigms", "I hear about some others paradigms", "I have good knowledge about others paradigms but not yet apply them into projects", "I apply others paradigms in projects and can see clearly benefit of applying those"],
        "type": "option"
      }, {
        "desc": "Do you think how good are you in applying coding convention, coding quality, principles, best/bad practices in implementation to exceed coding quality? \nUsing SOLID, DRY, exception handling, code readability, maintainability etc... To design code structure, system decomposition into multiple layers, components and packages to support the scale and complexity of projects.",
        "options": ["Able to break up problem space and design solution as long as it is within the same class/component/layer", "Applying Coding convention, SOLID, DRY and be able to design almost solutions within current system with limit of support from other", "Has knowledge in almost best practice, principles to adapt coding quality at company level and solves almost problem/ and be able to provide almost solutions within the whole projects", "Has solid knowledge in almost in all best practice, principles to adapt coding quality world class level and solves almost problem, is key person who provides almost complex solutions of client. Visualize, consult and supportive for understanding technical team(s) to quick adapt with client's requirements"],
        "type": "option"
      }, {
        "desc": "Are you master of code review and refactor code? Have you researched, applied successful best practice and principles of all areas of coding quality, clean code which defined by industry standard and/or KA tool \nConducting code review with team/client and refactoring code from legacy code into clean, testable and elegant code",
        "type": "scale"
      }, {
        "desc": "How do you evaluate your knowledge about language's executions",
        "hint": {
          "csharp": "MSIL, CLR",
          "java": "JIT, bytecode, ATL, JVM",
          "js": "Knowledge about event loop, how JS code got executed, compiled, how JS execute async task."
        },
        "type": "scale"
      }, {
        "desc": "How do you evaluate your knowledge about coding standard and optimization framework? Applying successful on single or multiple frameworks, technologies and tools",
        "type": "scale"
      }, {
        "desc": "Have you ever designed training courses to teaching others in helping them improve their advance programming language skill at project level or at company-wide? Or even host the speech at technology events about advance programming language.",
        "options": ["Has no an experience", "Be able to train/coach for team members", "Training for the team in any project, conducting officially training at company wide", "Coaching all seniors, architects, higher positions and always earn high respect from others"],
        "type": "option"
      }, {
        "desc": "Have you ever designed and developed successful high performance system from framework or scratch? Or even fixed performance issue? Like some examples described at bellow.\n“Using tool, applying knowledge and techniques to identify the root cause. Do the deep investigation the problem to find out root cause and provide solution to fix performance issue completely” \n“Designing and developing a high performance framework from scratch successful or modify current frameworks to fit special need to solve technical challenges of functional and non-functional.”\nPlease rate your knowledge",
        "type": "scale"
      }, {
        "desc": "Did you make any contribution into sharping language's future ? Contributing into famous libs, frameworks also counted",
        "type": "switch"
      }, {
        "desc": "Do you have any comment?",
        "type": "freetext"
      }]
    }
    insert(`competencies1/${this.props.name}`, updateDataCompetency);

  }

  handleSetChecked(competency) {
    this.setState({
      checked: competency.activated
    });
  }

  getActivatedCompetency(props) {
    getData(`competencies1/${props}`)
      .then((competency) =>
        this.handleSetChecked(competency)
      );
  }

  componentDidMount() {
    this.getActivatedCompetency(this.props.name);
  }

  render() {
    return (
      <div className="div-note">
        <h1>{this.props.name}</h1>
        <Switch defaultChecked={this.state.checked} checkedChildren={<Icon type='check' />} unCheckedChildren={<Icon type='cross' />} onChange={this.onChange.bind(this)} />
        <div className="link-addNewQuestion">
          <Link href={`competencies/${this.props.name}`}>Add new questions</Link>
        </div>
      </div>
    );
  }
}

export default Competencies;
