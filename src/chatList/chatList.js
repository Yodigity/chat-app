import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import styles from "./styles";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import NotificationImportant from "@material-ui/icons/NotificationImportant";

class ChatList extends Component {
  newChat = () => {
    return this.props.newChatButtonClicked();
  };

  selectChat = index => {
    this.props.selectChat(index);
  };

  userIsSender = chat => {
    return (
      chat.messages[chat.messages.length - 1].sender === this.props.userEmail
    );
  };

  render() {
    const { classes } = this.props;

    if (this.props.chats.length > 0) {
      return (
        <main className={classes.root}>
          <Button
            variant='contained'
            fullWidth
            onClick={this.newChat}
            color='primary'
            className={classes.newChatBtn}
          >
            New Message
          </Button>

          <List>
            {this.props.chats.map((_chat, index) => {
              return (
                <div key={index}>
                  <ListItem
                    onClick={() => this.selectChat(index)}
                    className={classes.listItem}
                    selected={this.props.selectedChatIndex === index}
                    alignItems='flex-start'
                  >
                    <ListItemAvatar>
                      <Avatar alt='Remy Sharp'>
                        {
                          _chat.users
                            .filter(_user => _user !== this.props.userEmail)[0]
                            .split("")[0]
                        }
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        _chat.users.filter(
                          _user => _user !== this.props.userEmail
                        )[0]
                      }
                      secondary={
                        <React.Fragment>
                          <Typography component='span' color='textPrimary'>
                            {_chat.messages[
                              _chat.messages.length - 1
                            ].message.substring(0, 30) + " ..."}
                          </Typography>
                        </React.Fragment>
                      }
                    />

                    {_chat.receiverHasRead === false &&
                    this.userIsSender(_chat) ? (
                      <ListItemIcon>
                        <NotificationImportant
                          className={classes.unreadmessage}
                        ></NotificationImportant>
                      </ListItemIcon>
                    ) : null}
                  </ListItem>
                  <Divider></Divider>
                </div>
              );
            })}
          </List>
        </main>
      );
    } else {
      return (
        <main className={classes.root}>
          <Button
            variant='contained'
            fullWidth
            onClick={this.newChat}
            color='primary'
            className={classes.newChatBtn}
          >
            New Message
          </Button>
          <List></List>
        </main>
      );
    }
  }
}

export default withStyles(styles)(ChatList);
