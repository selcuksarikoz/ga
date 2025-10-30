"use client";

import { createContext, useContext, useState } from "react";

type ModalType = "add-game" | "add-developer";

interface ModalContextType {
  isOpen: boolean;
  type: ModalType | null;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<ModalType | null>(null);

  const openModal = (modalType: ModalType) => {
    setType(modalType);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setType(null);
  };

  const value = {
    isOpen,
    type,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}
