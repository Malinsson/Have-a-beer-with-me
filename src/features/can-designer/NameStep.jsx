import { useState } from "react";
import { useNameStep } from "./hooks/useNameStep";
import { Button } from "../../components/Button";

export const NameStep = ({ onNext }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [department, setDepartment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const didSave = await saveName(firstName, lastName);
        if (didSave) {
            onNext({ firstName, lastName, department });
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
                        value={firstName}
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
                        value={lastName}
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

            <Button
                type="submit"
                variant="primary"
                text="Börja designa din öl"
            >
                    
            </Button>
            {error && <p role="alert">{error}</p>}
        </form>
    );
};
