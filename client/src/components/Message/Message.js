import React from 'react';
import socketClient from "socket.io-client";
import { useRef, useEffect, useState } from 'react';
import './Message.scss';
import { MdSend } from 'react-icons/md';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';


const axios = require('../../axios');
let socket;
const SERVER = "http://127.0.0.1:8080";
let typing = false;

function Message({ currentRoom, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const input = useRef(null);
  const all_messages = useRef(null);
  const history = useHistory();
  let timeout = undefined;

  useEffect(() => {
    get_all_messages();

    socket = socketClient(SERVER);
    socket.emit("join-room", {room_id: currentRoom.id, user_id: currentUser.id});

    socket.on('get-message', (msg) =>{
      setMessages(messages => [...messages, msg]);
      scroll();
    });

    socket.on('users-in-room', (tab) =>{
      console.log(tab)
      setUsersOnline(tab);
    });
    
    return () => {
      socket.emit('forceDisconnect');
    }
  }, [])

  const getUser = (id) => {
    const obj = usersData.find((user) => user.id === id);
    if (obj) return obj;

    axios({
      method: 'get',
      url: `/api/users/${id}`
    })
    .then((response) => {
      if (response.err) console.log(response.err);
      else setUsersData(usersData => [...usersData, response.data])
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const post_message = (event) => {
    event.preventDefault();

    input.current.value = input.current.value.trim();
    if (input.current.value === "") return;
    const obj = {text: input.current.value, room_id: currentRoom.id, user_id: currentUser.id, creation_date: new Date()};

    socket.emit('post-message', obj);

    axios({
      method: 'post',
      url: '/api/messages',
      data: obj
    })
    .catch((err) => { console.log(err) })

    stopTyping();
    input.current.value = "";
  }

  const get_all_messages = () => {
    axios({
      method: 'get',
      url: `/api/messages/${currentRoom.id}`
    })
    .then((response) => {
      setMessages(response.data);
      scroll();
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const DisplayMessages = () => {
    return messages.map((item,index)=> {
      const user = getUser(item.user_id);
      const me = item.user_id === currentUser.id;
      const img = user?.image || "https://img.icons8.com/ios-filled/500/000000/anonymous-mask.png";
      const pseudo = user?.pseudo || "";

      return <div className={`msg ${me ? "msg--me" : ""}`} key={index}>

        <img className="user" src={img} alt="user-icon"/>

        <div className="msg__content">
          <div className="msg__content__info">
            <p className="pseudo">{pseudo}</p>
            <p className="date">{format_date(item.creation_date)}</p>
          </div>
          <p className="msg__content__text">{item.text}</p>
        </div>
      </div>
    })
  }

  const DisplayUsers = () => {
    return usersOnline.map((item,index)=> {
      const user = getUser(item.user_id);
      
      if (user) {
        let color = (user.id === currentUser.id) ? "#1DB3DA" : "black"

        return <div className="online" key={index}>
        <img className="user" src={user.image} alt="user-icon"/>
        <p style={{color: color}} className="online__pseudo">{user.pseudo}</p>

        {item.isTyping && <p className="online__typing">est en train d'écrire...</p>}
        </div>
      }
      return null;
    })
  }

  const stopTyping = () => {
    if (typing) {
      typing = false;
      socket.emit("user-typing", {isTyping: false, user_id: currentUser.id, room_id: currentRoom.id});
    }
  }
  
  const startTyping = () => {
    if(!typing) {
      typing = true;
      socket.emit("user-typing", {isTyping: true, user_id: currentUser.id, room_id: currentRoom.id});
      timeout = setTimeout(stopTyping, 3000);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(stopTyping, 3000);
    }
  }

  const scroll = () => {
    const element = all_messages.current;
    if (element) element.scrollTop = element.scrollHeight;
  }

  return (
    <div className="message">

      <div className="message__body">

        <div className="message__body__header">

        <IoArrowBackOutline onClick={() => history.push("/rooms")} />

          <div>
            <img src={currentRoom.image} alt="room icon" />

            <h1>{currentRoom.name}</h1>

            <p>{currentRoom.description}</p>
          </div>

        </div>

        <div ref={all_messages} className="message__body__content">
          <DisplayMessages />
        </div>
        
        <form className="message__body__form" onSubmit={post_message}>
          <input className="message__body__form__text" type='text' onChange={startTyping} ref={input} />
          <button className="message__body__form__button" type="submit" value="Envoyer">
            <MdSend />
          </button>
        </form>

      </div>

      <div className="message__users">
        <p>Utilisateurs connectés</p>
        <DisplayUsers />
      </div>


    </div>
  );
}

const format_date = (d) => {
  d = d.substr(5, 11);
  d = d.replace("-","/");
  d = d.replace("T"," ");
  return d;
}

export default Message;