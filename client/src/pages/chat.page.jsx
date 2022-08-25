import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import SideDrawer from '../components/misc/sideDrawer.component';
import MyChats from '../components/misc/myChats.component';
import ChatBox from '../components/misc/chatBox.component';
import { chatState } from '../context/chatProvider.context';

const ChatPage = () => {
  const { user } = chatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box display='flex' justifyContent='space-between' w='100%' h='92vh' p='10px'>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
