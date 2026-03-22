import './App.css'
import { SignupForm } from './features/auth/components/SignupForm.tsx';
import { LoginForm } from './features/auth/components/LoginForm.tsx';
import { ListUsers } from './ListUsers.tsx';



function App() {


  return (
    <>
      <h1>Have a beer with me</h1>
      <SignupForm />
      <LoginForm />
      <ListUsers />
    </>
  )
}
export default App
