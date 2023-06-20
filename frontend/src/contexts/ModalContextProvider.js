import { createContext, useState } from "react";

export const ModalContext = createContext(null)

export default function ModalContextProvider({ children }) {
  const [openClaimModal, setOpenClaimModal] = useState(true)
  const [openConnectModal, setOpenConnectModal] = useState(true)
  const [addresses, setAddresses] = useState(["0x97434C6863F4512d2630AA2c809E01DBf99d824B"])
  return <ModalContext.Provider value={{ openClaimModal, setOpenClaimModal, openConnectModal, setOpenConnectModal, addresses, setAddresses }}>{children}</ModalContext.Provider>
};