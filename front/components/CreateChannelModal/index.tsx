import Modal from '@components/Modal';
import useInput from '@hooks/useinput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { useQuery } from '@tanstack/react-query';
import { IChannel } from '@typings/db';
import axios from 'axios';
import React, { FC, VFC, useCallback, useEffect } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const { data: channelData, refetch } = useQuery<IChannel[]>(['channels'], () =>
    axios
      .get(`http://localhost:3095/api/workspaces/${workspace}/channels`, { withCredentials: true })
      .then((res) => res.data)
      .catch((err) => {
        console.dir(err);
        toast.error(err.response?.data, {
          position: 'bottom-center',
        });
      }),
  );

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(`http://localhost:3095/api/workspaces/${workspace}/channels`, {
          name: newChannel,
        })
        .then(() => {
          setShowCreateChannelModal(false);
          setNewChannel('');
          refetch();
        })
        .catch((err) => {
          console.dir(err);
          toast.error(err.response?.data, {
            position: 'bottom-center',
          });
        });
    },
    [newChannel],
  );

  if (!show) {
    return null;
  }

  return (
    <div>
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateChannel}>
          <Label id="channel-label">
            <span>채널</span>
            <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  );
};

export default CreateChannelModal;
