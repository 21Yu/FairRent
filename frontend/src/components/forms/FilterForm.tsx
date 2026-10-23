import { useState } from "react";

import type { Filters } from "../../models/FormTypes";

type FilterFormProps = {
  onFormSubmit: (data: Filters) => void;
  isListView: boolean;
};

export default function FilterForm({ onFormSubmit, isListView }: FilterFormProps) {
  const [formData, setFormData] = useState<Filters>({
    price: "2500",
    type: "",
    beds: "",
    baths: "",
    squareFeet: "1000",
    province: ""
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onFormSubmit(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:items-end lg:gap-5 lg:p-5 ${isListView ? "lg:grid-cols-7" : "lg:grid-cols-6"}`}
    >
      <div className="min-w-0">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Max monthly rent</label>
          <input
            type="range"
            name="price"
            min="0"
            max="5000"
            value={formData.price}
            onChange={handleChange}
            className="w-full accent-indigo-300"
          />
          <p className="mt-1 text-sm font-semibold text-gray-900">${Number(formData.price).toLocaleString()}</p>
        </div>
      </div>

      <div className="min-w-0">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Max square feet</label>
          <input
            type="range"
            name="squareFeet"
            min="0"
            max="3000"
            value={formData.squareFeet}
            onChange={handleChange}
            className="w-full accent-indigo-300"
          />
          <p className="mt-1 text-sm font-semibold text-gray-900">{Number(formData.squareFeet).toLocaleString()} sq ft</p>
        </div>
      </div>

      <div className="min-w-0">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Property type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select...</option>
            <option value="apartment">Apartment</option>
            <option value="basement">Basement</option>
            <option value="duplex">Duplex</option>
            <option value="house">House</option>
            <option value="townhouse">Townhouse</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {isListView && 
        <div className="min-w-0">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Province</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Select...</option>
              <option value="Alberta">Alberta</option>
              <option value="British Columbia">British Columbia</option>
              <option value="Manitoba">Manitoba</option>
              <option value="New Brunswick">New Brunswick</option>
              <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
              <option value="Nova Scotia">Nova Scotia</option>
              <option value="Northwest Territories">Northwest Territories</option>
              <option value="Ontario">Ontario</option>
              <option value="Quebec">Quebec</option>
              <option value="Saskatchewan">Saskatchewan</option>
            </select>
          </div>
        </div>
      }

      <div className="min-w-0">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Beds</label>
          <input
            type="number"
            name="beds"
            min="0"
            max="5"
            value={formData.beds}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="min-w-0">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Baths</label>
          <input
            type="number"
            name="baths"
            min="0"
            max="5"
            step="0.5"
            value={formData.baths}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="min-w-0 sm:col-span-2 lg:col-span-1">
        <div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-300 px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}