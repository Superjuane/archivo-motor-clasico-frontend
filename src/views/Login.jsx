import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import NavBar from 'components/Navbar'
const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [problem, setProblem] = useState('')


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
            .then((response)=>{
              let data = response.json();
              if(!response.ok) throw {code: response.status, data: data};
              return data;
          }).then(data => {
                console.log("Log In Success!");
                console.log(data);
                localStorage.setItem('username', data.username);
                localStorage.setItem('auth', "Basic "+btoa(data.username+":"+password));
                navigate('/resources')
            }).catch((error) => {
                console.log("Log In Failed!");
                console.log(error);
                if(error.code === 401){
                  error.data.then((data) => {
                      setProblem(data.problem);
                  });
                }
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

let problemLabel;
if(problem !== ''){
  if(problem === 'unregistered'){
    problemLabel = <label className="errorLabel">⚠️ This user is not registered ⚠️</label>;
  } else if(problem === 'wrongPassword'){
    problemLabel = <label className="errorLabel">⚠️ Wrong password ⚠️</label>;
  }
}

  return (
    <div>
      {/* <NavBar /> */}
      <div className={'Login-mainContainer'}>
        <div className={'Login-titleContainer'}>
          <div>Login</div>
        </div>
        <br />
        <div className={'Login-inputContainer'}>
          <input
            value={email}
            type='text'
            placeholder="Introduce tu usuario"
            onChange={(ev) => setEmail(ev.target.value)}
            className={'Login-inputBox'}
          />
          <label className="Login-errorLabel">{problemLabel}</label>
        </div>
        <br />
        <div className={'Login-inputContainer'}>
          <input
            value={password}
            placeholder="Introduce tu contraseña"
            type='password'
            onKeyDown={(e)=>{if(e.key === 'Enter' && !e.shiftKey){onButtonClick()}}}
            onChange={(ev) => setPassword(ev.target.value)}
            className={'Login-inputBox'}
          />
        </div>
        <br />
          <button className={'Login-inputButton'} type="button" onClick={onButtonClick}>
            Iniciar sesión
          </button>
        <br></br>
        <br></br>
          <a className={'Login-forgot-password-link'} type="button" href='/forgotpassword'>
            ¿Olvidaste tu contraseña?
          </a>

      </div>
    </div>
  )
}

export default Login