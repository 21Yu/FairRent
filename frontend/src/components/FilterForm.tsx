import { useForm } from "react-hook-form";

type FilterFormValues = {
  price: number;
  type: string;
  beds: number;
  baths: number;
  squareFeet: number;
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
    watch,
    formState: { errors },
  } = useForm<FilterFormValues>();

  const selectedPrice = watch("price");
  const selectedSquareFeet = watch("squareFeet");

  function onSubmit(data: FilterFormValues) {
    onFormSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          Maximum Price
        </label>

        <input
          type="range"
          min="0"
          max="5000"
          {...register("price")}
        />

        <p>
          Up to ${selectedPrice || 0}
        </p>
      </div>

      <div>
        <label>
          Property Type
        </label>

        <select {...register("type")}>
          <option value="">
            Select Property Type
          </option>

          <option value="apartment">
            Apartment
          </option>

          <option value="basement">
            Basement
          </option>

          <option value="duplex">
            Duplex
          </option>

          <option value="house">
            House
          </option>

          <option value="townhouse">
            Townhouse
          </option>

          <option value="other">
            Other
          </option>
        </select>
      </div>

      <div>
        <label>
          Bedrooms
        </label>

        <input
          type="number"
          min="0"
          max="5"
          {...register("beds")}
        />
      </div>

      <div>
        <label>
          Bathrooms
        </label>

        <input
          type="number"
          min="0"
          max="5"
          step="0.5"
          {...register("baths")}
        />
      </div>

      <div>
        <label>
          Minimum Square Feet
        </label>

        <input
          type="range"
          min="0"
          max="3000"
          {...register("squareFeet")}
        />

        <p>
          {selectedSquareFeet || 0} sq ft
        </p>
      </div>

      <button type="submit">
        Search Rentals
      </button>
    </form>
  );
}