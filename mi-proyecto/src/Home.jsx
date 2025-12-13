// src/Home.jsx

import React, { useState } from "react";
// Importamos el componente de la interfaz que acabamos de crear
import DigitalInheritanceDashboard from "./Components/DigitalInheritanceDashboard"; // No necesitamos los logos de Vite/React ni el contador, pero conservaremos React

// --- Datos de Ejemplo (Mock Data) para que la interfaz se vea con contenido ---
const mockData = {
  contractAddress: "0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T",
  totalValue: 50.8765, // Ejemplo en ETH
  beneficiaries: [
    {
      name: "Alice Smith",
      wallet: "0x32A5B8E8858A97E34B54C8F90278A8708E773D4D",
      percentage: 70,
    },
    {
      name: "Bob Johnson",
      wallet: "0x6C4D2E5B1A9E0F8D7C6B5A4E3D2C1B0A9F8E7D6C",
      percentage: 20,
    },
    {
      name: "Charlie Doe",
      wallet: "0x5F8E7D6C1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P",
      percentage: 10,
    },
  ],
};
// -----------------------------------------------------------------------------

// Renombramos la función de App a Home
function Home() {
  // Aquí es donde irá tu lógica de conexión con MetaMask y los datos reales
  const [data, setData] = useState(mockData); // Usamos los datos de ejemplo por ahora

  return (
    // Estructura limpia para renderizar el panel
    <div className="min-h-screen">
      <DigitalInheritanceDashboard
        contractAddress={data.contractAddress}
        totalValue={data.totalValue}
        beneficiaries={data.beneficiaries}
      />
    </div>
  );
}

// Exportamos el nuevo componente con el nombre Home
export default Home;
