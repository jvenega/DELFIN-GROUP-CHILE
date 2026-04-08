export const formatRut = (rut) => {
    if (!rut) return "";
    const clean = rut.toString().replace(/[^0-9kK]/g, "");
    if (clean.length < 2) return clean;
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1).toUpperCase();
    const reversed = body.split("").reverse();
    let formatted = "";
    for (let i = 0; i < reversed.length; i++) {
        formatted += reversed[i];
        if ((i + 1) % 3 === 0 && i !== reversed.length - 1) {
            formatted += ".";
        }
    }
    return `${formatted.split("").reverse().join("")}-${dv}`;
};    