import { useState, useEffect } from 'react';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { chatState } from '../../context/chatProvider.context';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './chatLoading.component';
import { getSender } from '../../config/chatLogics';
import GroupChatModal from './groupChatModal.component';
import { showErrorToast } from '../../utils/toastMessage';

const MyChats = props => {
  const { fetchAgain } = props;
  const [loggedUser, setLoggedUser] = useState({});
  const { selectedChat, setSelectedChat, user, chats, setChats } = chatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer: ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/v1/chat', config);

      setChats(data.data.results);
    } catch (error) {
      showErrorToast('Failed to load the chats');
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDirection='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', md: '31%' }}
      borderRadius='1g'
      borderWidth='1px'>
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily='Work sans'
        display='flex'
        w='100%'
        justifyContent='space-between'
        alignItems='center'>
        <div>My Chats</div>

        <GroupChatModal>
          <Button
            display='flex'
            fontSize={{ base: '15px', md: '10px', lg: '17px' }}
            fontWeight='normal'
            rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display='flex'
        flexDirection='column'
        p={3}
        bg='#F8F8F8'
        w='100%'
        h='100%'
        borderRadius='5px'
        overflowY='hidden'>
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map(chat => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? '#38b2ac' : '#e8e8e8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius='lg'
                key={chat._id}>
                <Text>{loggedUser && chat.isGroupChat ? chat.chatName : getSender(loggedUser, chat.users)}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
