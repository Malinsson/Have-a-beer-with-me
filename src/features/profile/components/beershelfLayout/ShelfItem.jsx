import { CanPreview2D } from "../../../can-designer/components/CanPrewiew2D.jsx";
import { useNavigate } from 'react-router-dom';

export const ShelfItem = ({ can }) => {
    const navigate = useNavigate();

    return (
        <div 
            key={can.savedId} 
            className="flex flex-col"
            onClick={() => navigate(`/profile/${can.ownerSlug}`)}
        >
            <div className="flex items-center justify-center w-1/2 mt-4 mx-auto">
            <CanPreview2D 
                side="front" 
                design={can} 
                scale={1} 
                textScale={0.45} 
            />
            </div>

            <div className="pl-2 mt-3">
                <p className="bold text-base leading-5">
                    {can.ownerFirstName} <br /> {can.ownerLastName}
                </p>
                <h4 className="text-base text-black">
                    {can.department}
                </h4>
            </div>
        </div>
    );
}