import React from 'react';
import './Register.scss';
import FileBase64 from 'react-file-base64';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
const axios = require('../../axios');

function Register() {
    const pseudo = useRef("");
    const password = useRef("");
    const password2 = useRef("");
    const mail = useRef("");
    const description = useRef("");

    const [error, setError] = useState(false);
    const [eye, setEye] = useState(false);

    const post = () => {
        axios({
            method: 'post',
            url: '/api/users',
            data: {
                pseudo: pseudo.current.value,
                password: password.current.value
            }
        })
        .then((response) => {
            if (response.data.err) {
                typeof response.data.err === "string" ? setError(response.data.err) : console.log(response.data.err);
            }
            else console.log(response.data);
        })
        .catch((err) => {
          if (err) setError("La connexion avec le serveur a échouée.")
        })
    }

    const check = (event) => {
        event.preventDefault();
        let msg = false;

        if (password.current.value !== password2.current.value) msg = "Les deux mots de passes ne correspondent pas.";
        if (password.current.value.length < 4) msg = "Votre mot de passe doit faire 4 charactères minimum."
        if (pseudo.current.value.length < 4) msg = "Votre pseudo doit faire 4 charactères minimum."
        
        if (!msg) post(); else setError(msg);
    }

    const seePassword = () => {
        if (password.current.type === "password") {
            password.current.type = "text";
            password2.current.type = "text";
            setEye(true);
        } else {
            password.current.type = "password";
            password2.current.type = "password";
            setEye(false);
        }
    }

    return <div className="login register">

        <div className="login__content">

        <h1>Inscris-toi !</h1>

        <form onSubmit={check}>
            <label><p>Pseudo</p> <input type="text" ref={pseudo} /></label>
            <label>
                <p>Mot de passe</p>
                <input type="password" name="password" autoComplete="on" ref={password} />
            </label>
            <label><p>Confirmer le mot de passe</p> <input type="password" name="password" autoComplete="on" ref={password2} /></label>
            <label><p>Adresse Mail</p> <input type="email" ref={mail} /></label>
            <label><p>Description</p><input type="text" ref={description} /></label>
            <input type="submit" value="Créer mon compte" />
        </form>

        {error && <div className='error'>{error}</div>}

        <Link to="/login">Tu as déjà un compte ? Connecte-toi !</Link>
        </div>


    </div>
}

export default Register;