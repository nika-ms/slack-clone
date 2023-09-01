import React, { FC, useCallback } from 'react';
import { CloseModalButton, CreateModal } from './style';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const Modal: FC<Props> = ({ show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div>
      <CreateModal onClick={onCloseModal}>
        <div onClick={stopPropagation}>
          <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
          {children}
        </div>
      </CreateModal>
    </div>
  );
};

export default Modal;
