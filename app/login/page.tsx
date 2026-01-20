import { Suspense } from 'react';
import LoginForm from '../ui/login/loginForm';


export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
