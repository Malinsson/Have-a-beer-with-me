// shared/components/LoginRedirectMessage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import scanCanImage from "../../assets/images/yrgo-can.png";

export const LoginRedirectMessage = ({ message }) => {
    const [countdown, setCountdown] = useState(3);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        const redirect = setTimeout(() => navigate("/login"), 3000);
        return () => { clearInterval(timer); clearTimeout(redirect); };
    }, []);

    return (
        <div className="flex flex-col mt-12 gap-4 w-full text-center p-6">
            <h3>{message}</h3>
            <div className="flex justify-center">
                <img src={scanCanImage} alt="empty shelf" className="w-40 h-auto object-contain my-10" />
            </div>
            <p>Du skickas till inloggningen om <span className="bold text-xl text-yrgo-red">{countdown}</span> sekunder...</p>
        </div>
    );
};