import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNameStep } from "../hooks/useNameStep";
import { Button } from "../../../shared/components/Button";
import { ProgressDots } from "../../../shared/components/ProgressDots";
import { DrinkTypeStep } from "./DrinkTypeStep";
import { useDesignStore } from "../../../store/designStore";
import { getDrinkTypeLabelById } from "../constants";


export const NameStep = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [department, setDepartment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [drinkTypeError, setDrinkTypeError] = useState("");

    // Access design store to set name and drink type before navigating to the next step
    const setName = useDesignStore((state) => state.setName);
    const setFront = useDesignStore((state) => state.setFront);
    const setBack = useDesignStore((state) => state.setBack);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!selectedDrink) {
            setIsLoading(false);
            return setDrinkTypeError("Välj en dryckestyp för att fortsätta.");
        }

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
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 w-full items-stretch justify-between min-h-0">
            <div className="w-full">
                <div className="border px-4 py-6 w-full justify-center">
                    <div>
                        <label htmlFor="firstName"><p>Förnamn<sup>*</sup></p></label>
                        <input
                            id="firstName"
                            type="text"
                            placeholder="Anders"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            max={20}
                            maxLength={20}
                            className="mt-2 mb-4 px-4 py-2 border border-gray-300 w-full"
                        />
                    </div>

                <div>
                    <label htmlFor="lastName"><p>Efternamn<sup>*</sup></p></label>
                    <input
                        id="lastName"
                        type="text"
                        placeholder="Andersson"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        max={20}
                        maxLength={20}
                        className="mt-2 mb-4 px-4 py-2 border border-gray-300 w-full"
                    />
                </div>

                <div>
                    <label htmlFor="department"><p>Jobb/Studier<sup>*</sup></p></label>
                    <input
                        id="department"
                        type="text"
                        placeholder="Digital designer"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        max={30}
                        maxLength={30}
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

                    {drinkTypeError && (
                        <p role="alert" className="text-red-500 text-center">
                            Välj en dryckestyp för att fortsätta.
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col w-full p-4 justify-center items-center gap-6 mt-auto pb-4">

                <section>
                    <ProgressDots total={3} current={3} />
                </section>
                
                <Button
                    type="submit"
                    variant="primary"
                    text="Börja designa din burk"
                    disabled={isLoading}
                    className="px-2"
                >      
                </Button>

            </div>
           
        </form>
    );
};
