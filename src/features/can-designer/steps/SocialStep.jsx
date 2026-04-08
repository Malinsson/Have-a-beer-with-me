import { ProgressDots } from "../../../shared/components/ProgressDots";

export const SocialStep = ({ instagram, linkedin, github, onChange }) => {
    return (
        <>
            <div className="flex flex-col gap-4">

                <div className="flex flex-col gap-2">
                    <p>
                        <label>Instagram</label>
                    </p>
                    <input
                        value={instagram}
                        onChange={(e) => onChange("instagram", e.target.value)}
                        placeholder="@Andersandersson54"
                        className="border border-b-grey px-4 py-2 w-full"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p>
                        <label>LinkedIn</label>
                    </p>
                    <input
                        value={linkedin}
                        onChange={(e) => onChange("linkedin", e.target.value)}
                        placeholder="Anders Andersson"
                        className="border border-b-grey px-4 py-2 w-full"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p>
                        <label>GitHub</label>
                    </p>
                    <input
                        value={github}
                        onChange={(e) => onChange("github", e.target.value)}
                        placeholder="AndersAndersson"
                        className="border border-b-grey px-4 py-2 w-full"
                    />
                </div>
            </div>
        </>
     );
}   

