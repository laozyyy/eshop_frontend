import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import '../styles/Chat.css';

// 模拟数据
const avatar = "https://tse4-mm.cn.bing.net/th/id/OIP-C.4VIkNUS4ZmeKarixs3XWFgHaHa?rs=1&pid=ImgDetMain"; // 替换为实际的头像路径

function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null); // 改为初始null
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]); // 新增会话列表状态
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

  // 初始化WebSocket连接
  useEffect(() => {
    const uid = localStorage.getItem('uid');
    ws.current = new WebSocket(`ws://117.72.72.114:9001/api/v1/im/ws?uid=${uid}`);
    
    ws.current.onmessage = (e) => {
      const receivedMessage = JSON.parse(e.data);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: receivedMessage.content,
        sender: 'other',  // 假设接收的消息都是对方发送
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    };

    return () => ws.current.close();
  }, []);
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const uid = localStorage.getItem('uid');
        const response = await fetch(`http://117.72.72.114:9001/api/v1/im/receiver/mget?uid=${uid}`);
        const data = await response.json();
        
        // 转换接口数据结构
        const formatted = data.map(item => ({
          id: item.uid,
          name: item.name,
          avatar: '/default-avatar.png',
          lastMessage: item.last_message.length > 7 
            ? `${item.last_message.slice(0, 7)}...`
            : item.last_message,
          unread: 0,
          time: new Date(item.last_send_time).toLocaleTimeString()
        }));
        
        setConversations(formatted);
        if (formatted.length > 0) {
          setSelectedUser(formatted[0]); // 默认选中第一个
        }
      } catch (error) {
        console.error('获取会话列表失败:', error);
      }
    };

    fetchConversations();
  }, []);
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          const uid = localStorage.getItem('uid');
          const response = await fetch('http://117.72.72.114:9001/api/v1/im/history/get_one', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sender_id: uid,
              receiver_id: selectedUser.id
            })
          });
          
          const data = await response.json();
          
          // 转换消息格式
          const formattedMessages = data.messages.map(msg => ({
            id: msg.MessageID,
            text: msg.Content,
            sender: msg.SenderID === uid ? 'me' : 'other',
            time: new Date(msg.SendTime).toLocaleTimeString('zh-CN', { 
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Shanghai' // 明确指定中国时区
            }),
            read: msg.Status === 1
          }));
          
          setMessages(formattedMessages);
        } catch (error) {
          console.error('获取历史消息失败:', error);
        }
      }
    };

    fetchMessages();
  }, [selectedUser]);
  // 模拟初始消息
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const uid = localStorage.getItem('uid');
      if (!uid) {
        alert('请先登录');
        return;
      }

      // 构造消息实体
      const messageEntity = {
        to: selectedUser.id.toString(),
        content: newMessage
      };

      // 通过WebSocket发送
      ws.current.send(JSON.stringify(messageEntity));

      // 本地更新消息列表
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-page-container">
      <Header />
      <main className="chat-main">
        <div className="chat-container">
          <div className="chat-list">
            <div className="chat-list-header">
              <h2>消息列表</h2>
            </div>
            {conversations.map(conversation => (
              <div 
                key={conversation.id}
                className={`chat-item ${selectedUser?.id === conversation.id ? 'active' : ''}`}
                onClick={() => setSelectedUser(conversation)}
              >
                <img 
                  src={avatar} 
                  alt="头像" 
                  className="chat-avatar"
                />
                <div className="chat-info">
                  <h4>{conversation.name}</h4>
                  <p>{conversation.lastMessage}</p>
                </div>
                <div className="chat-meta">
                  <span className="chat-time" style={{ marginLeft: 'auto' }}>{conversation.time}</span>
                  {conversation.unread > 0 && (
                    <span className="unread-badge">{conversation.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="chat-window">
            {selectedUser ? (
              <>
                <div className="chat-header">
                  <h3>{selectedUser.name}</h3>
                </div>
                
                <div className="messages-container">
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={`message-bubble ${message.sender}`}
                    >
                      <div className="message-content">
                        <p>{message.text}</p>
                        <span className="message-time">
                          {message.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="message-input-area">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="输入消息..."
                  />
                  <button 
                    onClick={sendMessage}
                    className="send-button"
                  >
                    发送
                  </button>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <i className="fas fa-comments"></i>
                <p>请选择聊天对象开始对话</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatPage;