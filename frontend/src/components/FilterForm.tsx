import { useForm } from "react-hook-form";

export default function FilterForm({ onFormSubmit }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        onFormSubmit(data);
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>
                Price
                <input type="range" min="0" max="3000" {...register("price", { valueAsNumber: true })} />
            </label>

            <select {...register("type")}>
                <option value="">Select Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Townhouse">Townhouse</option>
            </select>

            <label>
                Beds
                <input type="number" min="0" max="5" {...register("beds", { valueAsNumber: true })} />
            </label>

            <label>
                Baths
                <input type="number" min="0" max="5" {...register("baths", { valueAsNumber: true })} />
            </label>

            <label>
                Square Feet
                <input type="range" min="0" max="3000" {...register("squareFeet", { valueAsNumber: true })} />
            </label>

            <label>
                furnishing
                <input type="checkbox" {...register("furnishing")} />
            </label>

            <label>
                smoking
                <input type="checkbox" {...register("smoking")} />
            </label>

            <label>
                cats
                <input type="checkbox" {...register("cats")} />
            </label>   

            <label>
                dogs
                <input type="checkbox" {...register("dogs")} />
            </label>    

            <button type="submit">Search</button>
        </form>
    )
}