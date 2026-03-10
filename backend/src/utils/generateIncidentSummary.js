const generateIncidentSummary = async ({
  url,
  statusCode,
  responseTime,
  incident,
}) => {
  if (!incident) return null;

  if (incident.type === "server_error") {
    return `The monitored API at ${url} returned status ${statusCode}. This suggests a server-side problem. Suggested action: check backend logs, deployment status, or database connectivity.`;
  }

  if (incident.type === "client_error") {
    return `The monitored API at ${url} returned status ${statusCode}. This suggests the endpoint may be invalid or the request is not accepted. Suggested action: verify the endpoint URL and request configuration.`;
  }

  if (incident.type === "slow_response") {
    return `The monitored API at ${url} responded slowly in ${responseTime}ms. This may indicate performance degradation. Suggested action: inspect server load, database queries, or upstream dependencies.`;
  }

  if (incident.type === "request_error") {
    return `The monitor could not reach ${url}. Error: ${incident.message}. This may indicate a network issue, DNS failure, timeout, or service outage. Suggested action: verify host availability and network connectivity.`;
  }

  return `An incident was detected for ${url}: ${incident.message}`;
};

export default generateIncidentSummary;
