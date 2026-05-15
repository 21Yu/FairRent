import { useForm } from "react-hook-form";
import { useWatch } from "react-hook-form";

type FilterFormValues = {
  price: string;
  type: string;
  beds: string;
  baths: string;
  squareFeet: string;
};

type FilterFormProps = {
  onFormSubmit: (data: FilterFormValues) => void;
};

export default function FilterForm({
  onFormSubmit,
}: FilterFormProps) {
  const {
    register,
    handleSubmit,
    control,
  } = useForm<FilterFormValues>({
    defaultValues: {
      price: "2500",
      squareFeet: "1000",
    },
  });

  const selectedPrice = useWatch({
    control,
    name: "price",
  });

  const selectedSquareFeet = useWatch({
    control,
    name: "squareFeet",
  });

  function onSubmit(data: FilterFormValues) {
    onFormSubmit(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="FilterForm_form"
    >
      <div className="FilterForm_grid">
        
        <div className="space-y-4">
          <label className="FilterForm_label">
            Maximum Price
          </label>

          <input
            type="range"
            min="0"
            max="5000"
            className="FilterForm_range"
            {...register("price")}
          />

          <p className="FilterForm_valueText">
            ${selectedPrice}
          </p>
        </div>

        <div>
          <label className="FilterForm_label">
            Property Type
          </label>

          <select
            className="FilterForm_input"
            {...register("type")}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="FilterForm_label">Beds</label>

            <input
              type="number"
              min="0"
              max="5"
              className="FilterForm_input"
              {...register("beds")}
            />
          </div>

          <div>
            <label className="FilterForm_label">Baths</label>

            <input
              type="number"
              min="0"
              max="5"
              step="0.5"
              className="FilterForm_input"
              {...register("baths")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="FilterForm_label">
            Max. Square Feet
          </label>

          <input
            type="range"
            min="0"
            max="3000"
            className="FilterForm_range"
            {...register("squareFeet")}
          />

          <p className="FilterForm_valueText">
            {selectedSquareFeet} SQ FT
          </p>
        </div>
      </div>

      <div className="FilterForm_buttonWrapper">
        <button
          type="submit"
          className="FilterForm_button"
        >
          Search Rentals
        </button>
      </div>
    </form>
  );
}