
export const SocialmediaField = ({ label, fieldKey, value, placeholder, onChange }) => {
    
    return (
        <div className="flex flex-col gap-2">
            <p>
                <label>{label}</label>
            </p>
            <input
                value={value}
                onChange={(e) => onChange(fieldKey, e.target.value)}
                placeholder={placeholder}
                max={30}
                maxLength={30}
                className="border border-b-grey px-4 py-2 w-full"
            />
        </div>
    )};