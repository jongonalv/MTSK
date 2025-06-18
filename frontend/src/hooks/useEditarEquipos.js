import { useCallback } from "react";

const generarPrefijo = (tipo, empresa, backup) => {
  const tipoInicial = { PORTATIL: "P", WORKSTATION: "W", SOBREMESA: "S" }[tipo] || "";
  const backupLetra = backup ? "B" : "";

  let empresaSiglas = "AG";
  if (empresa?.startsWith("HT")) empresaSiglas = "HT";
  else if (empresa?.includes("Rozalma")) empresaSiglas = "ROZ";

  return tipoInicial + backupLetra + empresaSiglas;
};

const obtenerSiguienteNumero = async (prefijo) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/siguienteEtiqueta?prefijo=${prefijo}`);
    const json = await res.json();
    return json?.siguienteNumero || "001";
  } catch (error) {
    console.warn("Error obteniendo siguiente número:", error);
    return "001";
  }
};

export const useEtiquetaEquipo = (data, onChange, etiquetaOriginalRef) => {
    // Asegúrate de pasar etiquetaOriginalRef.current al hook
    const etiquetaOriginal = etiquetaOriginalRef.current;
    let prefijoOriginal = "";
    let numeroOriginal = "";
    if (typeof etiquetaOriginal === "string") {
        const match = etiquetaOriginal.match(/^([A-Z]+)(\d+)$/i);
        if (match) {
            prefijoOriginal = match[1];
            numeroOriginal = match[2];
        }
    }

    const handleCampoChange = useCallback(async (e) => {
        const { name, value, type, checked } = e.target;

        const updated = {
            ...data,
            [name]: type === "checkbox" ? checked : value
        };

        const tipo = updated.tipo;
        const empresa = updated.empresa;
        const backup = !!updated.backup;

        if (tipo && empresa) {
            const nuevoPrefijo = generarPrefijo(tipo, empresa, backup);

            // Si el prefijo y el número coinciden con la etiqueta original, pon la etiqueta original y sal
            if (
                etiquetaOriginal &&
                nuevoPrefijo === prefijoOriginal &&
                data.etiquetaEquipo === etiquetaOriginal
            ) {
                // Ya está la etiqueta original, no hagas nada
                onChange({ target: { name, value: type === "checkbox" ? checked : value } });
                return;
            }

            // Si el prefijo vuelve a ser el original, pon la etiqueta original y sal
            if (
                etiquetaOriginal &&
                nuevoPrefijo === prefijoOriginal
            ) {
                onChange({ target: { name: "etiquetaEquipo", value: etiquetaOriginal } });
                onChange({ target: { name, value: type === "checkbox" ? checked : value } });
                return;
            }

            // Si el prefijo es diferente, pide el siguiente número
            const numero = await obtenerSiguienteNumero(nuevoPrefijo);
            const etiqueta = nuevoPrefijo + numero;
            onChange({ target: { name: "etiquetaEquipo", value: etiqueta } });
        }

        onChange({ target: { name, value: type === "checkbox" ? checked : value } });
    }, [data, onChange, etiquetaOriginal, prefijoOriginal, numeroOriginal]);

    return { handleCampoChange };
};