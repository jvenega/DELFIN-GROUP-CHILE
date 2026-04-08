import api from "./apiClient";

export const login = async (credentials) => {
  console.log("🔐 LOGIN REQUEST:", credentials);

  const response = await api.post("/Login", credentials);

  console.log("🔐 LOGIN RESPONSE:", response.data);

  return response.data;
};

export const getInvoice = async (docEntry) => {
  console.log("📄 GET INVOICE:", docEntry);

  const response = await api.get(`/Invoices(${docEntry})`);

  console.log("📄 INVOICE RESPONSE:", response.data);

  return response.data;
};