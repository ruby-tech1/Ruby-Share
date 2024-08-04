const validatePassword = (password) => {
  if (password.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    console.log("1");
    return false;
  }
  if (!/[a-z]/.test(password)) {
    console.log("2");
    return false;
  }
  if (!/\d/.test(password)) {
    console.log("2");
    return false;
  }
  if (!/[!@#$%^&*(),.?"'^`~:{}|<>]/.test(password)) {
    console.log("3");
    return false;
  }
  return true;
};

export default validatePassword;
