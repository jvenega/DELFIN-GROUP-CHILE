import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor en http://192.168.100.46:${PORT}`);
});
