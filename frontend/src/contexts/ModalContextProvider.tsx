import { createContext, useState } from "react";

export const ModalContext = createContext<any>(null)

export default function ModalContextProvider({ children }: any) {
  const [openClaimModal, setOpenClaimModal] = useState(true)
  return <ModalContext.Provider value={{ openClaimModal, setOpenClaimModal }}>{children}</ModalContext.Provider>
};