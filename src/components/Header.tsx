import React, { useState } from "react";

interface NavLink {
    label: string;
    href: string;
}

const YRGO_RED = "#e30613";

const NAV_LINKS: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "Design", href: "/design" },
    { label: "Profile", href: "/profile" },
];

export const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="relative p-4 flex items-center justify-between w-full bg-white z-50">
            <div className="w-12 h-12 relative z-[60]">
                <img 
                    src="../src/assets/images/yrgo.png" 
                    alt="yrgo-logo" 
                    className="w-full h-full object-contain" 
                />
            </div>


            <button
                type="button"
                className="text-4xl relative z-[60] transition-transform duration-300"
                onClick={toggleMenu}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="nav-menu"
            >
                {menuOpen ? "✕" : "☰"}
            </button>

            <nav 
                id="nav-menu" 
                className={`
                    fixed inset-0 w-full h-screen bg-white flex flex-col items-center justify-center transition-all duration-300 ease-in-out
                    ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
                `}
                style={{ zIndex: 55 }}
            >
                <ul className="flex flex-col items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <a 
                                href={link.href} 
                                onClick={closeMenu}
                                className="text-3xl font-black uppercase tracking-tighter hover:text-red-600 transition-colors"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}