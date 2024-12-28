import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import logo from "../Images/live-chat_512px.png";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";

function Groups() {
  const { refresh, setRefresh } = useContext(myContext);
  const lightTheme = useSelector((state) => state.themeKey);
  const [groups, SetGroups] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();

  if (!userData) {
    console.log("User not Authenticated");
    nav(-1);
  }

  const user = userData.data;

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get("http://localhost:8000/chat/fetchGroups", config)
      .then((response) => {
        SetGroups(response.data);
      });
  }, [refresh]);

  return (
    <>
      <style>
        {`
          .list-container {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .ug-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            border-bottom: 1px solid var(--border-color);
          }
          .ug-title {
            font-size: 1.5rem;
            margin: 0;
            flex-grow: 1;
            text-align: center;
          }
          .sb-search {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
          }
          .search-box {
            flex-grow: 1;
            padding: 8px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
          }
          .ug-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          .list-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .list-item.dark {
            background-color: #333;
            color: #fff;
          }
          .list-item:hover {
            box-shadow: 0 4px 10px rgba(192, 34, 34, 0.2);
          }
          .group-outline {
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
          }
          .group-circle {
            background-color: #CCE1FC;
            color: black;
            font-weight: bold;
            font-size: 1.2rem;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .con-title {
            font-size: 1rem;
          }
        `}
      </style>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: "0.3" }}
          className="list-container"
        >
          <div className={`ug-header${lightTheme ? "" : " dark"}`}>
            <img
              src={logo}
              style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
            />
            <p className={`ug-title${lightTheme ? "" : " dark"}`}>
              Available Groups
            </p>
            <IconButton
              className={`icon${lightTheme ? "" : " dark"}`}
              onClick={() => {
                setRefresh(!refresh);
              }}
            >
              <RefreshIcon />
            </IconButton>
          </div>
          <div className={`sb-search${lightTheme ? "" : " dark"}`}>
            <IconButton className={`icon${lightTheme ? "" : " dark"}`}>
              <SearchIcon />
            </IconButton>
            <input
              placeholder="Search"
              className={`search-box${lightTheme ? "" : " dark"}`}
            />
          </div>
          <div className="ug-list">
            {groups.map((group, index) => {
              return (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`list-item${lightTheme ? "" : " dark"}`}
                  key={index}
                  onClick={() => {
                    const config = {
                      headers: {
                        Authorization: `Bearer ${userData.data.token}`,
                      },
                    };
                    axios
                      .put(
                        "http://localhost:8000/chat/addSelfToGroup",
                        {
                          chatId: group._id,
                          userId: userData.data._id,
                        },
                        config
                      )
                      .then(() => {
                        setRefresh(!refresh);
                      });
                  }}
                >
                  <div className="group-outline">
                    <p className="group-circle">{group.chatName.charAt(0)}</p>
                  </div>
                  <p className={`con-title${lightTheme ? "" : " dark"}`}>
                    {group.chatName}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default Groups;
