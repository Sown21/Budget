import React, { useRef } from "react";
import { toast } from "react-toastify";
import { importCsv } from "../api/spents";

const ImportButton = ({ userId, onSuccess }) => {
    const fileInputRef = useRef();

    // Ouvre l'input quand on clique sur le bouton
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // Gère l'import quand un fichier est choisi
    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Sélectionne un fichier CSV !");
            return;
        }
        try {
            await importCsv(userId, file);
            if (onSuccess) await onSuccess();
            toast.success("Import réussi !");
        } catch (err) {
            toast.error("Erreur lors de l'import !");
        }
        // Réinitialise l'input pour permettre un nouvel import
        e.target.value = "";
    };

    return (
        <>
            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImport}
            />
            <button className="btn_file" onClick={handleButtonClick}>Importer</button>
        </>
    );
};

export default ImportButton;