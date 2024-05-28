import React, { useState } from 'react';
import './ForgotPasswordPage.css';

function ForgotPassword() {
  const URL = 'http://localhost:8090';
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const resetPass = async () => {

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if ( re.test(email) ) {
        try {
            const response = await fetch(URL+'/user/forgotpassword?email='+email, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Origin': '*',
              },
            });
            const data = await response.json();
            errorMessage = "Password reset email sent!"
          } catch (error) {
            // const errorMessage = await error.json();
            // if (errorMessage.error && errorMessage.error.includes('MailError')) {
            //   window.location.href = '/emailError.html';
            // } else {
            //   window.location.href = `/login?message=${errorMessage.message}`;
            // }
            console.log("Error: "+error);
          }
    }
    else {
        setErrorMessage('Invalid email');
    }

    
  };

  return (
    <div className='forgot-password-outside-div'>
      <div className='forgot-password-div'>
        <h1 className='forgot-password-h1'>Recuperar contraseña</h1>

        <label className='forgot-password-label' htmlFor="email">Introduce el email asociado a tu cuenta</label>
        <input className='forgot-password-input'
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className='forgot-password-button' type="submit" onClick={resetPass}>Enviar</button>

          <div className='forgot-password-error-message' id="globalError" style={{ display: errorMessage ? 'block' : 'none' }}>
              {errorMessage}
          </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
