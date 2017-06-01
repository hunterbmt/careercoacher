import React, { Component } from 'react'
import { Layout, Button, Row, Col, Modal, Table, Card, message } from 'antd'
import { getData, update, getLastIndex } from './firebase'
import _ from 'lodash'
import Loading from './Loading'
import CreateQuestionCompetencyForm from './CreateQuestionCompetencyForm'
import EditQuestionCompetencyForm from './EditQuestionCompetencyForm'
import logo from './logo.png'
const { Header } = Layout

class QuestionCompetency extends Component {

    constructor(props) {
        super(props)
        this.state = {
            visibleEdit: false,
            showEditPopup: false,
            visible: false,
            selectValue: 'scale',
            loading: true,
            showDeletePopup: false
        }
    }

    onChangeOption = (value) => {
        this.setState({ option: value })
    }


    componentWillMount() {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional'
        getData(`competencies/${option}/${this.props.index}/questions`)
            .then((data) => this.setState({
                dataQuestion: _.filter(data, (o) => _.isObject(o)),
                loading: false
            }))
    }

    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    handleSave = (e) => {
        this.saveQuestion(this.state.selectValue)
        this.setState({
            visible: false,

        })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }

    saveOptionQuestion(lastIndex, question, hint, selectedoption, answer1, answer2, answer3, answer4, answer5) {
        let lastId = parseInt(lastIndex, 10) + 1
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional'
        let newData = {
            "id": lastId,
            "desc": question,
            "hint": hint,
            "options": [answer1, answer2, answer3, answer4, answer5],
            "type": selectedoption
        }

        let newDataQuestion = this.state.dataQuestion
        newDataQuestion.push(newData)
        this.setState({
            dataQuestion: newDataQuestion
        })
        message.success("Create question successfully", 3)
        update(`competencies/${option}/${this.props.index}/questions/${lastId}`, newData)
    }

    saveOptionIdIncrement(question, hint, selectedoption, answer1, answer2, answer3, answer4, answer5) {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional'
        getLastIndex(`competencies/${option}/${this.props.index}/questions`).then((lastIndex) =>
            this.saveOptionQuestion(lastIndex, question, hint, selectedoption, answer1, answer2, answer3, answer4, answer5))
    }

    saveOthersQuestion(lastIndex, question, hint, selectedoption) {
        let lastId = parseInt(lastIndex, 10) + 1
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional'
        let newDataOthers = {
            "id": lastId,
            "desc": question,
            "hint": hint,
            "type": selectedoption
        }

        let newDataQuestion = this.state.dataQuestion
        newDataQuestion.push(newDataOthers)
        this.setState({
            dataQuestion: newDataQuestion
        })

        message.success("Create question successfully", 3)
        update(`competencies/${option}/${this.props.index}/questions/${lastId}`, newDataOthers)
    }

    saveOthersIdIncrement(question, hint, selectedoption) {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional'
        getLastIndex(`competencies/${option}/${this.props.index}/questions`).then((lastIndex) => this.saveOthersQuestion(lastIndex, question, hint, selectedoption))
    }

    editOptionQuestion(question, hint, answer1, answer2, answer3, answer4, answer5) {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional'
        let newDataOption = {
            "id": this.state.keyUpdate,
            "desc": question,
            "hint": hint,
            "options": [answer1, answer2, answer3, answer4, answer5],
            "type": this.state.typeEdit
        }
        _.merge((_.find(this.state.dataQuestion, this.state.dataQuestion[this.state.keyUpdate])), newDataOption)
        this.setState({
            dataQuestion: this.state.dataQuestion
        })
        message.success("update question successfully", 3)
        update(`competencies/${option}/${this.props.index}/questions/${this.state.keyUpdate}`, newDataOption)
    }

    editOthersQuestion(question, hint) {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional'
        let newDataOthers = {
            "id": this.state.keyUpdate,
            "desc": question,
            "hint": hint,
            "type": this.state.typeEdit
        }
        _.merge((_.find(this.state.dataQuestion, this.state.dataQuestion[this.state.keyUpdate])), newDataOthers)
        this.setState({
            dataQuestion: this.state.dataQuestion
        })
        message.success("update question successfully", 3)
        update(`competencies/${option}/${this.props.index}/questions/${this.state.keyUpdate}`, newDataOthers)
    }

    editQuestionFormRef = (form) => {
        this.setState({
            editQuestionFormRef: form
        })
    }

    handleEdit = () => {
        const form = this.state.editQuestionFormRef
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            if (_.isEqual(this.state.typeEdit, 'option')) {
                this.editOptionQuestion(values.questionEdit, values.hintQuestionEdit, values.answer1Edit, values.answer2Edit, values.answer3Edit, values.answer4Edit, values.answer5Edit)
            } else {
                this.editOthersQuestion(values.questionEdit, values.hintQuestionEdit)
            }
            form.resetFields()
            this.setState({ showEditPopup: false })
        })
    }

    handleEditCancel = (e) => {
        this.setState({
            showEditPopup: false,
        })
    }

    deleteQuestion() {
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional'

        _.remove(this.state.dataQuestion, this.state.dataQuestion[this.state.keyDelete])
        this.setState({
            dataQuestion: this.state.dataQuestion
        })

        update(`competencies/${option}/${this.props.index}/questions/${this.state.keyDelete}`, null)
    }


    handleDeleteSave = (e) => {
        this.deleteQuestion()
        this.setState({
            showDeletePopup: false
        })

    }

    handleDeleteCancel = (e) => {
        this.setState({
            showDeletePopup: false,
        })
    }

    getColumns() {
        const columns = [{
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
        }]
        return columns
    }

    getDataSouce(indexData) {
        let dataSource = []
        _.forEach(this.state.dataQuestion, (item) => {
            const dataPushTable = {
                no: item.id + 1,
                question: item.desc
            }
            dataSource.push(dataPushTable)
        })
        return dataSource
    }

    onSelectedDeleteQuestion(index) {
        let realIndex = index - 1
        this.setState({
            keyDelete: realIndex,
            showDeletePopup: true
        })
    }

    onSelectQuestion(index) {
        let realIndex = index - 1
        const option = (this.props.option === 'core') ? 'Kms_core' : 'Kms_optional'
        getData(`competencies/${option}/${this.props.index}/questions/${realIndex}`)
            .then((detailQuestionData) => this.setState({
                questionDataDetail: detailQuestionData,
                keyUpdate: realIndex,
                typeEdit: detailQuestionData.type,
                questionEdit: detailQuestionData.desc,
                questionHintEdit: detailQuestionData.hint,
                answer1Edit: _.nth(detailQuestionData.options, 0),
                answer2Edit: _.nth(detailQuestionData.options, 1),
                answer3Edit: _.nth(detailQuestionData.options, 2),
                answer4Edit: _.nth(detailQuestionData.options, 3),
                answer5Edit: _.nth(detailQuestionData.options, 4),
                showEditPopup: true,
            }))
    }

    createQuestionFormRef = (form) => {
        this.setState({
            createQuestionFormRef: form
        })
    }

    handleCreate = () => {
        const form = this.state.createQuestionFormRef
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            if (_.isEqual(values.questionOption, 'option')) {
                this.saveOptionIdIncrement(values.question, values.hintQuestion, values.questionOption, values.answer1, values.answer2, values.answer3, values.answer4, values.answer5)
            } else {
                this.saveOthersIdIncrement(values.question, values.hintQuestion, values.questionOption)
            }
            form.resetFields()
            this.setState({ visible: false })
        })
    }

    render() {
        if (this.state.loading) return <div style={{ height: 600 }}><Loading /> </div>
        return (
            <Layout style={{ height: '100%' }}>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <Row type='flex' justify='space-between' style={{ height: '100%' }}>
                        <Col span={4}>
                            <img alt='logo' src={logo} style={{ height: 64, padding: 10 }} />
                        </Col>
                        <Col>
                            <Button type="primary" onClick={this.showModal}>Add new question</Button>
                            <CreateQuestionCompetencyForm
                                ref={this.createQuestionFormRef}
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                onCreate={this.handleCreate}
                                onChangeOption={this.onChangeOption}
                                option={this.state.option}
                            />
                        </Col>
                    </Row>
                </Header>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={8}></Col>
                    <Col span={8}>
                        <EditQuestionCompetencyForm
                            ref={this.editQuestionFormRef}
                            visible={this.state.showEditPopup}
                            onCancel={this.handleEditCancel}
                            onCreate={this.handleEdit}
                            option={this.state.typeEdit}
                            questionEdit={this.state.questionEdit}
                            hintEdit={this.state.questionHintEdit}
                            answer1Edit={this.state.answer1Edit}
                            answer2Edit={this.state.answer2Edit}
                            answer3Edit={this.state.answer3Edit}
                            answer4Edit={this.state.answer4Edit}
                            answer5Edit={this.state.answer5Edit}
                        />
                    </Col>
                    <Col span={8}>
                        <Modal title="Delete question" visible={this.state.showDeletePopup}
                            onOk={this.handleDeleteSave} onCancel={this.handleDeleteCancel}>
                            <h3>Do you sure to delete this question</h3>
                        </Modal>
                    </Col>
                </Row>
                <Row style={{ margin: 100 }}>
                    <Col>
                        <Card>
                            <Table columns={this.getColumns()} dataSource={this.getDataSouce()} style={{whiteSpace: 'pre-wrap'}}/>
                        </Card>
                    </Col>
                </Row>
            </Layout>

        )
    }
}


export default QuestionCompetency
