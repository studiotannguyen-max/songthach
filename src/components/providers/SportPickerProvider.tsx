'use client';

import { createContext, useContext, useState } from 'react';

type SportPickerContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const SportPickerContext = createContext<SportPickerContextType | null>(null);

export function SportPickerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SportPickerContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </SportPickerContext.Provider>
  );
}

export function useSportPicker() {
  const ctx = useContext(SportPickerContext);
  if (!ctx) throw new Error('useSportPicker must be used inside SportPickerProvider');
  return ctx;
}
