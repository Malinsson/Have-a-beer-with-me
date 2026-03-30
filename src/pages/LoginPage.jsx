import { LoginForm } from '../features/Auth/components/LoginForm'
import { SignupForm } from '../features/Auth/components/SignupForm'
import { useIsGuest } from '../shared/hooks/useIsGuest'

export const LoginPage = () => {

    const isGuest = useIsGuest();

    if (isGuest) {
        return (
            <div className="container mx-auto p-4">
                <h2 className="text-3xl text-center">Välkommen!</h2>
                <h3 className="text-center mt-4">Skapa ett konto för att spara din ölhylla</h3>
                <div className="w-full my-8 md:w-1/2">
                    <SignupForm />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl text-center">Välkommen tillbaka!</h2>
            <h3 className="text-center mt-4">Logga in för att se din profil och designa din egen öl</h3>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
                <div className="w-full md:w-1/2">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

