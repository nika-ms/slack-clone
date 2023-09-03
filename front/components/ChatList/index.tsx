import React, { VFC } from 'react';
import { ChatZone, Section } from './styles';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';

interface Props {
  chatData?: IDM[];
}

const ChatList: VFC<Props> = ({ chatData }) => {
  return (
    <ChatZone>
      <div>
        {chatData?.map((item) => {
          return <Chat key={item.id} data={item}></Chat>;
        })}
      </div>
    </ChatZone>
  );
};

export default ChatList;
