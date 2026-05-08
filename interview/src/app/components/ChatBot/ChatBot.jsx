'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatBot.module.css';

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:600">$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:4px;font-family:var(--mono);font-size:11px">$1</code>');
}

function getScoreColor(score) {
  if (score >= 80) return 'var(--green)';
  if (score >= 60) return 'var(--amber)';
  return 'var(--red)';
}

export default function ChatBot({ chatbot, userInitials = 'RK' }) {
  const { interviewer, categories, prompts, followUps, quickActions } = chatbot;

  const [messages, setMessages]               = useState([]);
  const [inputText, setInputText]             = useState('');
  const [isTyping, setIsTyping]               = useState(false);
  const [isLive, setIsLive]                   = useState(false);
  const [category, setCategory]               = useState(categories[0].value);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (role, content, score) => {
    const msg = { id: Date.now() + Math.random(), role, content, score };
    setMessages((prev) => [...prev, msg]);
  };

  const simulateAIReply = async (userMsg) => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    setIsTyping(false);

    const keywords = userMsg.toLowerCase();

    if (!interviewStarted || keywords.includes('start')) {
      setInterviewStarted(true);
      setIsLive(true);
      const pool = prompts[category];
      const reply = pool[Math.floor(Math.random() * pool.length)];
      addMessage('assistant', reply);
      return;
    }

    if (keywords.includes('hint')) {
      addMessage('assistant', "Here's a hint: Think about using a **recursive approach** with a helper function that returns the max gain from each subtree. What does your base case look like?");
      return;
    }

    if (keywords.includes('feedback') || keywords.includes('evaluat')) {
      const score = Math.floor(65 + Math.random() * 30);
      addMessage('assistant', `Here's my detailed feedback on your answer:\n\n**Strengths:**\n- Clear problem-solving approach\n- Good communication\n\n**Areas to improve:**\n- Consider edge cases more carefully\n- Optimize for space complexity\n\nOverall, solid performance — keep it up!`, score);
      return;
    }

    if (keywords.includes('skip')) {
      setInterviewStarted(false);
      addMessage('assistant', "Sure, skipping ahead! Here's your next question:\n\n**Implement a LRU Cache** with O(1) get and O(1) put operations. What data structures would you use?");
      return;
    }

    const reply = followUps[Math.floor(Math.random() * followUps.length)];
    addMessage('assistant', reply);
  };

  const sendMessage = () => {
    if (isTyping) return;
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    addMessage('user', text);
    simulateAIReply(text);
  };

  const quickPrompt = (text) => {
    if (isTyping) return;
    setInputText(text);
    // use a tiny timeout so state flushes before sendMessage reads it
    setTimeout(() => {
      addMessage('user', text);
      simulateAIReply(text);
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setIsLive(false);
    setInterviewStarted(false);
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.botInfo}>
          <div className={styles.botAvatar}>{interviewer.avatar}</div>
          <div>
            <div className={styles.botName}>{interviewer.name} — {interviewer.title}</div>
            <div className={styles.botStatus}>
              <span className={styles.onlineDot} />
              <span className={styles.onlineText}>{interviewer.status}</span>
            </div>
          </div>
        </div>

        <div className={styles.headerControls}>
          {isLive && (
            <div className={styles.liveTag}>
              <span className={styles.liveDot} />
              Live
            </div>
          )}
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <button className={styles.clearBtn} onClick={clearChat} title="Clear chat">🗑</button>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🤖</div>
            <div className={styles.emptyTitle}>Alex is ready to interview you</div>
            <div className={styles.emptyHint}>
              Select a category and click <strong style={{ color: 'var(--accent2)' }}>Start interview</strong> or type a message to begin
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${isUser ? styles.messageRowUser : ''}`}
              >
                <div className={`${styles.avatar} ${isUser ? styles.avatarUser : styles.avatarBot}`}>
                  {isUser ? userInitials : interviewer.avatar}
                </div>
                <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleBot}`}>
                  <span dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
                  {msg.score !== undefined && (
                    <div
                      className={styles.scoreTag}
                      style={{ color: getScoreColor(msg.score) }}
                    >
                      📊 Score: {msg.score}/100
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className={styles.typingIndicator}>
            <div className={styles.typingDots}>
              <div className={styles.typingDot} style={{ animationDelay: '0s' }} />
              <div className={styles.typingDot} style={{ animationDelay: '0.2s' }} />
              <div className={styles.typingDot} style={{ animationDelay: '0.4s' }} />
            </div>
            <span className={styles.typingText}>Alex is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input row */}
      <div className={styles.inputRow}>
        <textarea
          className={styles.chatInput}
          rows={2}
          placeholder="Type your answer or ask a question..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
        />
        <button
          className={styles.sendBtn}
          onClick={sendMessage}
          disabled={isTyping}
          title="Send"
        >
          ➤
        </button>
      </div>

      {/* Quick actions */}
      <div className={styles.quickActions}>
        {quickActions.map((action) => (
          <button
            key={action.label}
            className={styles.quickBtn}
            onClick={() => quickPrompt(action.prompt)}
            disabled={isTyping}
          >
            {action.icon} {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
