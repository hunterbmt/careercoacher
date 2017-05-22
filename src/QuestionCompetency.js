import React, { Component } from 'react';
import { Form, Layout, Button, Input, Select, Row, Col, Modal, Table, Icon } from 'antd';
import { getData, insert, update, database, getLastIndex } from './firebase';
import _ from 'lodash';
import Loading from './Loading';
import QuestionInput from './QuestionInput';
import Scale from './Scale';
import ReactDOM from 'react-dom';
import logo from './logo.png';
const FormItem = Form.Item;

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
            lastId: 0,
            selectedIndex: 0,
            dataQuestion: [],
            questionDataDetail: {},
            loading: true,
            keyUpdate: 0,
            typeEdit: '',
            questionEdit: '',
            hintEdit: '',
            answer1Edit: '',
            answer2Edit: '',
            answer3Edit: '',
            answer4Edit: '',
            answer5Edit: '',
            showDeletePopup: false,
            indexSource: []

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
        this.handleChangeAnswer1 = this.handleChangeAnswer1.bind(this);
        this.handleChangeAnswer2 = this.handleChangeAnswer2.bind(this);
        this.handleChangeAnswer3 = this.handleChangeAnswer3.bind(this);
        this.handleChangeAnswer4 = this.handleChangeAnswer4.bind(this);
        this.handleChangeAnswer5 = this.handleChangeAnswer5.bind(this);
        this.handleChangeHint = this.handleChangeHint.bind(this);

        this.handleEditQuestion = this.handleEditQuestion.bind(this);
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


    saveOptionQuestion(lastIndex) {
        this.setState({ lastId: parseInt(lastIndex) + 1 })
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
        let newData = {
            "desc": this.state.question,
            "hint": this.state.hint,
            "options": [this.state.answer1, this.state.answer2, this.state.answer3, this.state.answer4, this.state.answer5],
            "type": this.state.selectValue
        }
        update(`competencies1/${option}/${this.props.index}/questions/${this.state.lastId}`, newData);
    }

    saveOptionIdIncrement() {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
        getLastIndex(`competencies1/${option}/${this.props.index}/questions`).then((lastIndex) => this.saveOptionQuestion(lastIndex))
    }

    saveOthersQuestion(lastIndex) {
        this.setState({ lastId: parseInt(lastIndex) + 1 })
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
        let newDataOthers = {
            "desc": this.state.question,
            "hint": this.state.hint,
            "type": this.state.selectValue
        }
        update(`competencies1/${option}/${this.props.index}/questions/${this.state.lastId}`, newDataOthers);
    }

    saveOthersIdIncrement() {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
        getLastIndex(`competencies1/${option}/${this.props.index}/questions`).then((lastIndex) => this.saveOthersQuestion(lastIndex))
    }


    saveQuestion(type) {
        if (type === 'option') {
            this.saveOptionIdIncrement()
        } else {
            this.saveOthersIdIncrement();
        }
    }


    componentWillMount() {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
        getData(`competencies1/${option}/${this.props.index}/questions`)
            .then((data) => this.setState({
                dataQuestion: _.filter(data, function (o) { return _.isObject(o) }),
                loading: false
            })
            )

    }


    componentDidMount() {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
            getData(`competencies1/${option}/${this.props.index}/questions`)
            .then((data) => console.log(Object.keys(data)))

    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleSave = (e) => {
        this.saveQuestion(this.state.selectValue);
        this.setState({
            visible: false,

        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }


    editOptionQuestion() {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
        let newDataOption = {
            "desc": this.state.questionEdit,
            "hint": this.state.hintEdit,
            "options": [this.state.answer1Edit, this.state.answer2Edit, this.state.answer3Edit, this.state.answer4Edit, this.state.answer5Edit],
            "type": this.state.typeEdit
        }
        update(`competencies1/${option}/${this.props.index}/questions/${this.state.keyUpdate}`, newDataOption);
    }

    editOthersQuestion() {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
        let newDataOthers = {
            "desc": this.state.questionEdit,
            "hint": this.state.hintEdit,
            "type": this.state.typeEdit
        }
        update(`competencies1/${option}/${this.props.index}/questions/${this.state.keyUpdate}`, newDataOthers);
    }

    editQuestion(type) {
        if (type === 'option') {
            this.editOptionQuestion();
        } else {
            this.editOthersQuestion();
        }
    }


    deleteQuestion() {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
        update(`competencies1/${option}/${this.props.index}/questions/${this.state.keyDelete}`, null);
    }


    handleEdit = (e) => {
        this.editQuestion(this.state.typeEdit);
        this.setState({
            showEditPopup: false,
        });
    }

    handleEditCancel = (e) => {
        this.setState({
            showEditPopup: false,
        });
    }

    handleDeleteSave = (e) => {
        this.deleteQuestion();
        this.setState({
            showDeletePopup: false
        });

    }

    handleDeleteCancel = (e) => {
        this.setState({
            showEditPopup: false,
        });
    }

    handleEditQuestion = (e) => {
        this.setState({ questionEdit: e.target.value });

    }

    handleEditAnswer1 = (e) => {
        this.setState({ answer1Edit: e.target.value })
    }

    handleEditAnswer2 = (e) => {
        this.setState({ answer2Edit: e.target.value })
    }

    handleEditAnswer3 = (e) => {
        this.setState({ answer3Edit: e.target.value })
    }

    handleEditAnswer4 = (e) => {
        this.setState({ answer4Edit: e.target.value })
    }

    handleEditAnswer5 = (e) => {
        this.setState({ answer5Edit: e.target.value })
    }

    handleEditHint = (e) => {
        this.setState({ hintEdit: e.target.value })
    }

    optionQuestionType(type) {
        if (type === "option") {
            return (
                <div>
                    <h3>Question</h3>
                    <Input type="textarea" value={this.state.question} onChange={this.handleChangeQuestion} />
                    <h3>Hint question</h3>
                    <Input type="textarea" value={this.state.hint} onChange={this.handleChangeHint} />
                    <h3>First answer :</h3>
                    <Input type="textarea" value={this.state.answer1} onChange={this.handleChangeAnswer1} />
                    <h3>Second answer :</h3>
                    <Input type="textarea" value={this.state.answer2} onChange={this.handleChangeAnswer2} />
                    <h3>Third answer :</h3>
                    <Input type="textarea" value={this.state.answer3} onChange={this.handleChangeAnswer3} />
                    <h3>Fourth answer :</h3>
                    <Input type="textarea" value={this.state.answer4} onChange={this.handleChangeAnswer4} />
                    <h3>Other answer :</h3>
                    <Input type="textarea" value={this.state.answer5} onChange={this.handleChangeAnswer5} />
                </div>
            );
        } else {
            return (
                <div>
                    <h3>Question</h3>
                    <Input type="textarea" value={this.state.question} onChange={this.handleChangeQuestion} />
                    <h3>Hint question</h3>
                    <Input type="textarea" value={this.state.hint} onChange={this.handleChangeHint} />
                </div>
            );
        }
    }

    getColumns() {
        let columns = [{
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
                    <a onClick={() => this.onSelectedDeleteQuestion(record.no)}>Delete</a>
                </span>
            ),
        }];
        return columns
    }

    onSelectedDeleteQuestion(index) {
        let realIndex = index - 1;
        this.setState({
            keyDelete: realIndex,
            showDeletePopup: true
        });
    }

    onSelectQuestion(index) {
        let realIndex = index - 1;
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional';
        getData(`competencies1/${option}/${this.props.index}/questions/${realIndex}`)
            .then((detailQuestionData) => this.setState({
                questionDataDetail: detailQuestionData,
                keyUpdate: realIndex,
                typeEdit: detailQuestionData.type,
                showEditPopup: true
            }));
    }

    renderOptionQuestionType(detailQuestion) {
        if (detailQuestion.type === "option") {
            return (
                <div>
                    <h3>Question</h3>
                    <Input type="textarea" defaultValue={detailQuestion.desc} onChange={this.handleEditQuestion} />
                    <h3>Hint question</h3>
                    <Input type="textarea" defaultValue={detailQuestion.hint} onChange={this.handleEditHint} />
                    <h3>First answer :</h3>
                    <Input type="textarea" defaultValue={_.nth(detailQuestion.options, 0)} onChange={this.handleEditAnswer1} />
                    <h3>Second answer :</h3>
                    <Input type="textarea" defaultValue={_.nth(detailQuestion.options, 1)} onChange={this.handleEditAnswer2} />
                    <h3>Third answer :</h3>
                    <Input type="textarea" defaultValue={_.nth(detailQuestion.options, 2)} onChange={this.handleEditAnswer3} />
                    <h3>Fourth answer :</h3>
                    <Input type="textarea" defaultValue={_.nth(detailQuestion.options, 3)} onChange={this.handleEditAnswer4} />
                    <h3>Other answer :</h3>
                    <Input type="textarea" defaultValue={_.nth(detailQuestion.options, 4)} onChange={this.handleEditAnswer5} />
                </div>
            );
        } else {
            return (
                <div>
                    <h3>Question</h3>
                    <Input type="textarea" defaultValue={detailQuestion.desc} onChange={this.handleEditQuestion} />
                    <h3>Hint question</h3>
                    <Input type="textarea" defaultValue={detailQuestion.hint} onChange={this.handleEditHint} />
                </div>
            );
        }
    }

    getDataSouce() {
        let dataSource = [];
        _.forEach(this.state.dataQuestion, (item,key) => {
            const object = {
            no: key +1,
            question : item.desc
        }
        dataSource.push(object);
        })
        return dataSource;
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
                        <Col>
                            <Button type="primary" onClick={this.showModal}>Add new question</Button>
                        </Col>
                    </Row>
                </Header>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={8}></Col>
                    <Col span={8}>
                    </Col>
                    <Col span={8}>
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
                        <Modal title="Delete question" visible={this.state.showDeletePopup}
                            onOk={this.handleDeleteSave} onCancel={this.handleDeleteCancel}>
                            <h3>Do you sure to delete this question</h3>
                        </Modal>
                    </Col>
                </Row>
                <Row style={{ margin: 100 }}>
                    <Col><Table columns={this.getColumns()} dataSource={this.getDataSouce()} /></Col>
                </Row>
            </Layout>

        );
    }
}


export default QuestionCompetency;
