import React, { useState, useEffect } from "react";
import Web3 from "web3";

// ------------------------------------------------------------------
// 1. IMPORTACIONES CRÍTICAS DE BLOCKCHAIN
// ------------------------------------------------------------------
import PersonasABI from "./abis/Personas.json";
import HerenciaABI from "./abis/HerenciaConRegistro.json";

// Direcciones de contratos desplegados (TUS DIRECCIONES DE GANACHE)
// PERSONAS_ADDRESS: 0x782e185F2360c10C080B4e6c83c7e0d52678DE36
// HERENCIA_ADDRESS: 0x31aE0473965375332144676d0D23bf1d43C54620
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
  const [personasContract, setPersonasContract] = useState(null); // <-- NUEVO: Contrato Personas
  const [balanceHerencia, setBalanceHerencia] = useState("0");
  const [ciTestador, setCiTestador] = useState("Cargando...");
  const [cargando, setCargando] = useState(true); // ------------------------------------------------------------------ // LÓGICA DE CONEXIÓN (useEffect) // ------------------------------------------------------------------

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Solicitar acceso a cuentas
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accs = await web3Instance.eth.getAccounts();
          setAccounts(accs); // Cargar Contrato Herencia

          const herenciaInstance = new web3Instance.eth.Contract(
            HerenciaABI.abi,
            HERENCIA_ADDRESS
          );
          setHerenciaContract(herenciaInstance); // Cargar Contrato Personas (¡NUEVO!)

          const personasInstance = new web3Instance.eth.Contract(
            PersonasABI.abi,
            PERSONAS_ADDRESS
          );
          setPersonasContract(personasInstance); // Obtener balance del Contrato Herencia

          const balanceWei = await web3Instance.eth.getBalance(
            HERENCIA_ADDRESS
          );
          const balanceEth = web3Instance.utils.fromWei(balanceWei, "ether");
          setBalanceHerencia(balanceEth); // Obtener CI del Testador

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

    loadBlockchainData(); // Escuchar cambios en la cuenta/red de Metamask

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []); // ------------------------------------------------------------------ // FUNCIÓN DE LECTURA (ya la tenías) // ------------------------------------------------------------------

  const obtenerCiTestador = async () => {
    if (!herenciaContract) return;
    try {
      const ci = await herenciaContract.methods.ciTestador().call();
      alert(`CI del Testador: ${ci}`);
    } catch (error) {
      console.error("Error al obtener CI:", error);
    }
  }; // ------------------------------------------------------------------ // FUNCIÓN DE ESCRITURA: Activar Prueba Fallecimiento (ya corregida) // ------------------------------------------------------------------

  const activarPrueba = async () => {
    if (!herenciaContract || accounts.length === 0) return;

    try {
      const currentAccounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const fromAccount = currentAccounts[0];

      await herenciaContract.methods.activarPruebaFallecimiento().send({
        from: fromAccount,
        gas: 3000000,
        type: "0x0", // SOLUCIÓN EIP-1559
      });

      alert("¡Transacción enviada! Espera confirmación...");
    } catch (error) {
      console.error("Error detallado:", error);
      if (error.code === 4001) {
        alert("Usuario rechazó la transacción.");
      } else {
        alert("Error en la transacción de activación. Revisa la consola.");
      }
    }
  }; // ------------------------------------------------------------------ // FUNCIÓN DE ESCRITURA: Registrar datos del Testador en el Contrato Personas (NUEVA) // ------------------------------------------------------------------

  const registrarTestador = async (cedula, nombres, apellidos) => {
    if (!personasContract || accounts.length === 0) {
      alert("Contrato Personas no cargado o no hay cuenta conectada");
      return;
    }
    const fromAccount = accounts[0];

    try {
      console.log("Registrando Testador:", nombres, apellidos);
      await personasContract.methods
        .registrarPersonaEsencial(cedula, nombres, apellidos)
        .send({
          from: fromAccount,
          gas: 3000000,
          type: "0x0", // Mantenemos la compatibilidad
        });

      alert(`✅ Testador ${nombres} registrado con Cédula ${cedula}.`);
    } catch (error) {
      console.error("Error al registrar persona:", error);
      if (error.code === 4001) {
        alert("Usuario rechazó la transacción.");
      } else {
        alert("Error al registrar el Testador. Revisa la consola.");
      }
    }
  }; // ------------------------------------------------------------------ // RENDERIZADO // ------------------------------------------------------------------

  if (cargando) return <div className="p-10">Cargando Blockchain...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
           {" "}
      <h1 className="text-3xl font-bold mb-4">Panel de Control Blockchain</h1> 
          {/* Info de depuración */}     {" "}
      <div className="bg-white p-4 rounded shadow mb-6">
               {" "}
        <p>
                    <strong>Red:</strong> Localhost (Ganache)        {" "}
        </p>
               {" "}
        <p>
                    <strong>Cuenta Conectada:</strong> {accounts[0]}       {" "}
        </p>
               {" "}
        <p>
                    <strong>CI Testador (Contrato):</strong> {ciTestador}       {" "}
        </p>
               {" "}
        <p>
                    <strong>Balance Contrato Herencia:</strong>{" "}
          {balanceHerencia} ETH        {" "}
        </p>
             {" "}
      </div>
            {/* Botones de acción */}     {" "}
      <div className="mb-8">
               {" "}
        <h2 className="text-xl font-bold mb-2">
          Acciones de Prueba de Contratos
        </h2>
               {" "}
        <button
          onClick={obtenerCiTestador}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-4 hover:bg-blue-700"
        >
                    1. Ver CI (Lectura)        {" "}
        </button>
               {" "}
        <button
          onClick={activarPrueba}
          className="bg-red-600 text-white px-4 py-2 rounded mr-4 hover:bg-red-700"
        >
                    2. Activar Prueba de Fallecimiento (Escritura)        {" "}
        </button>
                        {/* Botón de registro de persona con datos de prueba */}
               {" "}
        <button
          onClick={() => registrarTestador("112233445", "Nuevo", "Usuario")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2 md:mt-0"
        >
                    3. Registrar Testador (Contrato Personas)        {" "}
        </button>
             {" "}
      </div>
            {/* Tu componente visual */}     {" "}
      <DigitalInheritanceDashboard
        contractAddress={HERENCIA_ADDRESS}
        totalValue={balanceHerencia}
        beneficiaries={[]} // Aquí iría la lista de herederos
      />
         {" "}
    </div>
  );
}

export default Home;
