import { useWeb3React } from '@web3-react/core'
import { connectorsByName } from '../utils/web3React'

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()

  const login = (id) => {
    const connector = connectorsByName[id]
    if (connector) {
      activate(connector, (error) => console.log(error.name, error.message))
    } else {
      alert("WrongConnector")
    }
  }

  return { login, logout: deactivate }
}

export default useAuth