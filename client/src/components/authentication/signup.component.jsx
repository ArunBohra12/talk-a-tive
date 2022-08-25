import { useState } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { chatState } from '../../context/chatProvider.context';
import { showSuccessToast, showWarningToast } from '../../utils/toastMessage';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [picture, setPicture] = useState(null);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setUser } = chatState();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const postDetails = picture => {
    const uploadUrl = 'https://api.cloudinary.com/v1_1/cloudbyarun/image/upload';

    setLoading(true);
    if (picture === undefined) {
      showWarningToast('Please select an image');
      setLoading(false);
      return;
    }

    if (picture.type === 'image/jpeg' || picture.type === 'image/png') {
      const data = new FormData();

      data.append('file', picture);
      data.append('upload_preset', 'talk-a-tive');
      data.append('cloud_name', 'cloudbyarun');

      fetch(uploadUrl, {
        method: 'post',
        body: data,
      })
        .then(res => res.json())
        .then(data => {
          setPicture(data.url.toString());
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      showWarningToast('Please select an image');
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      showWarningToast('Please fill all the fields');

      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showWarningToast('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post('/api/v1/user', { name, email, password, picture }, config);

      showSuccessToast('Registration Successful');

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setLoading(false);

      history.push('/chat');
    } catch (error) {
      const errMessage = error.response.data?.message || 'Error Occoured';
      showWarningToast(errMessage);
      setLoading(false);
    }
  };

  return (
    <VStack spacing='5px'>
      <FormControl id='name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder='Enter Your Name' onChange={e => setName(e.target.value)} />
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter Your Email' onChange={e => setEmail(e.target.value)} />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Enter Your Password'
            onChange={e => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='password-confirm' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size='md'>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Confirm Password'
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>
          <Input type='file' p={1.5} accept='image/*' onChange={e => postDetails(e.target.files[0])} />
        </FormLabel>
      </FormControl>

      <Button colorScheme='blue' width='100%' style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
        Sign UP
      </Button>
    </VStack>
  );
};

export default Signup;
