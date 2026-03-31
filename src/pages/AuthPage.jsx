import { SignupForm } from "../features/Auth/components/SignupForm";
import { LoginForm } from "../features/Auth/components/LoginForm";

export const AuthPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1>Auth Page</h1>
            <LoginForm />
            <SignupForm />
        </div>
    );
}