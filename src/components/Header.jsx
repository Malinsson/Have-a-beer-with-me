import { useState, useEffect } from "react";
import { IoSearchOutline, IoCloseSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useIsSignedIn } from "../shared/hooks/useIsSignedIn";
import { useLogout } from "../features/Auth/hooks/useLogout";
import { useIsGuest } from "../shared/hooks/useIsGuest";
import { useUserSlug } from "../features/profile/hooks/useUserSlug";
import Logo from "../assets/images/yrgo.png";
import beerHeaderIcon from "../assets/icons/beerHeaderIcon.svg";

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
        { label: "Min barhylla", href: `/profile/${slug}/hylla` },
        { 
            label: isSignedIn && !isGuest ? "Logga ut" : "Logga in / Skapa konto",
            href: isSignedIn && !isGuest ? "#" : "/login",
            action: isSignedIn && !isGuest ? "logout" : undefined
          },
    ];

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/can/${searchQuery.trim()}`);
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
                            <img src={beerHeaderIcon} alt="Profile" className="text-3xl" />
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
                    {menuOpen ? <IoCloseSharp /> : <GiHamburgerMenu />}
                </button>
            </div>

            <nav 
                id="nav-menu" 
                className={`
                    fixed top-16 left-0 right-0 w-full z-100 bg-white flex flex-col p-6
                    transition-all duration-300 ease-in-out
                    ${menuOpen 
                        ? "opacity-100 translate-y-0 pointer-events-auto" 
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`} >
                
                    <ul className={`
                        flex flex-col gap-8
                        transition-opacity duration-200
                        ${menuOpen ? "opacity-100 delay-150" : "opacity-0"}
                      `}>
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <a 
                                    href={link.href} 
                                    onClick={(event) => handleNavLinkClick(event, link)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}

                        <form onSubmit={handleSearch} className="w-full mb-2">
                            <label className="text-base font-semibold uppercase">Sök burk-ID</label>
                            <div className="flex justify-between gap-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Sök öl burk..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 border border-b-grey"
                                />
                                <button type="submit">
                                    <IoSearchOutline className="text-3xl" />
                                </button>
                            </div>
                        </form>
                    </ul>
                
                    
                {/* {!isSignedIn && !isGuest && (
                    <div className="w-full max-w-sm mx-auto mt-12">
                        <LoginForm onSuccess={closeMenu} />
                    </div>
                )} */}
            </nav>
        </header>
    );
}