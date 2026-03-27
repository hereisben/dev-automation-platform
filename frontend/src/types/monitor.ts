export type Monitor = {
  id: number;
  url: string;
  normalized_url: string;
  interval_seconds: number;
  created_at: string;
};

export type MonitorLog = {
  id: number;
  monitor_id: number;
  status_code: number | null;
  response_time: number | null;
  body_preview: string | null;
  success: boolean;
  checked_at: string;
  incident_type: string | null;
  incident_severity: string | null;
  incident_message: string | null;
  incident_summary: string | null;
};

export type CreateMonitorPayload = {
  url: string;
  intervalSeconds: number;
};
