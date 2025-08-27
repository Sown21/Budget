import React, { useState } from "react";

const SpentForm = ({ categories, initialValues = {}, onSubmit, submitLabel = "Valider" }) => {
  const [categorySelected, setCategorySelected] = useState(initialValues.category_id || "");
  const [subCategorySelected, setSubCategorySelected] = useState(initialValues.subCategory_id || "");
  const [name, setName] = useState(initialValues.name || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [amount, setAmount] = useState(initialValues.amount || "");
  const [date, setDate] = useState(initialValues.date || "");

  const selectedCat = categories.find(cat => cat.id === Number(categorySelected));
  const subCategories = selectedCat?.children || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      amount,
      description,
      category_id: subCategorySelected || categorySelected,
      date
    });
    // Optionnel: reset le form ici si tu veux
  };

  return (
    <form onSubmit={handleSubmit}>
      <select className="input_form" name="category" onChange={e => setCategorySelected(e.target.value)} required value={categorySelected}>
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
      <input className="input_form" type="text" name="name" placeholder="Nom" required value={name} onChange={e => setName(e.target.value)} />
      <input className="input_form" type="text" name="description" placeholder="Description (optionnel)" value={description} onChange={e => setDescription(e.target.value)} />
      <input className="input_form" type="text" name="amount" placeholder="Montant €" required value={amount} onChange={e => setAmount(e.target.value)} />
      <input className="input_form" type="date" name="date" required value={date} onChange={e => setDate(e.target.value)} />
      <button type="submit">{submitLabel}</button>
    </form>
  );
};

export default SpentForm;
