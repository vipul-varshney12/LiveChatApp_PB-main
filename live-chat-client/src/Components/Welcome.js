import React, { useEffect } from "react";
import logo from "../Images/live-chat_512px.png";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
//import Boat from "./Boat";
//import Chatbot from "react-chatbot-kit";
import  "./myStyles.css"
function Welcome() {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }
  
    
  return (
    <div className={"welcome-container" + (lightTheme ? "" : " dark")}>
   <h2 className="head">profile  section</h2>
      <motion.img
        drag
        whileTap={{ scale: 1.05, rotate: 320 }}
        src={logo}
        alt="Logo"
        className="welcome-logo"
      />
       

      <b>Hi , {userData.data.name} 👋</b>
      <b> {userData.data.email} </b>
      <p>View and text directly to people present in the chat Rooms.</p>
     
    </div>
    
  );
}

export default Welcome;
