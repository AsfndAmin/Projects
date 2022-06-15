const validateAddresses = (values: any, onSubmit = true) => {
  const errors: any = {};

  if (values.whiteList.length < 1 && onSubmit) {
    errors.whiteList = 'No saved address in whitelist'
  }

  values.whiteList.map((address: any, i: number) => {
    if (!address.startsWith('0x')) errors.whiteList = `Address ${i + 1} in the list should start from 0x`
    if (address.length != 42) errors.whiteList = `Address ${i + 1} in the list should have 42 characters`
  })

  return errors;
}

const validateQuantity = (value: any) => {

  const errors: any = {};
  const now = new Date().getTime();

  var result = (value.num - Math.floor(value.num)) !== 0;

  if (!value.num) {
    errors.num = 'Please enter number';
  }
  else if (result) {
    errors.num = "number cannot be in decimal"
  }
  else if (value.num < 1) {
    errors.num = 'Number cannot be less than 1';
  }

  else if (value.num > value.nftleft) {
    errors.num = 'number is greater than owls left'
  }

  return errors;
}

const credentialsValidate = (values: any) => {
  const errors: any = {};

  if (!values.username) {
    errors.username = 'Username is required'
  }
  else if (values.username.length > 8) {
    errors.username = 'Username exceed the character limit'
  }
  if (!values.password) {
    errors.password = 'Password is required'
  }
  else if (values.password.length > 8) {
    errors.password = 'Password exceed the character limit'
  }
  return errors;
}

const storyValidate = (values: any) => {
  const errors: any = {};

  if (!values.story) {
    errors.story = 'Story is required'
  }
  if (!values.category) {
    errors.category = 'Select the category'
  }
  if (!values.token) {
    errors.token = 'Login required'
  }
  return errors;
}

export {
  validateAddresses,
  validateQuantity,
  credentialsValidate,
  storyValidate
}