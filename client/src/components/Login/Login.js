import React from 'react';
import './Login.scss';
import { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

const axios = require('../../axios');

function Login({setCurrentUser}) {
  const pseudo = useRef();
  const password = useRef();
  const history = useHistory();

  const [error, setError] = useState(false);
  const [eye, setEye] = useState(false);

  const auth = (event) => {
    event.preventDefault();

    axios({
        method: 'post',
        url: '/api/users/auth',
        data: {
          pseudo: pseudo.current.value,
          password: password.current.value
        }
    })
    .then((response) => {
      if (response.data.err) {
        typeof response.data.err === "string" ? setError(response.data.err) : console.log(response.data.err);
      }
      else {
        setCurrentUser(response.data);
        history.push("/rooms");
      }
    })
    .catch((err) => {
        if (err) setError("La connexion avec le serveur a échouée.")
    })
  }

  const seePassword = () => {
    if (password.current.type === "password") {
        password.current.type = "text";
        setEye(true);
    } else {
        password.current.type = "password";
        setEye(false);
    }
  }

  return (
    <div className="login">

    <div className="login__content">
      <h1>Connecte-toi!</h1>
      <form onSubmit={auth}>
        <label>
          <p>Pseudo</p> <input type="text" ref={pseudo} />
        </label>
        <label>
          <p>Password</p>
          <div>
          <input type="password" name="password" autoComplete="on"  ref={password} />
          <div onClick={seePassword}>{eye ? <AiFillEyeInvisible/> : <AiFillEye/>}</div>
          </div>

        </label>
        <input type="submit" value="Envoyer" />
      </form>

      {error && <div className='error'>{error}</div>}
      
      <Link to="/register">Pas encore de compte ? Inscris-toi !</Link>
    </div>


    </div>
  );
}

export default Login;