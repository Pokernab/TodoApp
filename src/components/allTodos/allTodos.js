import React from 'react';

import SendButton from '../UI/Buttons/sendButton/sendButton'

const allTodos = (props) => {
    //important -> Coloring title by importantcy
    let important = 'green'
    if (props.important === 'high') {
        important = 'red';
    }
    if (props.important === 'medium') {
        important = 'yellow';
    }
    return <div style={{width: '50%'}}> 
        <strong style={{color: important}}>{props.title} -</strong>
        <div style={{wordWrap: "break-word"}}>{props.context}</div>
            <ul style={{textAlign: 'end'}}>
            <SendButton
            size='small'
            clicked={props.removeClicked}
            type="secondary"
            disabled={true}>
            Delete
                    </SendButton>
        <SendButton
            clicked={props.editClicked}
            size='small'
            type="primary"
            disabled={true}>
            Edit
            </SendButton>
            </ul>
            <hr/>
    </div>
}

export default allTodos