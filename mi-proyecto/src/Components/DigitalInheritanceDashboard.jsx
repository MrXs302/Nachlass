// src/components/DigitalInheritanceDashboard.jsx

import React from "react";

// --- Función Auxiliar para formatear el valor ---
const formatValue = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETH",
    minimumFractionDigits: 4,
  }).format(value);
};

// --- Componente Principal de la Interfaz ---
const DigitalInheritanceDashboard = ({
  contractAddress,
  totalValue,
  beneficiaries,
}) => {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen w-full max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
        🏛️ Panel de Gestión de Herencia Digital
      </h2>

      {/* --- Tarjeta de Resumen Principal --- */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-blue-100">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
          Estado Actual del Patrimonio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Valor Total */}
          <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-start justify-center">
            <p className="text-sm font-medium text-blue-600">
              Valor Total Bloqueado (ETH)
            </p>
            <p className="text-3xl font-bold text-blue-800 mt-1">
              {formatValue(totalValue)}
            </p>
          </div>

          {/* Dirección del Contrato */}
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm font-medium text-gray-500">
              Dirección del Contrato (dApp)
            </p>
            <code className="text-base text-gray-800 break-all mt-1 block">
              {contractAddress}
            </code>
          </div>

          {/* Estado de Activación */}
          <div className="bg-green-50 p-4 rounded-lg flex flex-col items-start justify-center">
            <p className="text-sm font-medium text-green-600">
              Estado de Seguridad
            </p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              ✅ Activo y Protegido
            </p>
          </div>
        </div>
      </div>

      {/* --- Sección de Beneficiarios --- */}
      <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex justify-between items-center">
          Lista de Beneficiarios
          <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md">
            + Agregar Heredero
          </button>
        </h3>

        {/* Tabla de Beneficiarios (para herederos) */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nombre/Alias
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Dirección de Billetera
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Porcentaje Asignado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {beneficiaries.map((b, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {b.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-gray-100 p-1 rounded text-xs break-all">
                      {b.wallet.substring(0, 6)}...{b.wallet.slice(-4)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                        b.percentage > 50
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {b.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </a>
                    <a href="#" className="text-red-600 hover:text-red-900">
                      Eliminar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DigitalInheritanceDashboard;
