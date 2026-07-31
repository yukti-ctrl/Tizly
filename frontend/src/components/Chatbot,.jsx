import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

// SVG Icons (Hardcoded so we don't rely on the broken lucide-react library)
const Icons = {
  Chat: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
  )
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Tizly. How can I help your pet today?", sender: "bot" }
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    try {
      const res = await api.post('/chat', { message: input });
      setMessages(prev => [...prev, { text: res.data.response, sender: "bot" }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting.", sender: "bot" }]);
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.launcher} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <Icons.Close /> : <Icons.Chat />}
      </button>

      {isOpen && (
        <div style={styles.window}>
          <div style={styles.header}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Tizly Assistant</h3>
          </div>
          <div style={styles.messageArea} ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                ...styles.bubble,
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#121212' : '#f0f0f0',
                color: msg.sender === 'user' ? '#fff' : '#000',
              }}>
                {msg.text}
              </div>
            ))}
          </div>
          <div style={styles.inputArea}>
            <input 
              style={styles.input}
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button style={styles.sendBtn} onClick={handleSend}><Icons.Send /></button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 },
  launcher: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#121212', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' },
  window: { position: 'absolute', bottom: '80px', right: '0', width: '300px', height: '400px', backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { padding: '20px', backgroundColor: '#E9DCC9', color: '#121212', fontWeight: 'bold' },
  messageArea: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  bubble: { padding: '10px 15px', borderRadius: '15px', maxWidth: '85%', fontSize: '14px', lineHeight: '1.4' },
  inputArea: { padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' },
  input: { flex: 1, border: '1px solid #eee', borderRadius: '10px', padding: '8px 12px', outline: 'none' },
  sendBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#121212' }
};