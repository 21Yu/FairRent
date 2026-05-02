import type { RentalType } from "../models/RentalType"
import { useState } from "react"

type SideBarProps = {
    rentals: RentalType[]
}

export default function SideBar({ rentals } : SideBarProps) {

    return (
        <ul>
            {
                rentals.map((rental) => (
                    <li key={rental.id}>{rental.address}</li>
                ))
            }
        </ul>
    )
}