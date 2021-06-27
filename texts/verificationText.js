module.exports = (token) => {
  const text = `<h1>Hello!!!</h1><h3>Click <a href='http://localhost:3000/auth/${token}'>this</a> link to verify your email</h3>`;
  return text;
};
