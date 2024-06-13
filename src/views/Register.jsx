import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Register.css'



const Register = (props) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [problem, setProblem] = useState('')


    const navigate = useNavigate()

const onButtonClick = () => {

    if(username ===''){
        setProblem('usernameEmpty');
        setTimeout(() => {
            setProblem('');
        }, 5000);
        return;
    }

    if(email ===''){
        setProblem('emailEmpty');
        setTimeout(() => {
            setProblem('');
        }, 5000);
        return;
    }

    if(password ===''){
        setProblem('passwordEmpty');
        setTimeout(() => {
            setProblem('');
        }, 5000);
        return;
    }

    if(repeatPassword ===''){
        setProblem('repeatPasswordEmpty');
        setTimeout(() => {
            setProblem('');
        }, 5000);
        return;
    }

    if (password !== repeatPassword){
        setProblem('contraseñasNoCoinciden');
        setTimeout(() => {
            setProblem('');
        }, 5000);
        return;
    }

    if(password.length < 8){
        setProblem('contraseñaCorta');
        setTimeout(() => {
            setProblem('');
        }, 5000);
        return;
    }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                "username":username, 
                "password":password,
                "email":email 
            })
        };
    
        return fetch('http://localhost:8090/user', requestOptions)
            .then((response)=>{
              let data = response.json();
              console.log(data);
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
                      setTimeout(() => {
                          setProblem('');
                      }, 5000);
                  });
                }
            });

  }

let problemLabel;
if(problem !== ''){
  if(problem === 'userAlreadyRegistered'){ // error del backend
    problemLabel = <label className="errorLabel">⚠️ Este usuario ya está registrado ⚠️</label>;
  } else if (problem === 'emailNotValid'){
    problemLabel = <label className="errorLabel">⚠️ El email no es válido ⚠️</label>;
  } else if (problem === 'emailAlreadyRegistered'){
    problemLabel = <label className="errorLabel">⚠️ Este email ya está registrado ⚠️</label>;
  } else if (problem === 'contraseñasNoCoinciden'){
    problemLabel = <label className="errorLabel">⚠️ Las contraseñas no coinciden ⚠️</label>;
  } else if (problem === 'usernameEmpty'){
    problemLabel = <label className="errorLabel">⚠️ El nombre de usuario no puede estar vacío ⚠️</label>;
  } else if (problem === 'emailEmpty'){
    problemLabel = <label className="errorLabel">⚠️ El email no puede estar vacío ⚠️</label>;
  } else if (problem === 'passwordEmpty'){
    problemLabel = <label className="errorLabel">⚠️ La contraseña no puede estar vacía ⚠️</label>;
  } else if (problem === 'repeatPasswordEmpty'){
    problemLabel = <label className="errorLabel">⚠️ Debes repetir la contraseña ⚠️</label>;
  } else if (problem === 'contraseñaCorta'){
    problemLabel = <label className="errorLabel">⚠️ La contraseña debe tener al menos 8 caracteres ⚠️</label>;
  }

}

  return (
    <div className='Register-mainContainer'>
        <div className='Register-box'>
            <div className='Register-titleContainer'>
                <div>Crear cuenta nueva</div>
            </div>
            <div className='Register-inputContainer'>
                <input
                    value={username}
                    type='text'
                    placeholder="Introduce un nombre de usuario"
                    onChange={(ev) => {setProblem(''); setUsername(ev.target.value);}}
                    className={'Register-inputBox'}
                />
            </div>
            <div className='Register-inputContainer'>
                <input
                    value={email}
                    type='text'
                    placeholder="Introduce un email válido"
                    onChange={(ev) => {setProblem(''); setEmail(ev.target.value);}}
                    className={'Register-inputBox'}
                />
            </div>

            <div className='Register-inputContainer'>
                <input
                    value={password}
                    placeholder="Introduce una contraseña"
                    type='password'
                    onKeyDown={(e)=>{if(e.key === 'Enter' && !e.shiftKey){onButtonClick()}}}
                    onChange={(ev) => {setProblem(''); setPassword(ev.target.value)}}
                    className={'Register-inputBox'}
                />
            </div>

            <div className='Register-inputContainer'>
                <input
                    value={repeatPassword}
                    placeholder="Repite la contraseña"
                    type='password'
                    onKeyDown={(e)=>{if(e.key === 'Enter' && !e.shiftKey){onButtonClick()}}}
                    onChange={(ev) => {setProblem(''); setRepeatPassword(ev.target.value)}}
                    className={'Register-inputBox'}
                />
            </div>

            <button className={'Register-inputButton'} type="button" onClick={onButtonClick}>
                Registrarse
            </button>

            <label className="Register-errorLabel">{problemLabel}</label>

        </div>

    </div>
)}

export default Register