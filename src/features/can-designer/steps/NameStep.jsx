import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNameStep } from "../hooks/useNameStep";
import { Button } from "../../../components/Button";
import { ProgressDots } from "../../../components/ProgressDots";
import { DrinkTypeStep } from "./DrinkTypeStep";
import { useDesignStore } from "../../../store/designStore";
import { getDrinkTypeLabelById } from "../constants";


export const NameStep = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [department, setDepartment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDrink, setSelectedDrink] = useState(null);

    // Access design store to set name and drink type before navigating to the next step
    const setName = useDesignStore((state) => state.setName);
    const setFront = useDesignStore((state) => state.setFront);
    const setBack = useDesignStore((state) => state.setBack);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await saveName(firstName, lastName);
        const didSave = result?.success;
        const profileSlug = result?.slug || "";

        if (didSave) {
            const drinkTypeId = selectedDrink || "";
            const drinkTypeLabel = getDrinkTypeLabelById(drinkTypeId);

            // Update the design store with the entered name and selected drink type before navigating to the next step
            setName(firstName, lastName, drinkTypeLabel);
            setFront({ drinkTypeId, drinkType: drinkTypeLabel });
            setBack({ department });
            navigate("/design", {
                state: {
                    firstName,
                    lastName,
                    department,
                    drinkTypeId,
                    drinkTypeLabel,
                    slug: profileSlug,
                },
            });
        }

        setIsLoading(false);
    };

    // Save name to the database
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
