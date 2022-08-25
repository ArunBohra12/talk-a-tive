import { useEffect } from 'react';
import { Box, Container, TabList, Tab, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import Login from '../components/authentication/login.component';
import Signup from '../components/authentication/signup.component';
import { chatState } from '../context/chatProvider.context';

const Home = () => {
  const history = useHistory();
  const { setUser } = chatState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userInfo);

    if (userInfo) {
      history.push('/chat');
    }
  }, []);

  return (
    <Container maxW='xl'>
      <Box padding={3} bg='white' w='100%' m='40px 0 15px 0' borderRadius='lg' borderWidth='1px'>
        <Text fontSize='4xl' fontFamily='Work Sans' textAlign='center'>
          Talk-A-Tive
        </Text>
      </Box>
      <Box bg='white' w='100%' p='10px' borderRadius='lg' borderWidth='1px' color='black'>
        <Tabs variant='soft-rounded'>
          <TabList marginBottom='15px'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
