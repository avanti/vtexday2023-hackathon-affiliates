import React, { createContext, useContext, useState } from 'react';

interface ModalContextData {
  isModalOpen: boolean;
  openModal: (affiliateId: string) => void;
  closeModal: () => void;
  affiliateId: string;
  isApproved: boolean;
  setIsApprovedFn: (isApproved: boolean) => void;

}

export const ModalContext = createContext<ModalContextData>({
  affiliateId: '',
  isModalOpen: false,
  isApproved: false,
  openModal: () => {},
  closeModal: () => {},
  setIsApprovedFn: () => {},
  });

export const ModalProvider: React.FC = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [affiliateId, setAffiliateId] = useState<string >('');
  const [isApproved, setIsApproved] = useState(false);

  const openModal = (id: string) => {
    setAffiliateId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setAffiliateId('');
    setModalOpen(false);
  };
  const setIsApprovedFn = (isApproved: boolean) => {
    setIsApproved(isApproved);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, affiliateId, isApproved, setIsApprovedFn}}>
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
