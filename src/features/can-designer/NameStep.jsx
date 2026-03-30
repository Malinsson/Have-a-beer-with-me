import { useState } from "react";
import { useNameStep } from "./hooks/useNameStep";

export const NameStep = ({ onNext }) => {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [department, setDepartment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const didSave = await saveName(first_name, last_name);
        if (didSave) {
            onNext({ first_name, last_name, department });
        }
    };

    const { saveName, error } = useNameStep();

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-8">
            <div className="flex flex-col gap-4 border border-gray-300 px-4 py-6 mb-8 justify-center">

                <div>
                    <label htmlFor="firstName" className="block text-md font-medium text-gray-700">Förnamn</label>
                    <input
                        id="firstName"
                        type="text"
                        placeholder="Anders"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="mt-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-md font-medium text-gray-700">Efternamn</label>
                    <input
                        id="lastName"
                        type="text"
                        placeholder="Andersson"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="mt-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>

                <div>
                    <label htmlFor="department" className="block text-md font-medium text-gray-700">Jobb/Studier</label>
                    <input
                        id="department"
                        type="text"
                        placeholder="Digital designer"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        className="mt-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="bg-dark-blue text-white py-2 px-4 rounded-full max-w-fit "
            >
                Börja designa din öl
            </button>
            {error && <p role="alert">{error}</p>}
        </form>
    );
};
