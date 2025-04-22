import React, { createContext, useContext, useState } from 'react';

type ModalOptions = {
  title?: string;
  description?: string;
  isModal?: boolean;
};

type ModalContextType = {
  title: string;
  description: string;
  isModal: boolean;
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  open: (data: ModalOptions) => void;
  close: () => void;
  toggleOpen: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isModal, setIsModal] = useState(false);

  const clear = () => {
    setTitle('');
    setDescription('');
  };

  const openModal = (options: ModalOptions) => {
    const { title, description, isModal } = options;

    setTitle(title ?? '');
    setDescription(description ?? '');
    setIsModal(isModal ?? false);

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clear();
  };
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <ModalContext.Provider
      value={{
        title,
        description,
        isModal,
        isOpen: isModalOpen,
        setIsModalOpen,
        open: openModal,
        close: closeModal,
        toggleOpen: toggleModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
