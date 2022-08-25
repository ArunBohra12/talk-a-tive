import { ViewIcon } from '@chakra-ui/icons';
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
} from '@chakra-ui/react';

const ProfileModal = props => {
  const { user, children } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal size='lg' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='40px'
            fontFamily='Work Sans'
            display='flex'
            justifyContent='center'
            fontWeight='medium'>
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' alignItems='center' flexDirection='column'>
            <Image borderRadius='full' boxSize='150px' src={user.picture} alt={user.name} />
            <Text fontSize={{ base: '20px', md: '25px' }} fontFamily='Work sans' marginTop='2rem'>
              {user.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
