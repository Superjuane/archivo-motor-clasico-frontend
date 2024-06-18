import React, { useState } from 'react';
import './ForgotPasswordPage.css';

function ForgotPassword() {
  const URL = 'http://localhost:8090';
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetPass = async () => {

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if ( re.test(email) ) {

      fetch(URL+'/user/forgotpassword?email='+email, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Allow-Control-Allow-Origin': '*',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSuccessMessage('Email enviado correctamente');
        } else {
          setErrorMessage('Email no encontrado');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        }
      
      })
      
            
    }else {
        setErrorMessage('Email inválido');
        setTimeout(() => {
            setErrorMessage('');
        }, 3000);
    }

    
  };

  return (
    <div className='forgot-password-outside-div'>
      <div className='forgot-password-div'>
        <h1 className='forgot-password-h1'>Recuperar contraseña</h1>
        { !successMessage ? (<div>
          <label className='forgot-password-label' htmlFor="email">Introduce el email asociado a tu cuenta</label>
          <input className='forgot-password-input'
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

            <div className='forgot-password-error-message' id="globalError" style={{ display: errorMessage ? 'block' : 'none' }}>
                {errorMessage}
            </div>

          <button className='forgot-password-button' type="submit" onClick={resetPass}>Enviar</button>
        </div>)
        :
        (<div>
          <h1 className='ForgotPasswordPage-email-ok-h1'>
            Email enviado correctamente
          </h1>
          <h2 className='ForgotPasswordPage-email-ok-h2'>
            Revisa tu bandeja de entrada
          </h2>
        </div>)
        }
      </div>
    </div>
  );
}

export default ForgotPassword;
