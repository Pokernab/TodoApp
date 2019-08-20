import React, { Component, Fragment } from 'react';

import { Redirect } from 'react-router-dom'
import * as actions from '../../store/actions/index'
import { connect } from 'react-redux';
import { updateObject, changeValueHandler, checkValid } from '../../sharedFunctions/sharedFunctions';
import AllTodo from '../../components/allTodos/allTodos';
import TodoForm from '../../components/todoForm/todoForm';
import Spinner from '../../components/UI/Spinner/Spinner';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem/'

class AllTodos extends Component {
    state = {
        cardData: {
            title: {
                elementType: 'input',
                elementConfig: {
                    label: 'Title',
                    type: 'text',
                    placeholder: 'Title'
                },
                rules: {
                    maxLength: 20,
                    required: true
                },
                select: false,
                value: '',
                valid: true,
                touched: false,
            },
            context: {
                elementType: 'textarea',
                elementConfig: {
                    label: 'Context',
                    type: 'textarea',
                    placeholder: 'context'
                },
                rules: {
                    maxLength: 100,
                    required: true
                },
                select: false,
                value: '',
                touched: false,
                valid: true,
            },
            importantcy: {
                elementType: 'checkbox',
                elementConfig: {
                    label: 'Important',
                    options: [
                        { value: 'high', displayValue: 'High' },
                        { value: 'medium', displayValue: 'Medium' },
                        { value: 'low', displayValue: 'Low' }
                    ]

                },
                rules: {
                    required: true
                },
                select: true,
                touched: false,
                value: 'high',
                valid: true,
            },
        },
        progressTodo: false,
        cardValdiation: true,
        editShow: false,
        currentEditIndex: '',
        currentValuesEdit: ''
    };

    componentDidMount() {
        const data = {
            id: this.props.id,
            token: this.props.token
        }
        this.props.onFetchOrders(data)
    }


    openEditHandler = (index, el) => {
        let titleUpdate = { ...this.state.cardData.title }
        let contextUpdate = { ...this.state.cardData.context }
        let importantUpdate = { ...this.state.cardData.importantcy }
        titleUpdate.value = this.props.allTodos[index].title
        titleUpdate.valid = checkValid(titleUpdate.rules, this.props.allTodos[index].title)
        contextUpdate.value = this.props.allTodos[index].context
        contextUpdate.valid = checkValid(contextUpdate.rules, this.props.allTodos[index].context)
        importantUpdate.value = this.props.allTodos[index].importantcy
        const updateState = updateObject(this.state.cardData, { title: titleUpdate, context: contextUpdate, importantcy: importantUpdate })
        return this.setState({ cardData: updateState, editShow: true, currentEditIndex: el.key }, () => {
            const updateValues = { ...this.state.cardData }
            const currentValuesEdit = {
                id: this.props.id,
                title: updateValues.title.value,
                context: updateValues.context.value,
                importantcy: updateValues.importantcy.value
            }
            return this.setState({ currentValuesEdit: currentValuesEdit })
        })
    };

    cancelEditHandler = () => {
        this.setState({ editShow: false });
    };

    changeHandler = (event, ele, that) => {
        let updated = () => changeValueHandler(event, ele.id, that)
        updated = updated()
        this.setState({ cardData: updated }, () => {
            if (true) {
                let updatingCurrent = { ...this.state.currentValuesEdit }
                let valid = true
                const accessToValid = { ...this.state.cardData }
                const accessToValidDeep = { ...accessToValid }
                for (let types in accessToValidDeep) {
                    updatingCurrent[types] = accessToValidDeep[types].value
                    valid = valid && accessToValidDeep[types].valid
                }
                this.setState({ cardValdiation: valid, currentValuesEdit: updatingCurrent })
            };
        });

    }
    render() {

        let allTodos = <Spinner />
        if (!this.props.loading)
            allTodos = this.props.allTodos.map((el, index) => {
                return <AllTodo
                    editClicked={() => this.openEditHandler(index, el)}
                    removeClicked={() => this.props.onRemoveTodoInit(el.key, index, this.props.token)}
                    key={el.key}
                    context={el.context}
                    title={el.title}
                    important={el.importantcy} />
            })
        if (this.props.token === null) {
            allTodos = <Redirect to='/' />
        };

        const editInputsArr = []
        for (let ele in this.state.cardData) {
            editInputsArr.push({
                id: ele,
                config: this.state.cardData[ele]
            })
        }
        const that = {
            ...this
        }
        const editInputs = editInputsArr.map((ele) => {
            return <TextField
                style={{ display: 'flex', }}
                key={ele.id}
                select={ele.config.select}
                touched={ele.config.touched.toString()}
                label={ele.config.elementConfig.label}
                type={ele.config.elementConfig.type}
                value={ele.config.value}
                onChange={(event) => this.changeHandler(event, ele, that)}>

                {ele.id === 'importantcy' ? ele.config.elementConfig.options.map(opt => {
                    return <MenuItem key={opt.value} value={opt.value}>{opt.displayValue}</MenuItem>
                }) : null}
            </TextField>
        });
        return (
            <Fragment>
                <div >
                    {this.state.editShow ?
                        <TodoForm 
                            textFields={editInputs}
                            editSend={() => this.props.onEditTodoInit(this.state.currentEditIndex, this.state.currentValuesEdit, this.props.token, this.props.id)}
                            cancelClicked={this.cancelEditHandler}
                            editText='Finish'
                            disabled={this.state.cardValdiation}
                            cancelText='Cancel'
                        />
                        : null}
                    {allTodos}
                </div>
            </Fragment>
        );
    };
}



const mapStateToProps = state => {
    return {
        id: state.authReducer.id,
        token: state.authReducer.token,
        loading: state.allTodosReducer.loading,
        fetched: state.allTodosReducer.fetched,
        allTodos: state.allTodosReducer.allTodos
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // onUpdate
        onEditTodoInit: (index, objectValues, token, id) => dispatch(actions.editTodoInit(index, objectValues, token, id)),
        onRemoveTodoInit: (el, index, token) => dispatch(actions.removeTodoInit(el, index, token)),
        onFetchOrders: (data) => dispatch(actions.fetchTodosInit(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllTodos)