import React, { Component } from "react"
import TextField from "@material-ui/core/TextField"
import Send from "@material-ui/icons/Send"
import styles from "./styles"
import withStyles from "@material-ui/core/styles/withStyles"
import { style } from "@material-ui/system";

class ChatTextBox extends Component{
    constructor(){
        super()
        this.state={
            chatText: ''
        }
    }

    userTyping = (e) => e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });

    messageValid = (txt) => txt && txt.replace(/\s/g, '').length;

    userClickedInput = () => this.props.messageRead();

    submitMessage = () => {
      if(this.messageValid(this.state.chatText)) {
        this.props.submitMessage(this.state.chatText);
        document.getElementById('chattextbox').value = '';
      }
    }
  

    render(){

        const { classes } =this.props;

        
        return(<div className={classes.chatTextBoxContainer}>

            <TextField id='chattextbox' 
            className= {classes.chatTextBox} 
            placeholder='Enter your message here...' 
            onFocus={this.userClickedInput} 
            onKeyUp={(e) => this.userTyping(e)}>
            </TextField>

            <Send className={classes.sendBtn} onClick={this.submitMessage} ></Send> 
        </div>)
    }
}

export default withStyles(styles)(ChatTextBox)