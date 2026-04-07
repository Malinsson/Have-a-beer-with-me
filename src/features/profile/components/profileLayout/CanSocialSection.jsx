import { SiInstagram, SiGithub } from "react-icons/si";
import { CiLinkedin } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineArrowOutward } from "react-icons/md";


const SOCIAL_CONFIG = [
    { key: 'linkedin', label: 'LinkedIn', Icon: CiLinkedin, baseUrl: "https://www.linkedin.com/in/" },
    { key: 'instagram', label: 'Instagram', Icon: SiInstagram, baseUrl: "https://www.instagram.com/" },
    { key: 'github', label: 'Github', Icon: SiGithub, baseUrl: "https://github.com/" },
];

const getContactLinks = (socialsData, profile) => {
    const links = SOCIAL_CONFIG
        .map((config) => {
            const username = socialsData?.[config.key];
            if (!username) return null;

            return {
                id: config.key,
                href: `${config.baseUrl}${username}`,
                Icon: config.Icon,
                label: username,
                isExternal: true,
            };
        })
        .filter(Boolean);

    if (profile?.email) {
        links.push({
            id: 'email',
            href: `mailto:${profile.email}`,
            Icon: HiOutlineMail,
            label: profile.email,
            isExternal: false,
        });
    }

    return links;
};

export const CanSocialSection = ({ socialsData, profile }) => {
    const contactLinks = getContactLinks(socialsData, profile);

    return (
        <div className="flex flex-col gap-4 mb-12 px-2 max-w-sm">
            {contactLinks.map((link) => {
                const Icon = link.Icon;
                return (
                    <a
                        key={link.id}
                        href={link.href}
                        {...(link.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                        className="flex items-center gap-4 hover:opacity-70 transition-opacity"
                    >
                        <Icon className="text-3xl shrink-0" />
                        <div className="grow">
                            <span>{link.label}</span>
                        </div>
                        <MdOutlineArrowOutward className="text-2xl text-black" />
                    </a>
                );
            })}
        </div>
    );
};