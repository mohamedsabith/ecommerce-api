// Export a good response.
export const goodResponse = ({ response }, message, statusCode = 200) => ({
  success: true,
  ...response,
  message,
  statusCode,
});

// Export a failed response.
export const failedResponse = (message = 'something went wrong!', statusCode = 401) => ({
  success: false,
  message,
  statusCode,
});
