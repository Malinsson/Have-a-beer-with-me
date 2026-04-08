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
            <div className="w-full flex items-center justify-center px-12 mt-4">
                <CanPreview2D side="front" design={can} scale={0.6} />
            </div>

            <div className="pl-2 mt-3">
                <p className="bold text-xl">
                    {can.ownerFirstName} <br /> {can.ownerLastName}
                </p>
                <h4 className="text-lg text-black">
                    {can.department}
                </h4>
            </div>
        </div>
    );
}