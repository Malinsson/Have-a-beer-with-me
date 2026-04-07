import { CanPreview2D } from '../can-designer/components/CanPrewiew2D.jsx';
import { useNavigate } from 'react-router-dom';

export const ShelfItem = ({ saved }) => {
    const navigate = useNavigate();

    return (
        <button
            key={saved.id}
            type="button"
            className="text-left flex flex-col gap-4 p-4"
            onClick={() => navigate(`/can/${saved.designs.share_id}`)}
        >
            <CanPreview2D side="front" design={saved.designs?.design_data} />
            <div>
                <h3 className="text-xl font-semibold uppercase">
                    {saved.designs?.design_data?.name?.firstName || "Namnlös"}
                    <br />
                    {saved.designs?.design_data?.name?.lastName || ""}
                </h3>
                <h4 className="text-sm text-dark-gray">
                    {saved.designs?.design_data?.back?.department || ""}
                </h4>
            </div>
        </button>
    );
}