// Export a good response.
export const goodResponse = (data, statusCode = 200) => ({
  success: true,
  data,
  statusCode,
});

// Export a failed response.
export const failedResponse = (message = 'something went wrong!', statusCode = 401) => ({
  success: false,
  message,
  statusCode,
});
