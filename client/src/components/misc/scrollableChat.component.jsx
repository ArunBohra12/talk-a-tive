import { Avatar, Tooltip } from '@chakra-ui/react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/chatLogics';
import { chatState } from '../../context/chatProvider.context';

const ScrollableChat = props => {
  const { messages } = props;

  const { user } = chatState();

  return (
    <ScrollableFeed>
      {messages.map((message, index) => (
        <div key={message._id} style={{ display: 'flex' }}>
          {(isSameSender(messages, message, index, user._id) || isLastMessage(messages, index, user._id)) && (
            <Tooltip label={message.sender.name} placement='bottom-start' hasArrow>
              <Avatar
                mt='7px'
                mr={1}
                size='sm'
                cursor='pointer'
                name={message.sender.name}
                src={message.sender.picture}
              />
            </Tooltip>
          )}

          <span
            style={{
              backgroundColor: `${message.sender._id === user._id ? '#bee3f8' : '#b9f5d0'}`,
              borderRadius: '5px',
              padding: '5px 12px',
              maxWidth: '75%',
              margin: '3px 0',
              marginLeft: isSameSenderMargin(messages, message, index, user._id),
              marginTop: isSameUser(messages, message, index, user._id) ? 3 : 10,
            }}>
            {message.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
