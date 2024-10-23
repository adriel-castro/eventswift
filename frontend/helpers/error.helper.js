export const errorHelper = (error) => {
  let errorMessage;
  if (error?.response?.data?.errors.length > 0) {
    errorMessage = error.response.data.errors[0].message;
    throw new Error(errorMessage);
  } else if (error?.response?.data?.errors) {
    errorMessage = error.response.data.errors.message;
    throw new Error(errorMessage);
  } else if (error?.response?.data?.error?.message) {
    errorMessage = error.response.data.error.message;
    throw new Error(errorMessage);
  } else if (error?.response?.data?.error) {
    errorMessage = error.response.data.error;
    throw new Error(errorMessage);
  } else {
    throw new Error(error.message);
  }
};
