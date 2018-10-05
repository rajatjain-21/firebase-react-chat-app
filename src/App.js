import React, { Component } from 'react';
import { TextField, List, ListItem, ListItemText } from '@material-ui/core';
import firebase from 'firebase';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {text:"", messages:[]}
  }

  componentDidMount() {
    var config = {
      apiKey: "AIzaSyD2bXnKlxFMD9ZaZgu2yL-Xc3M5YtZ3i6c",
      authDomain: "fir-chat-app-bfb9a.firebaseapp.com",
      databaseURL: "https://fir-chat-app-bfb9a.firebaseio.com",
      projectId: "fir-chat-app-bfb9a",
      storageBucket: "fir-chat-app-bfb9a.appspot.com",
      messagingSenderId: "709040718060"
    };
    firebase.initializeApp(config);
    this.getMessages();
  }

  onSubmit = (event) => {
    if(event.charCode === 13 && this.state.text.trim() !=="") {
      this.writeMessageToDB(this.state.text);
      this.setState({text: ""})
    }
  }

  writeMessageToDB = (message) => {
    firebase
    .database()
    .ref("messages/")
    .push({
      text: message
    })
  }

  getMessages = () => {
    var messageDB = firebase.database().ref("messages/").limitToLast(500);
    messageDB.on("value", snapshot => {
      let newMessages = []
      snapshot.forEach(child => {
        var message = child.val();
        newMessages.push({id: child.key, text: message.text})
      })
      this.setState({messages: newMessages, loading: false})
      this.bottomSpan.scrollIntoView({behavior: "smooth"})
    })
  }
  
  renderMessages = () => {
    return this.state.messages.map((message) =>
      <ListItem>
        <ListItemText 
          style={{ wordBreak: "break-word" }}
          primary={ message.text }
        >
          {message.text}
        </ListItemText>
      </ListItem>
    )
  }

  render() {
    return (
      <div className="App">
        <List>
          {this.renderMessages()};
        </List>
        <TextField
          autoFocus={true}
          multiline={true}
          fullWidth={true}
          rowsMax={3}
          placeholder="Type Something.."
          onChange={ event => this.setState({text: event.target.value})}
          value={this.state.text}
          onKeyPress={this.onSubmit}
        />
        <span ref={el=>(this.bottomSpan=el)} />
      </div>
    );
  }
}

export default App;
