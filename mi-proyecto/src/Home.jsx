// src/Home.jsx

import React, { useState, useEffect } from "react";
import Web3 from "web3";

// ------------------------------------------------------------------
// 1. IMPORTACIONES CRÍTICAS DE BLOCKCHAIN
// ------------------------------------------------------------------
import PersonasABI from "./abis/Personas.json";
import HerenciaABI from "./abis/HerenciaConRegistro.json";
// Asegúrate de que la ruta a Config sea la correcta según tu carpeta
import { PERSONAS_ADDRESS, HERENCIA_ADDRESS } from "./Components/Config";

// Componente de UI
import DigitalInheritanceDashboard from "./Components/DigitalInheritanceDashboard";

function Home() {
  // ------------------------------------------------------------------
  // ESTADOS
  // ------------------------------------------------------------------
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [herenciaContract, setHerenciaContract] = useState(null);
  const [balanceHerencia, setBalanceHerencia] = useState("0");
  const [ciTestador, setCiTestador] = useState("Cargando...");
  const [cargando, setCargando] = useState(true);

  // ------------------------------------------------------------------
  // LÓGICA DE CONEXIÓN (useEffect)
  // ------------------------------------------------------------------
  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Solicitar acceso a cuentas
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accs = await web3Instance.eth.getAccounts();
          setAccounts(accs);

          // Cargar contrato
          const herenciaInstance = new web3Instance.eth.Contract(
            HerenciaABI.abi,
            HERENCIA_ADDRESS
          );
          setHerenciaContract(herenciaInstance);

          // Obtener balance
          const balanceWei = await web3Instance.eth.getBalance(
            HERENCIA_ADDRESS
          );
          const balanceEth = web3Instance.utils.fromWei(balanceWei, "ether");
          setBalanceHerencia(balanceEth);

          // Obtener CI
          try {
            const initialCi = await herenciaInstance.methods
              .ciTestador()
              .call();
            setCiTestador(initialCi);
          } catch (err) {
            console.warn("No se pudo leer la CI inicial:", err);
            setCiTestador("Error de lectura");
          }
        } catch (error) {
          console.error("Error de conexión:", error);
          alert("Error conectando a Ganache. Revisa la consola.");
        }
      } else {
        alert("¡Instala Metamask!");
      }
      setCargando(false);
    };

    loadBlockchainData();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  // ------------------------------------------------------------------
  // FUNCIÓN DE LECTURA
  // ------------------------------------------------------------------
  const obtenerCiTestador = async () => {
    if (!herenciaContract) return;
    try {
      const ci = await herenciaContract.methods.ciTestador().call();
      alert(`CI del Testador: ${ci}`);
    } catch (error) {
      console.error("Error al obtener CI:", error);
    }
  };

  // ------------------------------------------------------------------
  // 🛠️ FUNCIÓN DE ESCRITURA CORREGIDA (SOLUCIÓN EIP-1559)
  // ------------------------------------------------------------------
  const activarPrueba = async () => {
    if (!herenciaContract) {
      alert("Contrato no cargado");
      return;
    }
    if (accounts.length === 0) {
      alert("No hay cuenta conectada");
      return;
    }

    try {
      // Obtenemos la cuenta actual directamente de Metamask para asegurar sincronización
      const currentAccounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const fromAccount = currentAccounts[0];

      console.log("Enviando transacción desde:", fromAccount);

      // --- AQUÍ ESTÁ LA SOLUCIÓN AL ERROR ---
      await herenciaContract.methods.activarPruebaFallecimiento().send({
        from: fromAccount,
        gas: 3000000, // Límite de gas manual
        type: "0x0", // <--- IMPORTANTE: Fuerza transacción Legacy (evita error EIP-1559)
      });

      alert("¡Transacción enviada! Espera confirmación...");

      // Opcional: Actualizar el estado visual si hubiera un cambio visible
    } catch (error) {
      console.error("Error detallado:", error);

      // Manejo de errores amigable
      if (error.message && error.message.includes("Eip1559NotSupportedError")) {
        alert(
          "Error de compatibilidad detectado. (El código ya incluye type: 0x0, intenta reiniciar Ganache si persiste)."
        );
      } else if (error.code === 4001) {
        alert("Usuario rechazó la transacción.");
      } else {
        alert("Error en la transacción. Revisa la consola (F12).");
      }
    }
  };

  // ------------------------------------------------------------------
  // RENDERIZADO
  // ------------------------------------------------------------------
  if (cargando) return <div className="p-10">Cargando Blockchain...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Panel de Control Blockchain</h1>

      {/* Info de depuración */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <p>
          <strong>Red:</strong> Localhost (Ganache)
        </p>
        <p>
          <strong>Cuenta:</strong> {accounts[0]}
        </p>
        <p>
          <strong>CI Testador:</strong> {ciTestador}
        </p>
        <p>
          <strong>Balance Contrato:</strong> {balanceHerencia} ETH
        </p>
      </div>

      {/* Botones de acción */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Acciones de Prueba</h2>
        <button
          onClick={obtenerCiTestador}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-4 hover:bg-blue-700"
        >
          1. Ver CI (Lectura)
        </button>
        <button
          onClick={activarPrueba}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          2. Activar Prueba de Fallecimiento
        </button>
      </div>

      {/* Tu componente visual */}
      <DigitalInheritanceDashboard
        contractAddress={HERENCIA_ADDRESS}
        totalValue={balanceHerencia}
        beneficiaries={[]}
      />
    </div>
  );
}

export default Home;
