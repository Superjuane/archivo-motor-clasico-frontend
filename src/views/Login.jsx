import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')


  const navigate = useNavigate()

  const onButtonClick = () => {
    function login(username, password) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                "username":username, 
                "password":password 
            })
        };
    
        return fetch('http://localhost:8090/user/authenticate', requestOptions)
            .then((response)=>
            response.json())
            .then(data => {
                console.log(data);
                // login successful if there's a user in the response
                // if (user) {
                //     // store user details and basic auth credentials in local storage 
                //     // to keep user logged in between page refreshes
                    // data["password"] = password;
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('auth', "Basic "+btoa(data.username+":"+password));
                    
                // }
    
                // return user;
            });
    }

   
    login(email, password);

  }

const test = () => {
    fetch('http://localhost:8090/sayhello', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('auth')
        }
    }) 
        .then((response) => response.json())
        .then((data) => {
            console.log(data); 
        })
    .catch((err) => {
        console.log(err.message);
    });
}

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>

      <br></br>
        <div className={'inputContainer'}>
            <input className={'inputButton'} type="button" onClick={test} value={'Test'} />
        </div>

    </div>
  )
}

export default Login