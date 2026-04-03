import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendMonitorAlert({
  to,
  url,
  status,
  checkedAt,
  responseTime,
  summary,
}) {
  try {
    const subject =
      status === "DOWN" ? `🚨 API Down: ${url}` : `✅ API Recovered: ${url}`;

    const html = `<div style="margin:0; padding:0; background-color:#0b0f19; font-family:Arial, Helvetica, sans-serif; color:#e5e7eb;">
    <div style="max-width:640px; margin:0 auto; padding:32px 20px;">
        <div style="background-color:#111827; border:1px solid #1f2937; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.35);">

            <div style="padding:24px 28px; border-bottom:1px solid #1f2937; background:linear-gradient(135deg, ${status === "DOWN" ? "#3b0d0d" : "#0f2e1d"}, #111827);">
                <p style="margin:0 0 10px; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#9ca3af;">
                    Dev Automation Platform
                </p>
                <h1 style="margin:0; font-size:24px; line-height:1.3; color:#f9fafb;">
                    ${status === "DOWN" ? "🚨 API Incident Detected" : "✅ API Recovered"}
                </h1>
                <p style="margin:10px 0 0; font-size:14px; color:#d1d5db;">
                    ${
                      status === "DOWN"
                        ? "One of your monitored endpoints is currently failing."
                        : "Your monitored endpoint is responding normally again."
                    }
                </p>
            </div>

            <div style="padding:28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-bottom:24px;">
                    <tr>
                        <td style="padding:12px 0; border-bottom:1px solid #1f2937; width:120px; color:#9ca3af; font-size:14px;">
                            URL
                        </td>
                        <td style="padding:12px 0; border-bottom:1px solid #1f2937; color:#f9fafb; font-size:14px; word-break:break-word;">
                            ${url}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:12px 0; border-bottom:1px solid #1f2937; width:120px; color:#9ca3af; font-size:14px;">
                            Status
                        </td>
                        <td style="padding:12px 0; border-bottom:1px solid #1f2937;">
                            <span style="
                  margin-right: 4px; padding:12px 0; border-bottom:1px solid #1f2937; color:#f9fafb; font-size:14px; word-break:break-word;
                  color:${status === "DOWN" ? "#fecaca" : "#bbf7d0"}; background-color:${status === "DOWN" ? "#3f1d1d" : "#173323"}; border:1px solid ${status === "DOWN" ? "#7f1d1d" : "#166534"}; "></span>${status}
              </td>
            </tr>
            <tr><td style=" padding:12px 0; border-bottom:1px solid #1f2937; color:#9ca3af; font-size:14px;">
                                Checked At
                        </td>
                        <td style="padding:12px 0; border-bottom:1px solid #1f2937; color:#f9fafb; font-size:14px;">
                            ${checkedAt}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:12px 0; border-bottom:1px solid #1f2937; color:#9ca3af; font-size:14px;">
                            Response Time
                        </td>
                        <td style="padding:12px 0; border-bottom:1px solid #1f2937; color:#f9fafb; font-size:14px;">
                            ${responseTime ? `${responseTime} ms` : "N/A"}
                        </td>
                    </tr>
                </table>

                <div style="margin-bottom:24px;">
                    <h2 style="margin:0 0 12px; font-size:16px; color:#f9fafb;">
                        Summary
                    </h2>
                    <div style="
              padding:16px 18px;
              background-color:#0f172a;
              border:1px solid #1f2937;
              border-radius:12px;
              color:#d1d5db;
              font-size:14px;
              line-height:1.7;
            ">
                        ${summary || "No summary available."}
                    </div>
                </div>

                <p style="margin:0; font-size:13px; line-height:1.7; color:#9ca3af;">
                    This alert was generated automatically by Dev Automation Platform.
                    Please review the endpoint status and investigate if needed.
                </p>
            </div>
        </div>

        <p style="margin:16px 0 0; text-align:center; font-size:12px; color:#6b7280;">
            Dev Automation Platform • Automated API Monitoring Alert
        </p>
    </div>
</div>`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    console.log(`alert email sent to ${to}`);
  } catch (err) {
    console.error("failed to send alert email:", err.message);
  }
}
