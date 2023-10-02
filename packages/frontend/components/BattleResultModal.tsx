import React from 'react';
import Modal from './Modal';
import useBattle from '@/hooks/useBattle';

type Props = {
  open: boolean;
  onClose: () => void;
};

const BattleModal = ({ open, onClose }: Props) => {
  const {} = useBattle();

  return (
    <Modal open={open} onClose={onClose}>
      <></>
    </Modal>
  );
};

export default BattleModal;
