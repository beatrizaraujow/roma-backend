import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ChatWidget.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export const ChatWidget: React.FC = () => {
  const { user } = useAuth();
  
  // Não mostrar chat na tela de login
  if (!user) {
    return null;
  }
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Como posso ajudar você hoje?',
      sender: 'support',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Simular resposta automática
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        'Entendi sua mensagem! Nossa equipe responderá em breve.',
        'Obrigado por entrar em contato. Estamos analisando sua solicitação.',
        'Interessante! Vou verificar isso para você.',
        'Perfeito! Deixe-me te ajudar com isso.',
      ];

      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'support',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, autoReply]);
      setIsTyping(false);

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = [
    '📧 Problema com email',
    '🔑 Resetar senha',
    '💳 Questão sobre pagamento',
    '📱 Suporte técnico',
  ];

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  return (
    <>
      {/* Botão flutuante */}
      {!isOpen && (
        <button
          className="chat-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir chat de suporte"
        >
          💬
          {unreadCount > 0 && (
            <span className="chat-badge">{unreadCount}</span>
          )}
        </button>
      )}

      {/* Widget de chat */}
      {isOpen && (
        <div className={`chat-widget ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">👤</div>
              <div>
                <h3>Suporte ROMA</h3>
                <span className="chat-status">
                  <span className="status-dot"></span> Online
                </span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="chat-action-btn"
                title={isMinimized ? 'Maximizar' : 'Minimizar'}
              >
                {isMinimized ? '⬆️' : '⬇️'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="chat-action-btn"
                title="Fechar"
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Mensagens */}
              <div className="chat-messages">
                {user && (
                  <div className="chat-welcome">
                    Olá, {user.nome}! 👋
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-message ${message.sender}`}
                  >
                    <div className="message-bubble">
                      <p>{message.text}</p>
                      <span className="message-time">
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="chat-message support">
                    <div className="message-bubble typing">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Respostas rápidas */}
              {messages.length <= 2 && (
                <div className="chat-quick-replies">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="quick-reply-btn"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="chat-input-container">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="chat-input"
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  className="chat-send-btn"
                  disabled={!inputValue.trim()}
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
