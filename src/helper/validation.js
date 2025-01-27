const validator = require("validator");

const signupValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Enter valid firstName and lastName");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter valid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};
module.exports = { signupValidation };
