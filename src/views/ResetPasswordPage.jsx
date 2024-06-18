import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './ResetPasswordPage.css';


function ResetPassword() {
  const URL = 'http://localhost:8090';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const token = searchParams.get('token')

  const savePass = () => {
      if (password !== confirmPassword) {
          setErrorMessage('Las contraseñas no coinciden');
          setTimeout(() => {
              setErrorMessage('');
          }, 3000);
          return;
      }

      if(password.length < 8){
          setErrorMessage('La contraseña debe tener al menos 8 caracteres');
          setTimeout(() => {
              setErrorMessage('');
          }
          , 3000);
          return;
      }

      fetch(URL+'/user/resetpassword', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Allow-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ password: password, token: token }),
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          navigate("/login")
        } else {
          throw new Error('Error: ' + response.status);
        }
      })
      .then((data) => {
        console.log(data);
        setErrorMessage('Password reset successful!');
      })
      .catch((error) => {
        console.log("Error: "+error);
      });
  };

  return (
    <div className='ResetPasswordPage-outside-div' >
      <h1> Reestablecer contraseña</h1>
      <div className='ResetPasswordPage-form'>
        <label className='ResetPasswordPage-label'>Nueva contraseña</label>
        <input
          className='ResetPasswordPage-input'
          id="password"
          name="newPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className='ResetPasswordPage-label'>Confirmar contraseña </label>
        <input
          className='ResetPasswordPage-input'
          id="matchPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className='ResetPasswordPage-error-message' id="globalError" style={{ display: errorMessage ? 'block' : 'none' }}>
          {errorMessage}
        </div>
        <button className='ResetPasswordPage-button' onClick={savePass}>submit</button>
      </div>
    </div>
  );
}

export default ResetPassword;
