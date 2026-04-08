export const getUsers = () => {
  return Promise.resolve([
    { id: 1, name: "QA User", role: "Admin" },
    { id: 2, name: "Demo User", role: "User" }
  ]);
};