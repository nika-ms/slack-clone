import Workspace from '@layouts/Workspace';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { Container, Header } from './style';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useinput';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log('채널!!');
    setChat('');
  }, []);

  return (
    <Container>
      <Header>채널!</Header>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
