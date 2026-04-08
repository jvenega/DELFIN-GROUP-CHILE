export const saveSession = (data) => {
  const session = {
    sessionId: data.SessionId,
    loginTime: Date.now(),
    timeout: data.SessionTimeOut * 60 * 1000, // SAP lo entrega en minutos
  };

  localStorage.setItem("session", JSON.stringify(session));
};

export const getSession = () => {
  return JSON.parse(localStorage.getItem("session"));
};

export const isSessionValid = () => {
  const session = getSession();
  if (!session) return false;

  return Date.now() - session.loginTime < session.timeout;
};

export const clearSession = () => {
  localStorage.removeItem("session");
};