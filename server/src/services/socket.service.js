let io = null;

export function setSocketServer(server) {
  io = server;
}

export function emitAppointmentEvent(event, payload) {
  if (!io) return;
  io.emit(`appointment:${event}`, payload);
}
