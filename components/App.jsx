import React, { Component } from 'react';
import ChannelSection from './channels/ChannelSection.jsx';
import UserSection from './users/UserSection.jsx';
import MessageSection from './messages/MessageSection.jsx';
import Socket from '../socket.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
      users: [],
      messages: [],
      activeChannel: {},
      connected: false
    };
  }

  // incoming message receivers
  componentDidMount() {

    let { messages } = this.state;
    console.log('Messages: Component1', messages)
   
    let ws = new WebSocket('ws://localhost:4000')
    let socket = this.socket = new Socket(ws);
    socket.on('connect', this.onConnect.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
    socket.on('channel add', this.onAddChannel.bind(this));
    socket.on('user add', this.onAddUser.bind(this));
    socket.on('user edit', this.onEditUser.bind(this));
    socket.on('user remove', this.onRemoveUser.bind(this));
    socket.on('message add', this.onMessageAdd.bind(this));
  
    console.log('Messages: Component2', messages)
  }

//  any function with an emitter function sends data to go program api rethinkdb
//  onConnect()
//  addChannel(name)
//  setChannel(activeChannel)
//  setUserName(name)
//  addMessage(body)
//  

// function for dynamic sorting

  compareValues(key, order='asc') {
    return function(a,b) {
      if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      const varA = (typeof a[key] === 'string') ?
          a[key].toUpperCase() : a[key];

      const varB = (typeof b[key] === 'string') ?
          b[key].toUpperCase() : b[key];    

      let comparison = 0;

      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }  
      return (
        (order == 'desc') ? (comparison * -1) : comparison
      );

    };
  }

  onMessageAdd(message) {
    let { messages } = this.state;
    messages.push(message);
//   this.setState({ messages });
//   let { messages } = this.state;
    messages.sort(this.compareValues('createdAt'));
    this.setState({ messages });
    console.log('Messages: On add', messages)


  }
  onRemoveUser(removeUser) {
    let { users } = this.state;
    users = users.filter(user => {
      return user.id !== removeUser.id;
    });
    this.setState({ users });
  }
  onAddUser(user) {
    let { users } = this.state;
    users.push(user);
    this.setState({ users });
  }
  onEditUser(editUser) {
    let { users } = this.state;
    users = users.map(user => {
      if (editUser.id === user.id) {
        return editUser;
      }
      return user;
    });
    this.setState({ users });
  }
  onConnect() {
    this.setState({ connected: true });
    this.socket.emit('channel subscribe');
    this.socket.emit('user subscribe');
  }
  onDisconnect() {
    this.setState({ connected: false });
  }
  onAddChannel(channel) {
    let { channels } = this.state;
    channels.push(channel);
    this.setState({ channels });
  }
  addChannel(name) {
    this.socket.emit('channel add', { name });
  }
  setChannel(activeChannel) {
    this.setState({ activeChannel });
    this.socket.emit('message unsubscribe');
    this.setState({ messages: [] });
    this.socket.emit('message subscribe',
      { channelId: activeChannel.id });
  }
  setUserName(name) {
    this.socket.emit('user edit', { name });
  }
  addMessage(body) {
    let { activeChannel } = this.state;
    this.socket.emit('message add',
      { channelId: activeChannel.id, body });
    console.log('Messages: Component', this.messages)

  }
  render() {
    return (
      <div className='app'>
        <div className='nav'>
          <ChannelSection
            {...this.state}
            addChannel={this.addChannel.bind(this)}
            setChannel={this.setChannel.bind(this)}
          />
          <UserSection
            {...this.state}
            setUserName={this.setUserName.bind(this)}
          />
        </div>

        <MessageSection
          {...this.state}
          addMessage={this.addMessage.bind(this)}
        />

      </div>


    )
  }
}

export default App
