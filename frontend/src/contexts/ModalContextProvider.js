import { createContext, useState } from "react";

export const ModalContext = createContext(null)

export default function ModalContextProvider({ children }) {
  const [openClaimModal, setOpenClaimModal] = useState(true)
  const [openConnectModal, setOpenConnectModal] = useState(false)
  return <ModalContext.Provider value={{ openClaimModal, setOpenClaimModal, openConnectModal, setOpenConnectModal }}>{children}</ModalContext.Provider>
};