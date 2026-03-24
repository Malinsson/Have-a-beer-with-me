import React, { useState } from "react";
import { type ChangeEvent } from "react";
import { IoSearchOutline } from "react-icons/io5";


interface NavLink {
    label: string;
    href: string;
}

const NAV_LINKS: NavLink[] = [
    { label: "Hem", href: "/" },
    { label: "Min profil", href: "/profile/1" },
    { label: "Min ölhylla", href: "/profile/1/hylla" },
    { label: "Gör om min burk", href: "/design" },
];

export const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);

    const handleSearch = (e: ChangeEvent) => {
        e.preventDefault();
        // Add your search logic here
        console.log("Search query:", searchQuery);
        closeMenu();
    };

    return (
        <header className="sticky top-0 left-0 right-0 p-4 flex items-center justify-between w-full bg-white z-50">
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
                    fixed top-16 left-0 right-0 w-full h-screen bg-white flex flex-col p-6 transition-all duration-300 ease-in-out
                    ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
                `}
                style={{ zIndex: 55 }}
            >
                <ul className="flex flex-col gap-8">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <a 
                                href={link.href} 
                                onClick={closeMenu}
                                className="text-2xl font-regular tracking-tighter"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}

                    <form onSubmit={handleSearch} className="mt-12 w-full">
                        <label className="text-2xl font-regular tracking-tighter">Sök burk-ID</label>
                        <div className="flex justify-between gap-2 mt-4">
                            <input
                                type="text"
                                placeholder="Sök öl burk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border-1 border-black rounded-lg"
                            />
                            <button type="submit" className="bg-blue-950 rounded-full p-2">
                                <IoSearchOutline className="text-2xl text-white" />
                            </button>
                        </div>
                    </form>
                </ul>
            </nav>
        </header>
    );
}