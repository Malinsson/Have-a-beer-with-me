import React, { useState, useEffect } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useIsSignedIn } from "../shared/hooks/useIsSignedIn";
import { useLogout } from "../features/Auth/hooks/useLogout";
import { useIsGuest } from "../shared/hooks/useIsGuest";
import { LoginForm } from "../features/Auth/components/LoginForm";
import { useUserSlug } from "../features/profile/hooks/useUserSlug";
import Logo from "../assets/images/yrgo.png";

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    const navigate = useNavigate();
    const slug = useUserSlug();

    const isGuest = useIsGuest();
    const isSignedIn = useIsSignedIn();
    const { logout } = useLogout();

    const NAV_LINKS = [
        { label: "Hem", href: "/" },
        { label: "Min profil", href: `/profile/${slug}` },
        { label: "Min ölhylla", href: `/profile/${slug}/hylla` },
        { label: "Gör om min burk", href: "/design" },
        { label: "Logga ut", href: "#", action: "logout" },
        { label: "Skapa konto", href: "/login" },
    ];

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);

    const handleSearch = (e) => {
        e.preventDefault();
        // Add your search logic here
        console.log("Search query:", searchQuery);
        closeMenu();
    };

    const handleProfileClick = () => {
        navigate(`/profile/${slug}`);
        closeMenu();
    };

    const handleNavLinkClick = async (event, link) => {
        if (link.action === "logout") {
            event.preventDefault();
            const didLogout = await logout();
            closeMenu();
            if (didLogout) {
                // Redirect with hard reload to ensure all user data is cleared from memory
                window.location.assign("/");
            }
            return;
        }

        closeMenu();
    };

    return (
        <header className="sticky top-0 left-0 right-0 p-4 flex items-center justify-between w-full bg-white z-50">
            <div className="w-12 h-12 relative z-60">
                <img 
                    src={Logo}
                    alt="yrgo-logo" 
                    className="w-full h-full object-contain" 
                    onClick={() => navigate("/")}
                />
            </div>

            <div className="flex items-center gap-4">

                {isSignedIn && (
                    <div className="flex gap-3 items-center">
                        {isGuest && (
                            <p className="inline text-xl">Gäst</p>
                        )}
                        <button
                            type="button"
                            className="text-4xl relative z-60 transition-transform duration-300 hover:opacity-70"
                            onClick={handleProfileClick}
                            aria-label="Go to profile"
                        >
                            <CgProfile className="text-3xl" />
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    className="text-4xl relative z-60 transition-transform duration-300"
                    onClick={toggleMenu}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="nav-menu"
                >
                    {menuOpen ? <IoCloseOutline /> : <RxHamburgerMenu className="text-3xl"/>}
                </button>
            </div>

            <nav 
                id="nav-menu" 
                className={`
                    fixed top-16 left-0 right-0 w-full h-screen bg-white flex flex-col p-6 transition-all duration-300 ease-in-out
                    ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
                `}
                style={{ zIndex: 55 }}
            >
                {(isSignedIn || isGuest) && (
                    <ul className="flex flex-col gap-8">
                        {NAV_LINKS.filter(link => {
                            if(link.action === "logout"){
                                return isSignedIn && !isGuest
                            }
                            if(link.href === "/login"){
                                return isGuest
                            }
                            return true
                        }).map((link) => (
                            <li key={link.href}>
                                <a 
                                    href={link.href} 
                                    onClick={(event) => handleNavLinkClick(event, link)}
                                    className="text-2xl font-regular tracking-tighter"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}

                        <form onSubmit={handleSearch} className="w-full">
                            <label className="text-2xl font-regular tracking-tighter">Sök burk-ID</label>
                            <div className="flex justify-between gap-2 mt-4">
                                <input
                                    type="text"
                                    placeholder="Sök öl burk..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 border border-black rounded-lg"
                                />
                                <button type="submit" className="bg-blue-950 rounded-full p-2">
                                    <IoSearchOutline className="text-2xl text-white" />
                                </button>
                            </div>
                        </form>
                    </ul>
                )}
                    
                {!isSignedIn && !isGuest && (
                    <div className="w-full max-w-sm mx-auto mt-12">
                        <LoginForm onSuccess={closeMenu} />
                    </div>
                )}
            </nav>
        </header>
    );
}