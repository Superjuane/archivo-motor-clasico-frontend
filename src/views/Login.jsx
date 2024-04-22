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
      <NavBar />
      <div className={'mainContainer'}>
        <div className={'titleContainer'}>
          <div>Login</div>
        </div>
        <br />
        <div className={'inputContainer'}>
          <input
            value={email}
            placeholder="Enter your username here"
            onChange={(ev) => setEmail(ev.target.value)}
            className={'inputBox'}
          />
          <label className="errorLabel">{problemLabel}</label>
        </div>
        <br />
        <div className={'inputContainer'}>
          <input
            value={password}
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className={'inputBox'}
          />
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
    </div>
  )
}

export default Login