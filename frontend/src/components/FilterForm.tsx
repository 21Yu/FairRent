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
                <input type="range" min="0" max="5000" {...register("price")} />
            </label>

            <select {...register("type")}>
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="basement">Basement</option>
                <option value="duplex">Duplex</option>
                <option value="house">House</option>
                <option value="townhouse">Townhouse</option>
                <option value="other">Other</option>
            </select>

            <label>
                Beds
                <input type="number" min="0" max="5" {...register("beds")} />
            </label>

            <label>
                Baths
                <input type="number" min="0" max="5" step="0.5" {...register("baths")} />
            </label>

            <label>
                Square Feet
                <input type="range" min="0" max="3000" {...register("squareFeet")} />
            </label>  

            <button type="submit">Search</button>
        </form>
    )
}