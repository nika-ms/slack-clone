import Workspace from '@layouts/Workspace';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import axios from 'axios';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useinput';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const [chat, onChangeChat, setChat] = useInput('');

  const { data: userData } = useQuery(['workspace', workspace, 'users', id], () =>
    axios
      .get(`http://localhost:3095/api/workspaces/${workspace}/users/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err.response);
        throw err;
      }),
  );

  const { data: myData } = useQuery(['user'], () =>
    axios
      .get('http://localhost:3095/api/users')
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.response);
        throw err;
      }),
  );

  const { data: chatData, refetch } = useQuery(['workspace', workspace, 'dm', id, 'chat'], () =>
    axios
      .get(`http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      }),
  );

  //   ### GET /workspaces/:workspace/dms/:id/chats
  //   - :workspace 내부의 :id와 나눈 dm을 가져옴
  //   - query: { perPage: number(한 페이지 당 몇 개), page: number(페이지) }
  //   - return: IDM[]

  //   ### POST /workspaces/:workspace/dms/:id/chats
  //   - :workspace 내부의 :id와 나눈 dm을 저장
  //   - body: { content: string(내용) }
  //   - return: 'ok'
  //   - dm 소켓 이벤트가 emit됨

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log('dm!!');

      if (chat?.trim()) {
        axios
          .post(
            `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats`,
            {
              content: chat,
            },
            {
              withCredentials: true,
            },
          )
          .then(() => {
            setChat('');
            refetch();
          })
          .catch(console.error);
      }
    },
    [chat, workspace, id],
  );

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatData={chatData} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
