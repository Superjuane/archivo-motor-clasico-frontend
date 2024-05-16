import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './ResetPassword.css';


function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const token = searchParams.get('token')

    const tokenOK = async () => {
      return true;
    }

    useEffect(() => {
        tokenOK();
    }, []);

    const savePass = async () => {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/user/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    "password":password,
                    "token": token
                 }),
            });
            const data = await response.json();
            window.location.href = `/login?message=${data.message}`;
        } catch (error) {
            const errorMessage = await error.json();
            if (errorMessage.error && errorMessage.error.includes('MailError')) {
                window.location.href = '/emailError.html';
            } else {
                window.location.href = `/login?message=${errorMessage.message}`;
            }
        }
    };

  return (
    <div className='reset-password-div' >
      <h1 className='reset-password-hi'>reset</h1>
      <form className='reset-password-form'>
        <label className='reset-password-label'>password</label>
        <input
          className='reset-password-input'
          id="password"
          name="newPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className='reset-password-label'>confirm</label>
        <input
          className='reset-password-input'
          id="matchPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label className='reset-password-token-label'>{token}</label>

        <div className='reset-password-error-message' id="globalError" style={{ display: errorMessage ? 'block' : 'none' }}>
          {errorMessage}
        </div>
        <button className='reset-password-button' type="submit" onClick={savePass}>submit</button>
      </form>
    </div>
  );
}

export default ResetPassword;
