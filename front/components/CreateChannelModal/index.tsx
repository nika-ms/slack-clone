import Modal from '@components/Modal';
import useInput from '@hooks/useinput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import React, { FC, useCallback } from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const CreateChannelModal: FC<Props> = ({ show, children, onCloseModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const onCreateChannel = useCallback(() => {}, []);

  if (!show) {
    return null;
  }

  return (
    <div>
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateChannel}>
          <Label id="channel-label">
            <span>채널</span>
            <Input id="workspace" value={newChannel} onChange={onChangeNewChannel} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  );
};

export default CreateChannelModal;
