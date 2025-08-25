import Table from "../components/Table";
import { getSpents } from "../api/spents";
import { useState, useEffect } from "react"

const Saisis = () => {
    const [ data, setData ] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const spents = await getSpents();
            console.log("Voici les spents : ", spents)
            setData(spents)
        };
        fetchData();
    }, []); // [] exéctué une seule fois au montage
    console.log(data)
    return (
        <div>
            <form>
                <select className="input_form" name="category">
                    <option value="">Choisir une catégorie</option>
                </select>
                <input className="input_form" type="text" name="name" placeholder="Nom"></input>
                <input className="input_form" type="text" name="description" placeholder="Description (optionnel)"></input>
                <input className="input_form" type="text" name="amount" placeholder="Montant €"></input>
                <input className="input_form" type="date" name="date"></input>
            </form>

        </div>
    )
};

export default Saisis;