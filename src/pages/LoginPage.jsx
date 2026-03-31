import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../features/Auth/components/LoginForm'
import { SignupForm } from '../features/Auth/components/SignupForm'
import { useIsGuest } from '../shared/hooks/useIsGuest'

export const LoginPage = () => {

    const [signUp, setSignUp] = useState(false);
    const navigate = useNavigate();
    const isGuest = useIsGuest();

    useEffect(() => {
        if (isGuest) {
            setSignUp(true);
        }
    }, [isGuest]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl text-center">{signUp ? "Välkommen!" : "Välkommen tillbaka!"}</h2>
            <h3 className="text-center mt-4">
                {signUp
                    ? "Skapa ett konto för att spara din ölhylla"
                    : "Logga in för att se din profil och designa din egen öl"}
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
                <div className="w-full md:w-1/2">
                    {signUp ? (
                        <SignupForm 
                        onSwitchToLogin={() => setSignUp(false)}
                        onSuccess={() => navigate("/profile/1")}
                         />
                    ) : (
                        <LoginForm 
                        onSwitchToSignup={() => setSignUp(true)}
                        onSuccess={() => navigate("/profile/1")} 
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

