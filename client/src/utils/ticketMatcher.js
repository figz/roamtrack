const TICKET_PATTERN = /\b[A-Z]{2,10}-\d+\b/g;

export function extractTicketIds(text) {
  return text.match(TICKET_PATTERN) || [];
}
