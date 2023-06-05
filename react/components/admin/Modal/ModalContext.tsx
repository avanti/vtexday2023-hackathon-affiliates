import React, { createContext, useContext, useEffect, useState } from 'react';

interface ModalContextData {
  isModalOpen: boolean;
  openModal: (affiliateId: string, refetch: () => void) => void;
  closeModal: () => void;
  affiliateId: string;
  refetch?: () => void;
}

export const ModalContext = createContext<ModalContextData>({
  affiliateId: '',
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  });

export const ModalProvider: React.FC = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [affiliateId, setAffiliateId] = useState<string >('');
  const [refetch, setRefetch] = useState<(() => void) | undefined>(undefined);

  const openModal = (id: string, refetch: () => void) => {
    setAffiliateId(id);
    setModalOpen(true);
    setRefetch(refetch);
  };

  const closeModal = () => {
    setAffiliateId('');
    setModalOpen(false);
  };

  useEffect(() => {
    console.log('affiliateId', affiliateId)
  }
  , [affiliateId]);

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, affiliateId, refetch }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextData => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};
