import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/api/chat', {
        message,
      });

      setChatResponse(response.data.message);
      setMessage('');
    } catch (error) {
      console.error('Error in chatbot:', error);
      setChatResponse('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Inline styles
  const styles = {
    chatbotContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
    },
    chatBox: {
      width: '400px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    messages: {
      marginBottom: '15px',
      paddingBottom: '15px',
      borderBottom: '1px solid #ccc',
      marginTop: '10px',
    },
    userMessage: {
      fontSize: '14px',
      color: '#333',
      marginBottom: '10px',
    },
    chatResponse: {
      fontSize: '14px',
      color: '#555',
      marginTop: '5px',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      marginBottom: '10px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007bff',
      border: 'none',
      color: 'white',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonDisabled: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.chatbotContainer}>
      <div style={styles.chatBox}>
        <div style={styles.messages}>
          <div style={styles.userMessage}>{message}</div>
          <div style={styles.chatResponse}>{chatResponse}</div>
        </div>
        <input
          style={styles.input}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
          onClick={handleSendMessage}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
