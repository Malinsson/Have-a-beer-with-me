import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoginForm } from '../features/Auth/components/LoginForm'
import { SignupForm } from '../features/Auth/components/SignupForm'
import { useIsGuest } from '../shared/hooks/useIsGuest'

export const LoginPage = () => {

    const [signUp, setSignUp] = useState(false);
    const navigate = useNavigate();
    const { slug } = useParams();
    const isGuest = useIsGuest();

    useEffect(() => {
        if (isGuest) {
            setSignUp(true);
        }
    }, [isGuest]);

    return (
        <div className="container mx-auto p-4">
            <h2>{signUp ? "Skapa konto" : "Logga in"}</h2>
            <p className='pt-3 w-55'>
                {signUp
                    ? "Skapa ett konto för att spara din ölhylla"
                    : "Logga in för att se din profil och designa din egen öl"}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="w-full md:w-1/2">
                    {signUp ? (
                        <SignupForm 
                        onSwitchToLogin={() => setSignUp(false)}
                        onSuccess={() => navigate(`/profile/${slug}`)}
                         />
                    ) : (
                        <LoginForm 
                        onSwitchToSignup={() => setSignUp(true)}
                        onSuccess={() => navigate(`/profile/${slug}`)} 
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

