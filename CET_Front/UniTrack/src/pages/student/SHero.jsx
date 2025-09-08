import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SHero() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/student/events');
  };

  const styles = {
    container: {
      position: 'relative',
      height: '100vh',
    backgroundImage:'url("cet.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(8, 8, 50, 0.5)', 
    },
    content: {
      color: 'white',
      textAlign: 'center',
      zIndex: 1,
      padding: '50px',
    },
    heading: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    paragraph: {
      fontSize: '1.2rem',
      marginBottom: '2rem',
      maxWidth: '600px',
      margin: 'auto',
    },
    button: {
      padding: '12px 24px',
      fontSize: '1rem',
      backgroundColor: '#000000ff',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      margin:"15px"
    },
  };

  return (
    <>
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <h1 style={styles.heading}>Welcome Students</h1>
        <p style={styles.paragraph}>
          Stay updated with the latest college events, workshops, and activities designed for your academic and personal growth.
        </p>
        <button style={styles.button} onClick={handleExploreClick}>
          Explore Events
        </button>
      </div>
      
    </div>
    <hr></hr>
       <footer className="footer">
        <div className="container text-center">
          <p>&copy; 2025 College Event Tracker. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

