import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import Emoji from './Emoji';

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client";
//import AttachFile from "@mui/icons-material/AttachFile";

const  ENDPOINT="http://localhost:8000";
var socket,chat

function ChatArea() {
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef(null);
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  // console.log(chat_id, chat_user);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
  const[allMessagesCopy,setAllMessagesCopy]=useState([]);
 //file  share
 const [selectedFile, setSelectedFile] = useState(null);
 const [deletedChatId, setDeletedChatId] = useState(null);


 const handleFileInputChange = (event) => {
  setSelectedFile(event.target.files[0]);
};
 
  // delte  functinality

  const handleDeleteChat = (chatId) => {
  setDeletedChatId(chatId);
};

useEffect(() => {
  if (deletedChatId) {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    axios
     .delete(`http://localhost:8000/message/${deletedChatId}`, config)
     .then((response) => {
        console.log("Chat deleted successfully");
        // Update the UI to reflect the deletion of the chat
        // For example, you can remove the chat from the chat list or display a success message
        setDeletedChatId(null);
      })
     .catch((error) => {
        console.error("Error deleting chat", error);
      });
  }
}, [deletedChatId, userData.data.token]);
 


  
  const handleEmojiSelect = (emoji) => {
    setMessageContent(messageContent + emoji);
  };

  const sendFileMessage = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("chatId", chat_id);

    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    axios
    .post("http://localhost:8000/message/", formData, config)
    .then((response) => {
      setMessageContent("");
      setSelectedFile(null);
      setRefresh(!refresh);
      console.log("File message sent");
    })
    .catch((error) => {
      console.error("Error sending file message", error);
    });
  };
  
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setloaded] = useState(false);
   const[socketConnectionsStatus,setSocketConnoectionsStatus]=useState([]);
  const sendMessage = () => {
    var data=null;
    // console.log("SendMessage Fired to", chat_id._id);
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .post(
        "http://localhost:8000/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then(({ response }) => {
        data=response;
        console.log("Message Fired");
      });
  };

  //coonect  to socket
  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit("setup",userData);
    socket.on("connection",()=>{
      setSocketConnoectionsStatus(!socketConnectionsStatus);
    });
  },[]);
  //new message  recieved
  useEffect(()=>{
    socket.on("message recieved",(newMessage)=>{
      if(!allMessagesCopy || allMessagesCopy._id !==newMessage._id){

      }else{
        setAllMessages([...allMessages],newMessage);
      }
    });

  });
//fetch chats
  useEffect(() => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .get("http://localhost:8000/message/" + chat_id, config)
      .then(({ data }) => {
        setAllMessages(data);
        setloaded(true);
        socket.emit("join chat",chat_id);
        // console.log("Data from Acess Chat API ", data);
      });
      setAllMessagesCopy(allMessages)
    // scrollToBottom();
  }, [refresh, chat_id, userData.data.token,allMessages]);

  if (!loaded) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
        <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
          <p className={"con-icon" + (lightTheme ? "" : " dark")}>
            {chat_user[0]}
          </p>
          <div className={"header-text" + (lightTheme ? "" : " dark")}>
            <p className={"con-title" + (lightTheme ? "" : " dark")}>
              {chat_user}
            </p>
            
            </div>
            <IconButton
              className={"icon" + (lightTheme ? "" : " dark")}
              onClick={() => {
                handleDeleteChat(chat_id,userData);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
          <div className={"messages-container" + (lightTheme ? "" : " dark")}>
            {allMessages
              .slice(0)
              .reverse()
              .map((message, index) => {
                const sender = message.sender;
                const self_id = userData.data._id;
                if (sender._id === self_id) {
                  // console.log("I sent it ");
                  return <MessageSelf props={message} key={index} />;
                } else {
                  // console.log("Someone Sent it");
                  return <MessageOthers props={message} key={index} />;
                }
              })}
          </div>
          <div ref={messagesEndRef} className="BOTTOM" />
<div className={"text-input-area" + (lightTheme ? "" : " dark")}>
  <input
    placeholder="Type aMessage"
    className={"search-box" + (lightTheme ? "" : " dark")}
    value={messageContent}
    onChange={(e) => {
      setMessageContent(e.target.value);
    }}
    onKeyDown={(event) => {
      if (event.code === "Enter") {
        // Automatically send message when Enter key is pressed
        sendMessage();
        setMessageContent(" ");
        setRefresh(!refresh);
      }
    }}
  />
   <Emoji onEmojiSelect={handleEmojiSelect} />
   <input
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          id="file-input"
          
        />
        <label htmlFor="file-input">
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={sendFileMessage}
          >
            <AttachFileIcon/>
          </IconButton>
        </label>

  <IconButton
    className={"icon" + (lightTheme ? "" : " dark")}
    onClick={() => {
      sendMessage();
      setRefresh(!refresh);
    }}
  >
    <SendIcon />
  </IconButton>

</div>
        </div>
      );
    }

  }

  export default ChatArea;