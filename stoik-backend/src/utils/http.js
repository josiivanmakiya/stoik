const buildErrorPayload = ({ message, code, requestId }) => {
  const payload = {
    error: message,
    code,
    timestamp: new Date().toISOString()
  };
  if (requestId) payload.requestId = requestId;
  return payload;
};

const sendError = (res, { status, message, code, requestId }) => {
  return res.status(status).json(buildErrorPayload({ message, code, requestId }));
};

module.exports = {
  sendError
};
