import React, {Component} from 'react';
import {Widget, addResponseMessage } from 'react-chat-widget';
import axios from 'axios';

import 'react-chat-widget/lib/styles.css';


export class Chat extends Component {
  componentDidMount() {
    addResponseMessage('Welcome back Dear User!');
  }

  handleNewUserMessage = message => {
    axios.post('http://localhost:5050/chat',{message}).then((res)=>{
        if(res.status===200){
            addResponseMessage(res.data.response);
        }
    }).catch((err)=>{
        alert(err)
    })
  };
  render() {
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          title="ChatBot"
          subtitle="AI-Powered"
          emojis={true}
        />
      </div>
    );
  }
}
