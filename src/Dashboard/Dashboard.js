import React, { Component } from "react";
import ChatList from "../chatList/chatList";
import ChatView from "../chatView/chatView";
import ChatTextBox from "../chatTextBox/chatTextBox";
import { async } from "q";
import { Button, withStyles } from "@material-ui/core";
import styles from "./styles";
import NewChat from "../newChat/newChat";
const firebase = require("firebase");

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      friends: [],
      chats: [],
    };
  }

  componentDidMount = () =>
    firebase.auth().onAuthStateChanged(async (_usr) => {
      if (!_usr) {
        this.props.history.push("/login");
      } else {
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _usr.email)
          .get(async (res) => {
            console.log(res.docs);
            const chats = res.docs.map((_doc) => _doc.data());
            await this.setState({
              email: _usr.email,
              chats: chats,
            });
            console.log(this.state);
          });
      }
    });

  newChatButtonClicked = () => {
    this.setState({
      newChatFormVisible: true,
      selectedChat: null,
    });
  };

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    this.messageRead();
  };

  signOut = () => firebase.auth().signOut();

  clickedChatWhereNotSender = (chatIndex) => {
    return (
      this.state.chats[chatIndex].messages[
        this.state.chats[chatIndex].messages.length - 1
      ].sender !== this.state.email
    );
  };

  messageRead = () => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );

    if (this.clickedChatWhereNotSender(this.state.selectedChat)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
    }
  };

  goToChat = async (docKey, msg) => {
    const usersInChat = docKey.split(":");

    const chat = this.state.chats.find((_chat) =>
      usersInChat.every((_user) => chat.users.includes(_user))
    );
    this.setState({ newChatFormVisible: false });
    await this.selectChat(this.state.chats.indexOf(chat));
    this.submitMessage(msg);
  };

  newChatSubmit = async (chatObj) => {
    const docKey = this.buildDocKey(chatObj.sentTo);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        messages: [
          {
            message: chatObj.message,
            sender: this.state.email,
          },
        ],
        receiverHasRead: false,
        users: [this.state.email, chatObj.sentTo],
      });
    this.setState({ newChatFormVisible: false });
    this.selectChat(this.state.chats.length - 1);
  };

  submitMessage = (msg) => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );

    console.log(docKey);
    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now(),
        }),
        receiverHasRead: false,
      });
  };

  buildDocKey = (friend) => [this.state.email, friend].sort().join(", ");

  render() {
    const { classes } = this.props;
    return (
      <>
        <ChatList
          history={this.props.history}
          newChatButtonClicked={this.newChatButtonClicked}
          selectChat={this.selectChat}
          chats={this.state.chats}
          userEmail={this.state.email}
          selectedChatIndex={this.state.selectedChat}
        ></ChatList>

        {this.state.selectedChat !== null && !this.state.newChatFormVisible ? (
          <ChatTextBox
            submitMessage={this.submitMessage}
            messageRead={this.messageRead}
          ></ChatTextBox>
        ) : null}

        {this.state.newChatFormVisible ? (
          <NewChat
            goToChat={this.goToChat}
            newChatSubmit={this.newChatSubmit}
          />
        ) : null}

        <Button className={classes.signOutBtn} onClick={this.signOut}>
          Sign Out
        </Button>
        {this.state.newChatFormVisible ? null : (
          <ChatView
            user={this.state.email}
            chat={this.state.chats[this.state.selectedChat]}
            selectedChat={this.state.selectedChat}
          />
        )}
      </>
    );
  }
}

export default withStyles(styles)(Dashboard);
