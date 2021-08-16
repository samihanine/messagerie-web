import React from 'react';
import './Room.scss';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const axios = require('../../axios');

function Room({setCurrentRoom}) {
  const [rooms, setRooms] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getRooms();

    return () => {}
  }, [])

  const getRooms = () => {
    axios({
      method: 'get',
      url: '/api/rooms',
    })
    .then((response) => {
      if (response.data.err) console.log(response.data);
      else setRooms(response.data)
    })
    .catch((err) => {
        console.log("La connexion avec le serveur a échouée.")
    })
  }

  const DisplayRooms = () => {
    const redirectMessage = (obj) => {
      setCurrentRoom(obj);
      history.push(`/rooms/${obj.id}`);
    }

    return rooms.map((item,index)=>{
      return <div key={index} className="room" onClick={() => redirectMessage(item)}>
        <img src={item.image} alt="room-icon"/>
        <p>{item.name}</p>
      </div>
    })
  }

  return (
    <div className="rooms">
      
      <div className="rooms__all">
        <h1>Choisissez votre salon de discussion</h1>
        {rooms && <DisplayRooms />}
      </div>

    </div>
  );
}

export default Room;