import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useIsSignedIn } from "../hooks/useIsSignedIn";
import { useLogout } from "../../features/Auth/hooks/useLogout";
import { useIsGuest } from "../hooks/useIsGuest";
import { useUserSlug } from "../../features/profile/hooks/useUserSlug";
import Logo from "../../assets/images/logo/yrgo.png";
import beerHeaderIcon from "../../assets/icons/beerHeaderIcon.svg";
import { useSearchForm } from "../hooks/useSearchForm";
import { SearchForm } from "./SearchForm";
import { IoCloseSharp } from "react-icons/io5";


export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    
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

    const { searchQuery, setSearchQuery, handleSearch, searchError, isSearching } = useSearchForm({ onSuccess: closeMenu });

    const handleProfileClick = () => {
        navigate(`/profile/${slug}`);
        closeMenu();
    };

    const handleNavLinkClick = async (link) => {
        if (link.action === "logout") {
            const didLogout = await logout();
            closeMenu();
            if (didLogout) {
                // Redirect with hard reload to ensure all user data is cleared from memory
                window.location.assign("/");
            }
            return;
        }

        navigate(link.href);
        if (link.href === "/") window.scrollTo(0, 0);
        closeMenu();
    };

    return (
        <header className="sticky top-0 left-0 right-0 p-4 flex items-center justify-between w-full bg-white z-50">
            <div className="w-12 h-12 relative z-60">
                <img 
                    src={Logo}
                    alt="yrgo-logo" 
                    className="w-full h-full object-contain" 
                    onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
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

            {menuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            )}

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
                                <button
                                    type="button"
                                    className="menu-links text-left"
                                    onClick={() => handleNavLinkClick(link)}
                                >
                                    {link.label}
                                </button>
                            </li>
                        ))}

                        <li>
                            <SearchForm 
                                searchQuery={searchQuery} 
                                setSearchQuery={setSearchQuery}
                                handleSearch={handleSearch}
                                labelText="Sök burk-id"
                                closeMenu={closeMenu}
                            />
                            {searchError && (
                                <p className="mt-2 text-sm text-red-500">{searchError}</p>
                            )}
                            {isSearching && (
                                <p className="mt-2 text-sm text-gray-500">Söker...</p>
                            )}
                        </li>
                    </ul>
                
            
            </nav>
        </header>
    );
}