import { createContext, useState } from "react";

export const ModalContext = createContext(null)

export default function ModalContextProvider({ children }) {
  const [openClaimModal, setOpenClaimModal] = useState(true)
  const [openConnectModal, setOpenConnectModal] = useState(true)
  const [addresses, setAddresses] = useState([])
  return <ModalContext.Provider value={{ openClaimModal, setOpenClaimModal, openConnectModal, setOpenConnectModal, addresses, setAddresses }}>{children}</ModalContext.Provider>
};