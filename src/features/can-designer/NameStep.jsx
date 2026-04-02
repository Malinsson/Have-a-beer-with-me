import { useState } from "react";
import { useNameStep } from "./hooks/useNameStep";
import { Button } from "../../components/Button";
import { ProgressDots } from "../../components/ProgressDots";
import { DrinkTypeStep } from "./DrinkTypeStep";


export const NameStep = ({ onNext }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [department, setDepartment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDrink, setSelectedDrink] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const didSave = await saveName(firstName, lastName);
        if (didSave) {
            onNext({ firstName, lastName, department });
        }
        setIsLoading(false);
    };

    const { saveName, error } = useNameStep();

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            <div className="border px-4 py-6 w-full justify-center">

                <div>
                    <label htmlFor="firstName"><p>Förnamn</p></label>
                    <input
                        id="firstName"
                        type="text"
                        placeholder="Anders"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="mt-2 mb-4 px-4 py-2 border border-gray-300 w-full"
                    />
                </div>

                <div>
                    <label htmlFor="lastName"><p>Efternamn</p></label>
                    <input
                        id="lastName"
                        type="text"
                        placeholder="Andersson"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="mt-2 mb-4 px-4 py-2 border border-gray-300 w-full"
                    />
                </div>

                <div>
                    <label htmlFor="department"><p>Jobb/Studier</p></label>
                    <input
                        id="department"
                        type="text"
                        placeholder="Digital designer"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        className="mt-2 px-4 py-2 border border-gray-300 w-full"
                    />
                </div>
            </div>
            
            {error && <p role="alert">{error}</p>}

            <div className="w-full text-start mt-4">
                <p>Vad ska din burk innehålla?</p>
                <DrinkTypeStep 
                    selected={selectedDrink} 
                    onSelect={(id) => setSelectedDrink(id)} 
                />
            </div>
            <section>
                <ProgressDots total={3} current={3} />
            </section>
            
            <Button
                type="submit"
                variant="primary"
                text="Börja designa din ölburk"
                disabled={isLoading}
            >      
            </Button>
           
        </form>
    );
};
