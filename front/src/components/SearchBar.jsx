import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
    const [search, setSearch] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(search);
    };

    return (
        <form onSubmit={handleSubmit} className="saisie_form ml-2">
            <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded-2xl p-1 bg-white/80 w-fit"
                placeholder="Rechercher"
            />
        </form>
    );
};

export default SearchBar;