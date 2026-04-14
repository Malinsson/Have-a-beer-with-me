import { SocialmediaField } from "../components/SocialmediaField";

export const SocialStep = ({ instagram, linkedin, github, onChange }) => {
    return (
        <>
            <div className="flex flex-col gap-4">

                <SocialmediaField
                    label="LinkedIn"
                    fieldKey="linkedin"
                    value={linkedin}
                    placeholder="Anders Andersson"
                    onChange={onChange}
                />

                <SocialmediaField
                    label="Instagram"
                    fieldKey="instagram"
                    value={instagram}
                    placeholder="@Andersandersson54"
                    onChange={onChange}

                />

                <SocialmediaField
                    label="GitHub"
                    fieldKey="github"
                    value={github}
                    placeholder="AndersAndersson"
                    onChange={onChange}

                />
            </div>
        </>
     );
}   



