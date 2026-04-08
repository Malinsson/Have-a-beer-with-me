

export const CanInfoSection = ({ backData }) => {
    return (
        <div className="mt-8 mb-6">
            <h3>Innehållsförteckning</h3>
            <p>{backData.description || "Ingen beskrivning tillagd."}</p>
        </div>
    )};