import Routers from './services/routes'
import AuthProvider from './contexts/AuthContext'
import { LoadingProvider } from './contexts/LoadingContext'
import { SplitBillProvider } from './contexts/SplitBillContext'


function App() {

  return (
    <>
      <AuthProvider>
        <LoadingProvider>
          <SplitBillProvider>
            <Routers />
          </SplitBillProvider>
        </LoadingProvider>
      </AuthProvider>
    </>
  )
}

export default App
