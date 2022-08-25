import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius='4px'
      m={1}
      mb={2}
      variant='solid'
      fontSize={12}
      color='#fff'
      backgroundColor='purple'
      cursor='pointer'
      onClick={handleFunction}>
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
