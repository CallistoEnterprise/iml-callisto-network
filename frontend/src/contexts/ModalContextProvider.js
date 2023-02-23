import { createContext, useState } from "react";

export const ModalContext = createContext(null)

export default function ModalContextProvider({ children }) {
  const [openClaimModal, setOpenClaimModal] = useState(true)
  return <ModalContext.Provider value={{ openClaimModal, setOpenClaimModal }}>{children}</ModalContext.Provider>
};