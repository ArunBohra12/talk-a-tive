import { useState } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { chatState } from '../../context/chatProvider.context';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../utils/toastMessage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { setUser } = chatState();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      showWarningToast('Please fill all the fields');

      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post('/api/v1/user/login', { email, password }, config);

      showSuccessToast('Logged In Successfully');

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      setUser(data);
      history.push('/chat');
    } catch (error) {
      const errMessage = error.response.data?.message || 'Error Occoured';
      showErrorToast(errMessage);
      setLoading(false);
    }
  };

  return (
    <VStack spacing='5px'>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter Your Email' value={email} onChange={e => setEmail(e.target.value)} />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Enter Your Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button colorScheme='blue' width='100%' style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
        Login
      </Button>

      <Button
        colorScheme='red'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail('guest@example.com');
          setPassword('123456');
        }}>
        Login as Guest User
      </Button>
    </VStack>
  );
};

export default Login;
