import { ViewIcon } from '@chakra-ui/icons';
// prettier-ignore
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { chatState } from '../../context/chatProvider.context';
import { showErrorToast } from '../../utils/toastMessage';
import UserBadgeItem from '../userAvatar/userBadge.component';
import UserListItem from '../userAvatar/userListItem.component';

const UpdateGroupChatModal = props => {
  const { fetchAgain, setFetchAgain, fetchMessages } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = chatState();

  const [groupChatName, setGroupChatName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer: ${user.token}`,
    },
  };

  const handleAddUser = async userToAdd => {
    if (selectedChat.users.find(user => user._id === userToAdd._id)) {
      return showErrorToast('User already exists');
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      return showErrorToast('Only admins can add users');
    }

    try {
      setLoading(true);

      const payload = {
        chatId: selectedChat._id,
        userId: userToAdd._id,
      };

      const { data } = await axios.put('/api/v1/chat/add-to-group', payload, config);

      setSelectedChat(data.data.added);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      const errMessage = error.response.data?.message || 'Unable to add to chat';
      showErrorToast(errMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async userToRemove => {
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      return showErrorToast('Only admins can remove users');
    }

    try {
      setLoading(true);

      const payload = {
        chatId: selectedChat._id,
        userId: userToRemove._id,
      };

      const { data } = await axios.put('/api/v1/chat/remove-from-group', payload, config);

      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data.data.updatedChat);
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (error) {
      const errMessage = error.response.data?.message || 'Unable to remove from chat';
      showErrorToast(errMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const payload = { chatId: selectedChat._id, chatName: groupChatName };

      const { data } = await axios.put('/api/v1/chat/rename', payload, config);

      setSelectedChat(data.data.updatedChat);
      setFetchAgain(true);
      setRenameLoading(false);
    } catch (error) {
      const errMessage = error.response.data?.message || 'Unable to rename chat';
      showErrorToast(errMessage);

      setRenameLoading(false);
    }

    setGroupChatName('');
  };

  const handleSearch = async query => {
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`/api/v1/user?search=${query}`, config);

      setLoading(false);
      setSearchResult(data.data.users);
    } catch (error) {
      showErrorToast('Failed to load the users');
    }
  };

  return (
    <>
      <IconButton onClick={onOpen} display={{ base: 'flex' }} icon={<ViewIcon />} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display='flex' flexWrap='wrap' pb={3}>
              {selectedChat.users.map(user => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
              ))}
            </Box>

            <FormControl display='flex'>
              <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={e => setGroupChatName(e.target.value)}
              />
              <Button variant='solid' colorscheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename}>
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input placeholder='Add user to group' mb={1} onChange={e => handleSearch(e.target.value)} />
            </FormControl>

            {loading ? (
              <Spinner size='lg' />
            ) : (
              searchResult?.map(user => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
