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
      className="flex flex-col md:flex-row gap-8 p-10"
    >
        
      <div className="flex items-center">
        <div>
          <label className="text-[16px] font-bold">
            Maximum Price
          </label>

          <input
            type="range"
            min="0"
            max="5000"
            className="w-full h-1 appearance-none bg-black"
            {...register("price")}
          />

          <p>
            ${selectedPrice}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <div>
          <label className="text-[16px] font-bold">
            Maximum Square Feet
          </label>

          <input
            type="range"
            min="0"
            max="3000"
            className="w-full h-1 appearance-none bg-black"
            {...register("squareFeet")}
          />

          <p>
            {selectedSquareFeet} sq ft
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        <div>
          <label className="text-[16px] font-bold">
            Property Type
          </label>

          <select
            className="appearance-none w-full bg-white border-2 border-black p-3 focus:bg-indigo-300 focus:text-white"
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
      </div>

      <div className="flex items-center">
        <div>
          <label className="text-[16px] font-bold">Beds</label>

          <input
            type="number"
            min="0"
            max="5"
            className="appearance-none w-full bg-white border-2 border-black p-3 focus:bg-indigo-300 focus:text-white"
            {...register("beds")}
          />
        </div>
      </div>

      <div className="flex items-center">
        <div>
          <label className="text-[16px] font-bold">Baths</label>

          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            className="appearance-none w-full bg-white border-2 border-black p-3 focus:bg-indigo-300 focus:text-white"
            {...register("baths")}
          />
        </div>
      </div>

      <div className="flex items-center">
        <div>
          <button
            type="submit"
            className="bg-black text-white w-full p-4 font-bold hover:bg-indigo-300"
          >
            Search Rentals
          </button>
        </div>
      </div>
    </form>
  );
}