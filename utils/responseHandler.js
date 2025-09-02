module.exports = {
  send: function ({ res, result }) {
    const statusCode = result.statusCode || 200;
    const responseData = {
      success: result.success ?? true,
      message: result.message || null,
      data: result.data || null,
      error: result.error || null,
    };
    return res.status(statusCode).json(responseData);
  },
};