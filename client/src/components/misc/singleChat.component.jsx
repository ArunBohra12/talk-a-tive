import { useEffect, useState } from 'react';
import { ArrowBackIcon } from '@chakra-ui/icons';
// prettier-disable
import { Box, FormControl, IconButton, Input, Spinner, Text } from '@chakra-ui/react';
import { getSender, getSenderFull } from '../../config/chatLogics';
import { chatState } from '../../context/chatProvider.context';
import ProfileModal from './profileModal.component';
import UpdateGroupChatModal from './updateGroupChatModal.component';
import ScrollableChat from './scrollableChat.component';
import axios from 'axios';
import io from 'socket.io-client';
import Lottie from 'react-lottie';

import animationData from '../../animations/dot-typing-animation.json';

import './styles.css';
import { showErrorToast } from '../../utils/toastMessage';

// This has to be your production url
const ENDPOINT = '/';
let socket, selectedChatCompare;

const SingleChat = props => {
  const { fetchAgain, setFetchAgain } = props;
  const { user, selectedChat, setSelectedChat, notification, setNotification } = chatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    renderSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', newMessageReceived => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Send notification logic
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const fetchMessages = async () => {
    if (!selectedChat) return;

    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/v1/message/${selectedChat._id}`, config);

      setMessages(data.data.messages);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      showErrorToast('Failed to load the chats');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async event => {
    if (event.key !== 'Enter' || !newMessage) return;

    socket.emit('stop typing', selectedChat._id);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const payload = {
        content: newMessage,
        chatId: selectedChat._id,
      };

      setNewMessage('');
      const { data } = await axios.post('/api/v1/message', payload, config);

      socket.emit('new message', data.data.message);
      setMessages([...messages, data.data.message]);
    } catch (error) {
      showErrorToast('Failed to send the message');
    }
  };

  const typingHandler = e => {
    setNewMessage(e.target.value);

    // Typing indicator logic below
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    const timerLength = 3000;
    const lastTypingTime = new Date().getTime();

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDifference = timeNow - lastTypingTime;

      if (timeDifference >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w='100%'
            fontFamily='Work sans'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
            fontWeight='medium'>
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='#e8e8e8'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'>
            {loading ? (
              <Spinner size='xl' w={20} h={20} alignSelf='center' margin='auto' />
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping && (
                <div>
                  <Lottie style={{ marginBottom: '10px', marginLeft: 0 }} width={70} options={defaultOptions} />
                </div>
              )}
              <Input
                variant='filled'
                placeholder='Enter a message'
                bg='#e0e0e0'
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
          <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
