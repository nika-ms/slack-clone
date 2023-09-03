// import EachChannel from '@components/EachChannel';

import { CollapseButton } from '@components/DMList/styles';
import { useQuery } from '@tanstack/react-query';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

const ChannelList: FC = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const [channelCollapse, setChannelCollapse] = useState(false);

  const { data: userData } = useQuery<IUser>(['user'], () =>
    axios
      .get('http://localhost:3095/api/users')
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.response);
      }),
  );

  const { data: channelData } = useQuery<IChannel[]>(['workspace', workspace, 'channel'], () =>
    axios
      .get(`http://localhost:3095/api/workspaces/${workspace}/channels`)
      .then((res) => res.data)
      .catch((err) => {
        err.response;
      }),
  );

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

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
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
          channelData?.map((channel) => {
            return (
              <NavLink key={channel.name} to={`/workspace/${workspace}/channel/${channel.name}`}>
                <span># {channel.name}</span>
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default ChannelList;
