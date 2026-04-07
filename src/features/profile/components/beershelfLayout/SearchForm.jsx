import { IoSearchOutline } from "react-icons/io5";

export const SearchForm = ({ searchQuery, setSearchQuery, labelText, handleSearch }) => {
    return (
        <form onSubmit={handleSearch} className="flex flex-col gap-2 w-full">
            <label className="text-sm font-bold uppercase tracking-wider">{labelText}</label>
            <div className="flex items-center gap-3">

                <input
                    type="text"
                    placeholder="Skriv ett ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                />

                <button type="submit" className="bg-black text-white p-3">
                    <IoSearchOutline className="text-2xl" />
                </button>

            </div>
        </form>
    )};