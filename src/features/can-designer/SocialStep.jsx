
export const SocialStep = ({ instagram, linkedin, github, onChange }) => {
    return (
        <div className="flex flex-col gap-4 mt-6">

            <div className="flex flex-col gap-2">
                <label>Instagram</label>
                <input
                    value={instagram}
                    onChange={(e) => onChange("instagram", e.target.value)}
                    placeholder="@Andersandersson54"
                    className="border border-neutral-300 rounded-lg px-4 py-2 w-full"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label>LinkedIn</label>
                <input
                    value={linkedin}
                    onChange={(e) => onChange("linkedin", e.target.value)}
                    placeholder="Anders Andersson"
                    className="border border-neutral-300 rounded-lg px-4 py-2 w-full"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label>GitHub</label>
                <input
                    value={github}
                    onChange={(e) => onChange("github", e.target.value)}
                    placeholder="AndersAndersson"
                    className="border border-neutral-300 rounded-lg px-4 py-2 w-full"
                />
            </div>
        </div>
     );
}   

