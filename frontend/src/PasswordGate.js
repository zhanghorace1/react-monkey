import React, { useState } from 'react';
import enterSound from './sound/enter_sound.mp3'; // Import the sound file

function PasswordGate({ children, correctPassword }) {
  const [inputPassword, setInputPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputPassword === correctPassword) {
      const audio = new Audio(enterSound); // Create a new Audio instance
      audio.play(); // Play the sound
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      backgroundImage: 'radial-gradient(circle, #001100, #000)',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      border: '2px solid #0f0',
      borderRadius: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      boxShadow: '0 0 20px #0f0',
    },
    label: {
      marginBottom: '10px',
      fontSize: '1.2rem',
    },
    input: {
      marginBottom: '15px',
      padding: '10px',
      border: '1px solid #0f0',
      borderRadius: '5px',
      backgroundColor: '#000',
      color: '#0f0',
      fontSize: '1rem',
      outline: 'none',
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#0f0',
      color: '#000',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#00ff00',
    },
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={styles.container}>
      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >
        <label
          htmlFor="password-input"
          style={styles.label}
        >
          Enter Password:
        </label>
        <input
          id="password-input"
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          style={styles.input}
        />
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default PasswordGate;
