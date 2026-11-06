import { createContext, FunctionComponent, PropsWithChildren, ReactNode, useContext, useState } from 'react';

type ModalState = { title: string; content: ReactNode } | null;

interface ModalContextValue {
  modal: ModalState;
  openModal: (title: string, content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [modal, setModal] = useState<ModalState>(null);

  const openModal = (title: string, content: ReactNode) => setModal({ title, content });
  const closeModal = () => setModal(null);

  return <ModalContext.Provider value={{ modal, openModal, closeModal }}>{children}</ModalContext.Provider>;
};

export const useModal = (): ModalContextValue => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within a ModalProvider');
  return ctx;
};
