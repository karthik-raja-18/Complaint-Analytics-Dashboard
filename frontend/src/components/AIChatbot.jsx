import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, MessageSquare, ChevronDown } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your Complaint Analytics AI. Ask me about department performance or trend data!' }
  ]);
  const [input, setInput] = useState('');
  const [data, setData] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Only fetch if open and we have been authenticated (token is globally set in Axios)
    const loadContext = async () => {
      try {
        const res = await axios.get(`${API_BASE}/dashboard`);
        setData(res.data.summary || []);
      } catch (err) {
        console.warn('Chatbot couldn\'t reach analytics:', err);
      }
    };
    if (isOpen) loadContext();
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsgs = [...messages, { role: 'user', text: input }];
    setMessages(newMsgs);
    setInput('');

    // --- Simple Simulated AI Logic ---
    setTimeout(() => {
      let response = "I'm not sure about that. Try asking 'Which department is fastest?' or 'Show me total complaints'.";
      const prompt = input.toLowerCase();

      if (prompt.includes('fastest') || prompt.includes('best')) {
        const fastest = [...data].sort((a,b) => (a.avgResolutionTime || 999) - (b.avgResolutionTime || 999))[0];
        response = fastest 
          ? `The fastest department is ${fastest._id} with an average resolution time of ${fastest.avgResolutionTime.toFixed(1)} hours.`
          : "I don't have enough resolution data yet to determine the fastest department.";
      } else if (prompt.includes('total') || prompt.includes('show all')) {
        const total = data.reduce((s,d) => s + d.totalComplaints, 0);
        response = `We have a total of ${total} complaints across all ${data.length} departments.`;
      } else if (prompt.includes('most') || prompt.includes('worst')) {
        const worst = [...data].sort((a,b) => b.totalComplaints - a.totalComplaints)[0];
        response = worst 
          ? `${worst._id} has the most complaints (${worst.totalComplaints}).`
          : "No data available yet.";
      } else if (prompt.includes('pending') || prompt.includes('open')) {
        const pending = data.reduce((s,d) => s + d.assignedCount, 0);
        response = `There are currently ${pending} complaints still pending across all departments.`;
      }

      setMessages([...newMsgs, { role: 'bot', text: response }]);
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, fontFamily: 'Inter, sans-serif' }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ 
            width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-color)', 
            border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)', cursor: 'pointer', transition: 'transform 0.2s'
          }}
          className="btn-hover-scale"
        >
          <MessageSquare size={24} />
        </button>
      ) : (
        <div style={{ 
          width: 350, height: 450, background: 'var(--bg-surface)', borderRadius: 16,
          border: '1px solid var(--card-border)', boxShadow: 'var(--shadow)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '12px 16px', background: 'var(--accent-color)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot size={20} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Analytics Assistant AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><ChevronDown size={20} /></button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ 
                maxWidth: '85%', padding: '8px 12px', borderRadius: 12, fontSize: '0.85rem',
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? 'var(--accent-color)' : 'var(--card-bg)',
                color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: 12, borderTop: '1px solid var(--card-border)', background: 'var(--bg-main)', display: 'flex', gap: 8 }}>
            <input 
              type="text" 
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
            />
            <button 
              onClick={handleSend}
              style={{ background: 'var(--accent-color)', border: 'none', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
