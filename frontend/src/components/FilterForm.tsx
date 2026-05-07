import { useForm } from "react-hook-form";
import { filterFormStyles as styles } from "../styles/filterForm.styles";

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
  } = useForm<FilterFormValues>({
    defaultValues: {
      price: 2500,
      squareFeet: 1000,
    },
  });

  const selectedPrice = watch("price");
  const selectedSquareFeet = watch("squareFeet");

  function onSubmit(data: FilterFormValues) {
    onFormSubmit(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <div className={styles.grid}>
        
        <div className="space-y-4">
          <label className={styles.label}>
            Maximum Price
          </label>

          <input
            type="range"
            min="0"
            max="5000"
            className={styles.range}
            {...register("price")}
          />

          <p className={styles.valueText}>
            ${selectedPrice}
          </p>
        </div>

        <div>
          <label className={styles.label}>
            Property Type
          </label>

          <select
            className={styles.input}
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
            <label className={styles.label}>Beds</label>

            <input
              type="number"
              min="0"
              max="5"
              className={styles.input}
              {...register("beds")}
            />
          </div>

          <div>
            <label className={styles.label}>Baths</label>

            <input
              type="number"
              min="0"
              max="5"
              step="0.5"
              className={styles.input}
              {...register("baths")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className={styles.label}>
            Max. Square Feet
          </label>

          <input
            type="range"
            min="0"
            max="3000"
            className={styles.range}
            {...register("squareFeet")}
          />

          <p className={styles.valueText}>
            {selectedSquareFeet} SQ FT
          </p>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button
          type="submit"
          className={styles.button}
        >
          Search Rentals
        </button>
      </div>
    </form>
  );
}