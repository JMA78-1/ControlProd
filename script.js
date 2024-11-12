function addMaterial() {
  const materiaPrimaInputs = document.getElementById("materiaPrimaInputs");
  const newMaterial = document.querySelector(".material").cloneNode(true);
  newMaterial.querySelectorAll("input").forEach((input) => (input.value = ""));
  materiaPrimaInputs.appendChild(newMaterial);
}

function addSupplied() {
  const mpSuministrada = document.getElementById("mpSuministrada");
  const newSupplied = document.querySelector(".supplied").cloneNode(true);
  newSupplied.querySelectorAll("input").forEach((input) => (input.value = ""));
  mpSuministrada.appendChild(newSupplied);
}

function removeSupplied() {
  const mpSuministrada = document.getElementById("mpSuministrada");
  const supplies = mpSuministrada.getElementsByClassName("supplied");

  if (supplies.length > 1) {
    mpSuministrada.removeChild(supplies[supplies.length - 1]);
  }
}

function guardarRegistro() {
  const fecha = document.getElementById("fechaRegistro").value;
  if (!fecha) {
    alert("Por favor, selecciona una fecha para guardar el registro.");
    return;
  }

  const formato = document.getElementById("formato").value;
  const tipo = document.getElementById("tipo").value;
  const loteProduccion = document.getElementById("loteProduccion").value;
  const totalCajas = document.getElementById("totalCajas").value;
  const totalPiezas = document.getElementById("totalPiezas").value;

  const suministros = [];
  document.querySelectorAll("#mpSuministrada .supplied").forEach(supply => {
    const material = supply.querySelector(".supplyName").value;
    const cantidad = supply.querySelector(".supplyCantidad").value;
    const unidad = supply.querySelector(".supplyUnidad").value;
    const lote = supply.querySelector(".supplyLote").value;
    suministros.push({ material, cantidad, unidad, lote });
  });

  const registro = {
    formato,
    tipo,
    loteProduccion,
    totalCajas,
    totalPiezas,
    suministros
  };

  localStorage.setItem(`registro_${fecha}`, JSON.stringify(registro));
  alert("Registro guardado correctamente.");
}

function consultarRegistro() {
  const fecha = document.getElementById("fechaRegistro").value;
  if (!fecha) {
    alert("Por favor, selecciona una fecha para consultar el registro.");
    return;
  }

  const registro = JSON.parse(localStorage.getItem(`registro_${fecha}`));
  const datosConsulta = document.getElementById("datosConsulta");
  
  if (registro) {
    datosConsulta.innerHTML = `
      <strong>Formato:</strong> ${registro.formato}<br>
      <strong>Tipo:</strong> ${registro.tipo}<br>
      <strong>Lote de Producción:</strong> ${registro.loteProduccion}<br>
      <strong>Total de Cajas:</strong> ${registro.totalCajas}<br>
      <strong>Total de Piezas:</strong> ${registro.totalPiezas}<br>
      <strong>Materias Primas Suministradas:</strong><br>
      ${registro.suministros.map(s => `
        - <strong>Material:</strong> ${s.material}, 
          <strong>Cantidad:</strong> ${s.cantidad} ${s.unidad}, 
          <strong>Lote:</strong> ${s.lote}
      `).join("<br>")}
    `;
  } else {
    datosConsulta.textContent = "No se encontraron registros para la fecha seleccionada.";
  }
}

function calculateTotals() {
  const materials = document.querySelectorAll(".material");
  materials.forEach((material) => {
    const cajas = Number(material.querySelector(".materialCajas").value) || 0;
    const piezas = Number(material.querySelector(".materialPiezas").value) || 0;
    const merma = Number(material.querySelector(".materialMerma").value) || 0;

    const totalUsado = cajas * piezas + merma;
    material.querySelector(".materialTotalUsado").value = totalUsado;

    const porcentaje = totalUsado ? ((merma / totalUsado) * 100).toFixed(2) : 0;
    material.querySelector(".materialPorcentaje").value = porcentaje + " %";
  });
}

function calculatePiezas(materialId) {
  const cajasInput = document.getElementById(`${materialId}_cajas`);
  const piezasInput = document.getElementById(`${materialId}_piezas`);
  const cajas = Number(cajasInput.value) || 0;
  const piezas = cajas * 12;
  piezasInput.value = piezas;
  updateTotalPiezas();
}

function updateTotalCajas() {
  const botella1Cajas = Number(document.getElementById("botella1_cajas").value) || 0;
  const botella2Cajas = Number(document.getElementById("botella2_cajas").value) || 0;
  const totalCajas = botella1Cajas + botella2Cajas;
  document.getElementById("totalCajas").value = totalCajas;
}

function updateTotalPiezas() {
  const botella1Piezas = Number(document.getElementById("botella1_piezas").value) || 0;
  const botella2Piezas = Number(document.getElementById("botella2_piezas").value) || 0;
  const totalPiezas = botella1Piezas + botella2Piezas;
  document.getElementById("totalPiezas").value = totalPiezas;
  document.getElementById("tapa_piezas").value = totalPiezas;
  document.getElementById("etiqueta_piezas").value = totalPiezas;
  updateTotalUsado("botella");
  updateTotalUsado("etiqueta");
  updateTotalUsado("tapa");
}

function updateTotalUsado(material) {
  const totalBotellas = Number(document.getElementById("totalPiezas").value) || 0;
  const merma = Number(document.getElementById(`${material}_merma`).value) || 0;
  const totalUsado = totalBotellas + merma;
  document.getElementById(`${material}_total_usado`).value = totalUsado;

  const porcentaje = totalBotellas > 0 ? ((merma / totalBotellas) * 100).toFixed(2) : 0;
  document.getElementById(`${material}_porcentaje`).value = `${porcentaje} %`;
}

document.getElementById("botella_merma").addEventListener("input", () => updateTotalUsado("botella"));
document.getElementById("etiqueta_merma").addEventListener("input", () => updateTotalUsado("etiqueta"));
document.getElementById("tapa_merma").addEventListener("input", () => updateTotalUsado("tapa"));
document.getElementById("botella1_cajas").addEventListener("change", updateTotalCajas);
document.getElementById("botella2_cajas").addEventListener("change", updateTotalCajas);

