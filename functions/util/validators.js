const isEmpty = string => {
  if (string !== undefined && string.trim() === "") return true;
  else return false;
};

const isEmail = email => {
  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.match(emailRegEx)) return true;
  else return false;
};

exports.validateSignUpData = data => {
  const errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty!";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address!";
  }

  if (isEmpty(data.password)) errors.password = "Must not be empty!";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match";
  if (isEmpty(data.handle)) errors.handle = "Must not be empty";

  // if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};

exports.validateLoginData = data => {
  const errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty!";
  else if (!isEmail(data.email)) errors.email = "Must be valid email address!";

  if (isEmpty(data.password)) errors.password = "Must not be empty";

  // if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};

exports.reduceUserDetails = data => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};

exports.validateAddDoctorData = data => {
  const errors = {};
  const message = "Must not be empty!";

  if (isEmpty(data.name)) errors.name = message;
  if (isEmpty(data.description)) errors.description = message;
  if (isEmpty(data.image_url)) errors.image_url = message;
  if (isEmpty(data.location)) errors.location = message;

  if (isEmpty(data.phone_number)) {
    if (data.phone_number.length < 9)
      errors.phone_number = "Cannot be less than 9 characters";
    else if (!data.phone_number.match(/^[0-9]+$/))
      errors.phone_number = "Enter a valid telephone number";
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateAddMediData = data => {
  const errors = {};
  const message = "Must not be empty!";

  if (isEmpty(data.name)) errors.name = message;
  if (isEmpty(data.description)) errors.description = message;
  if (isEmpty(data.image_url)) errors.image_url = message;
  if (isEmpty(data.location)) errors.location = message;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateAddPlaceData = data => {
  const errors = {};
  const message = "Must not be empty!";

  if (isEmpty(data.name)) errors.name = message;
  if (isEmpty(data.description)) errors.description = message;
  if (isEmpty(data.image_url)) errors.image_url = message;
  if (isEmpty(data.duration)) errors.duration = message;

  if (isEmpty(data.phone_number)) {
    if (data.phone_number.length < 9)
      errors.phone_number = "Cannot be less than 9 characters";
    else if (!data.phone_number.match(/^[0-9]+$/))
      errors.phone_number = "Enter a valid telephone number";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateAddDiseaseData = data => {
  const errors = {};
  const message = "Must not be empty!";

  if (isEmpty(data.name)) errors.name = message;
  if (isEmpty(data.description)) errors.description = message;
  if (isEmpty(data.cause)) errors.cause = message;
  if (isEmpty(data.solution)) errors.solution = message;
  if (isEmpty(data.medication_goods)) errors.medication_goods = message;
  if (isEmpty(data.prepare_method)) errors.prepare_method = message;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
