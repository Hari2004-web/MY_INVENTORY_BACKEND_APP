module.exports = {
  send: function ({ res, result }) {
    const statusCode = result.statusCode || 200;

    // --- THIS IS THE FIX ---
    // The 'success' property is now determined by the status code.
    // If statusCode is 2xx, success will be true. Otherwise, it will be false.
    const isSuccess = statusCode >= 200 && statusCode < 300;

    const responseData = {
      success: result.success ?? isSuccess,
      message: result.message || null,
      data: result.data || null,
      error: result.error || null,
    };
    
    return res.status(statusCode).json(responseData);
  },
};