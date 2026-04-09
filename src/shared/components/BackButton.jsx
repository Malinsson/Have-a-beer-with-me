import { MdArrowBackIos } from "react-icons/md";

import { useNavigate } from "react-router-dom";

export const BackButton = ({ to, onClick }) => {  // ← onClick was missing here
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) onClick();
        else if (to) navigate(to);
        else navigate(-1);
    };

    return (
        <button onClick={handleClick} aria-label="Go back">
            <MdArrowBackIos className="p-2 text-4xl" />
        </button>
    );
};