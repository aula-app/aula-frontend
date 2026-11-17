import { useModal } from '@/v2/hooks/useModal';
import Modal from './Modal';

const ModalRoot = () => {
  const { modal, closeModal } = useModal();

  return (
    <Modal open={modal !== null} onClose={closeModal} title={modal?.title ?? ''}>
      {modal?.content}
    </Modal>
  );
};

export default ModalRoot;
