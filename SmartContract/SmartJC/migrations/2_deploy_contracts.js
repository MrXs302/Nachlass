const Personas = artifacts.require("Personas");
const Herencia = artifacts.require("HerenciaConRegistro");

module.exports = function (deployer, network, accounts) {
  // -----------------------------------------------------------
  // 1. DEFINICIÓN DE ROLES Y PARÁMETROS
  // -----------------------------------------------------------
  // Utilizamos las cuentas 0 y 1 de Ganache.
  const walletTestador = accounts[0]; // Cuenta 0: Quien despliega y Testador
  const walletHeredero = accounts[1]; // Cuenta 1: El Heredero

  // Parámetros de ejemplo:
  const ciTestador = "V10123456";
  const ciHeredero = "V20987654";
  const periodoEsperaDias = 7; // 7 días
  const etherInicial = web3.utils.toWei("5", "ether"); // 5 ETH de depósito inicial

  // -----------------------------------------------------------
  // 2. DESPLIEGUE DEL REGISTRO CIVIL (PERSONAS)
  // -----------------------------------------------------------
  deployer
    .deploy(Personas, { from: walletTestador })
    .then(function (personasInstance) {
      const direccionPersona = personasInstance.address;

      console.log(`\n✅ Contrato Persona desplegado en: ${direccionPersona}\n`);

      // --- ⚠️ PASO CRÍTICO: REGISTRAR PERSONAS ---
      // El contrato Herencia requiere que las CI existan antes de su despliegue.
      console.log("...Registrando Testador y Heredero en el Registro Civil...");

      // Registrar Testador (CI, Nombres, Apellidos)
      return (
        personasInstance
          .registrarPersonaEsencial(
            ciTestador,
            "Testador Nombre",
            "Testador Apellido",
            { from: walletTestador } // El que paga la transacción
          )
          // Encadenar el registro del Heredero
          .then(() => {
            // Registrar Heredero (CI, Nombres, Apellidos)
            return personasInstance.registrarPersonaEsencial(
              ciHeredero,
              "Heredero Nombre",
              "Heredero Apellido",
              { from: walletTestador }
            );
          })
          // --- FIN DEL PASO CRÍTICO ---

          // -----------------------------------------------------------
          // 3. DESPLIEGUE DE HERENCIA (Usa la dirección de Persona)
          // -----------------------------------------------------------
          .then(() => {
            return deployer.deploy(
              Herencia,
              direccionPersona, // Argumento 1: Dirección de Persona (Registro Civil)
              ciTestador, // Argumento 2: CI Testador
              ciHeredero, // Argumento 3: CI Heredero
              walletHeredero, // Argumento 4: Billetera del Heredero
              periodoEsperaDias, // Argumento 5: Periodo de espera
              {
                from: walletTestador,
                value: etherInicial, // Depósito inicial de 5 ETH
              }
            );
          })
      );
    })
    .then(function () {
      console.log(`\n💰 Contrato Herencia desplegado en: ${Herencia.address}`);
      console.log(`Heredero Wallet: ${walletHeredero}`);
      console.log(`Monto inicial depositado: 5 ETH\n`);
    });
};
