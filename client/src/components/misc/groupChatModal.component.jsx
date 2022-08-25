// prettier-ignore
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton,ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, } from '@chakra-ui/react';
import { useState } from 'react';
import { chatState } from '../../context/chatProvider.context';
import axios from 'axios';
import UserListItem from '../userAvatar/userListItem.component';
import UserBadgeItem from '../userAvatar/userBadge.component';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../utils/toastMessage';

const GroupChatModal = props => {
  const { children } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = chatState();

  const handleSearch = async query => {
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer: ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/v1/user?search=${query}`, config);

      setLoading(false);
      setSearchResult(data.data.users);
    } catch (error) {
      showErrorToast('Failed to load the users');
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      return showErrorToast('Please fill all the fields');
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer: ${user.token}`,
        },
      };

      const payload = {
        name: groupChatName,
        users: selectedUsers.map(user => user._id),
      };

      const { data } = await axios.post('/api/v1/chat/group', payload, config);

      setChats([data.data.fullGroupChat, ...chats]);
      onClose();

      showSuccessToast('Group chat created');
    } catch (error) {
      const errMessage = error.response.data?.message || 'Failed to create the chat';
      showErrorToast(errMessage);
    }
  };

  const handleDelete = userToDelete => {
    setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser._id !== userToDelete._id));
  };

  const handleGroup = userToAdd => {
    if (selectedUsers.includes(userToAdd)) {
      return showWarningToast('User already added');
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            fontWeight='normal'
            display='flex'
            justifyContent='center'>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
            <FormControl>
              <Input mb={3} placeholder='Chat Name' onChange={e => setGroupChatName(e.target.value)} />
            </FormControl>

            <FormControl>
              <Input mb={3} placeholder='Add users eg: John' onChange={e => handleSearch(e.target.value)} />
            </FormControl>

            <Box w='100%' display='flex' flexWrap='wrap'>
              {selectedUsers.map(user => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
              ))}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map(user => <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />)
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
