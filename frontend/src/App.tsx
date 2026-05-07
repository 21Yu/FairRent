import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapPage from "./pages/MainPage";
import DetailPage from "./pages/DetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/details/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}