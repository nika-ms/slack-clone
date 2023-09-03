// import EachDM from '@components/EachDM';
// import useSocket from '@hooks/useSocket';
import { CollapseButton } from '@components/DMList/styles';
import { useQuery } from '@tanstack/react-query';
import { IDM, IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

const DMList: FC = () => {
  const { workspace } = useParams<{ workspace?: string }>();

  const { data: userData } = useQuery<IUser>(['userData'], () => {
    return axios
      .get('http://localhost:3095/api/users')
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.data);
      });
  });

  const { data: memberData } = useQuery<IUser[]>(['workspace', workspace, 'member'], () =>
    axios
      .get(`http://localhost:3095/api/workspaces/${workspace}/members`)
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      }),
  );

  //   const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  useEffect(() => {
    console.log('DMList: workspace 바꼈다', workspace);
    setOnlineList([]);
  }, [workspace]);

  //   useEffect(() => {
  //     socket?.on('onlineList', (data: number[]) => {
  //       setOnlineList(data);
  //     });
  //     console.log('socket on dm', socket?.hasListeners('dm'), socket);
  //     return () => {
  //       console.log('socket off dm', socket?.hasListeners('dm'));
  //       socket?.off('onlineList');
  //     };
  //   }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return (
              <NavLink key={member.id} to={`/workspace/${workspace}/dm/${member.id}`}>
                <i
                  className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                    isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                  }`}
                  aria-hidden="true"
                  data-qa="presence_indicator"
                  data-qa-presence-self="false"
                  data-qa-presence-active="false"
                  data-qa-presence-dnd="false"
                />
                <span>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default DMList;
