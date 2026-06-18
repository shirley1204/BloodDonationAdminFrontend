export const validateSignUpForm = (firstName,lastName,emailId,password) => {
  const errors = {};

  // First Name
  if (!firstName.trim()) {
    errors.firstName = "First name is required";
  } else if (firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }

  // Last Name
  if (!lastName.trim()) {
    errors.lastName = "Last name is required";
  } else if (lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailId.trim()) {
    errors.emailId = "Email is required";
  } else if (!emailRegex.test(emailId)) {
    errors.emailId = "Invalid email format";
  }

  // Password
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};


export const validateLoginForm = (emailId,password) => {
  const errors = {};

  // Email (user id)
  if (!emailId.trim()) {
    errors.emailId = "User Id is required";
  }

  // Password
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};