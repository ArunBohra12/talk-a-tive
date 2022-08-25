import { createContext, useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = props => {
  const { children } = props;

  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userInfo);

    if (!userInfo) {
      history.push('/');
    }
  }, [history]);

  const value = { user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const chatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
