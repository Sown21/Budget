import React, { useEffect, useState } from "react";

const SpentForm = ({ categories, initialValues = {}, onSubmit, submitLabel = "Valider", cancelButton }) => {
  const [categorySelected, setCategorySelected] = useState(initialValues.category_id || "");
  const [subCategorySelected, setSubCategorySelected] = useState(initialValues.subCategory_id || "");
  const [name, setName] = useState(initialValues.name || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [amount, setAmount] = useState(initialValues.amount || "");
  const [date, setDate] = useState(initialValues.date || "");

  // Set initial values only once when component mounts or when initialValues.name changes (for modification modal)
  useEffect(() => {
    if (initialValues.name) {
      setCategorySelected(initialValues.category_id || "");
      setSubCategorySelected(initialValues.subCategory_id || "");
      setName(initialValues.name || "");
      setDescription(initialValues.description || "");
      setAmount(initialValues.amount || "");
      setDate(initialValues.date || "");
    }
  }, [initialValues.name]); // Only trigger when name changes (indicating new data for modification)

  const selectedCat = categories.find(cat => cat.id === Number(categorySelected));
  const subCategories = selectedCat?.children?.length ? selectedCat.children : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Si la catégorie sélectionnée a des sous-catégories et aucune n'est choisie, on envoie l'id du parent
    let catId;
    if (subCategories.length > 0 && !subCategorySelected) {
      catId = Number(categorySelected);
    } else if (subCategorySelected) {
      catId = Number(subCategorySelected);
    } else {
      catId = Number(categorySelected);
    }
    try {
        await onSubmit({
            name,
            amount: Number(amount),
            description,
            category_id: catId,
            date
        });
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit} className="saisie_form">
      <select className="input_form" name="category" onChange={e => { setCategorySelected(e.target.value); setSubCategorySelected(""); }} required value={categorySelected}>
        <option value="">Choisir une catégorie</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      {subCategories.length > 0 && (
        <select
          className="input_form"
          name="subcategory"
          value={subCategorySelected}
          onChange={e => setSubCategorySelected(e.target.value)}
        >
          <option value="">Choisir une sous-catégorie</option>
          {subCategories.map(subcat => (
            <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
          ))}
        </select>
      )}
      <input className="input_form col-span-1 md:col-span-2 w-full" type="text" name="name" placeholder="Nom" required value={name} onChange={e => setName(e.target.value)} />
      <input className="input_form col-span-1 md:col-span-2 w-full" type="text" name="description" placeholder="Description (optionnel)" value={description} onChange={e => setDescription(e.target.value)} />
      <input className="input_form" type="text" name="amount" placeholder="Montant €" required value={amount} onChange={e => setAmount(e.target.value)} />
      <input className="input_form" type="date" name="date" required value={date} onChange={e => setDate(e.target.value)} />
      <div className="col-span-1 md:col-span-2 flex justify-center gap-4">
        <button className="btn_form" type="submit">{submitLabel}</button>
        {typeof cancelButton !== 'undefined' && cancelButton}
      </div>
    </form>
  );
};

export default SpentForm;
