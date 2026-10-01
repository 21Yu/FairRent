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
      className="flex flex-col md:flex-row gap-8 p-10"
    >
      <div className="flex items-center">
        <div>
          <label className="text-[16px] font-bold">Maximum Price</label>
          <input
            type="range"
            name="price"
            min="0"
            max="5000"
            value={formData.price}
            onChange={handleChange}
            className="w-full h-1 appearance-none bg-black"
          />
          <p>${formData.price}</p>
        </div>
      </div>

      <div className="flex items-center">
        <div>
          <label className="text-[16px] font-bold">Maximum Square Feet</label>
          <input
            type="range"
            name="squareFeet"
            min="0"
            max="3000"
            value={formData.squareFeet}
            onChange={handleChange}
            className="w-full h-1 appearance-none bg-black"
          />
          <p>{formData.squareFeet} sq ft</p>
        </div>
      </div>

      <div className="flex items-center">
        <div>
          <label className="text-[16px] font-bold">Property Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="appearance-none w-full bg-white border-1 p-3"
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
        <div className="flex items-center">
          <div>
            <label className="text-[16px] font-bold">Province</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="appearance-none w-full bg-white border-1 p-3"
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

      <div className="flex items-center">
        <div>
          <label className="text-[16px] font-bold">Beds</label>
          <input
            type="number"
            name="beds"
            min="0"
            max="5"
            value={formData.beds}
            onChange={handleChange}
            className="appearance-none w-full bg-white border-1 p-3"
          />
        </div>
      </div>

      <div className="flex items-center">
        <div>
          <label className="text-[16px] font-bold">Baths</label>
          <input
            type="number"
            name="baths"
            min="0"
            max="5"
            step="0.5"
            value={formData.baths}
            onChange={handleChange}
            className="appearance-none w-full bg-white border-1 p-3"
          />
        </div>
      </div>

      <div className="flex items-center">
        <div>
          <button
            type="submit"
            className="bg-black text-white w-full p-4 font-bold hover:bg-indigo-300"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}