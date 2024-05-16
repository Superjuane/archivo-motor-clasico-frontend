import React, { useState } from 'react';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const resetPass = async () => {

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if ( re.test(email) ) {
        try {
            const response = await fetch('/user/resetPassword?email='+email, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
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
    <div className='forgot-password-div'>
      <h1 className='forgot-password-h1'>reset</h1>

      <label className='forgot-password-label' htmlFor="email">email</label>
      <input className='forgot-password-input'
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className='forgot-password-button' type="submit" onClick={resetPass}>reset</button>

        <div className='forgot-password-error-message' id="globalError" style={{ display: errorMessage ? 'block' : 'none' }}>
            {errorMessage}
        </div>

    </div>
  );
}

export default ForgotPassword;
