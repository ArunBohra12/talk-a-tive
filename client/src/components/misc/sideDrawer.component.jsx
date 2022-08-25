import { useState } from 'react';
// prettier-ignore
import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, Spinner } from '@chakra-ui/react';

import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { chatState } from '../../context/chatProvider.context';
import ProfileModal from './profileModal.component';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './chatLoading.component';
import UserListItem from '../userAvatar/userListItem.component';
import { getSender } from '../../config/chatLogics';
import { Effect } from 'react-notification-badge';
import NotificationBadge from 'react-notification-badge';
import { showWarningToast } from '../../utils/toastMessage';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = chatState();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/');
  };

  const handleSearch = async () => {
    if (!search) return showWarningToast('Please enter something in search');

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/v1/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data.data.users);
    } catch (error) {
      showWarningToast('Failed to load the search results');
    }
  };

  const accessChat = async userId => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/v1/chat', { userId }, config);

      if (chats && !chats.find(c => c._id === data.data._id)) setChats([data.data, ...chats]);

      setSelectedChat(data.data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      showWarningToast('Error fetching the chat');
    }
  };

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'>
        <Tooltip label='Search user to chat' hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen}>
            <i className='fas fa-search'></i>
            <Text display={{ base: 'none', md: 'flex' }} px='4'>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize='2xl' fontFamily='Work sans'>
          Talk-A-Tive
        </Text>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Menu>
            <MenuButton p='1'>
              <NotificationBadge count={notification.length} effect={Effect.scale} />
              <BellIcon fontSize='22' m='1' />
            </MenuButton>

            <MenuList pl={2}>
              {!notification.length && 'No new messages'}
              {notification.map(notif => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter(n => n !== notif));
                  }}>
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New messaeg from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.picture} />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb='2'>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map(user => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
              ))
            )}

            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
