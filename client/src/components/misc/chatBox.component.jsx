import { Box } from '@chakra-ui/react';
import { chatState } from '../../context/chatProvider.context';
import SingleChat from './singleChat.component';

const ChatBox = props => {
  const { fetchAgain, setFetchAgain } = props;
  const { selectedChat } = chatState();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      width={{ base: '100%', md: '68%' }}
      alignItems='center'
      flexDir='column'
      p={3}
      bg={'white'}
      borderRadius='lg'
      borderWidth='1px'>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
