<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px;">

                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2563eb; padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: bold;">📅 TNA Scheduled</h1>
                            <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 15px;">Training Needs Assessment</p>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 30px 30px 10px 30px;">
                            <p style="font-size: 16px; color: #333333; margin: 0; line-height: 1.5;">
                                Dear <strong>{{ $cooperatorName }}</strong>,
                            </p>
                        </td>
                    </tr>

                    <!-- Message -->
                    <tr>
                        <td style="padding: 10px 30px 20px 30px;">
                            <p style="font-size: 15px; color: #444444; margin: 0; line-height: 1.6;">
                                A <strong>Training Needs Assessment (TNA)</strong> session has been scheduled for your business
                                <strong>{{ $businessName }}</strong>. Please review the details below and make sure to attend on time.
                            </p>
                        </td>
                    </tr>

                    <!-- Schedule Details Box -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                                   style="background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 16px 0; color: #1d4ed8; font-size: 16px;">Session Details</h3>

                                        <!-- Date & Time -->
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
                                            <tr>
                                                <td width="30" style="vertical-align: top; padding-top: 2px; font-size: 16px;">📆</td>
                                                <td>
                                                    <span style="font-size: 13px; color: #6b7280; display: block;">Date &amp; Time</span>
                                                    <strong style="font-size: 15px; color: #111827;">{{ $scheduledDate }}</strong>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Location -->
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
                                            <tr>
                                                <td width="30" style="vertical-align: top; padding-top: 2px; font-size: 16px;">📍</td>
                                                <td>
                                                    <span style="font-size: 13px; color: #6b7280; display: block;">Location</span>
                                                    <strong style="font-size: 15px; color: #111827;">{{ $location }}</strong>
                                                </td>
                                            </tr>
                                        </table>

                                        @if($conductedByName)
                                        <!-- Facilitator -->
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
                                            <tr>
                                                <td width="30" style="vertical-align: top; padding-top: 2px; font-size: 16px;">👤</td>
                                                <td>
                                                    <span style="font-size: 13px; color: #6b7280; display: block;">Facilitated by</span>
                                                    <strong style="font-size: 15px; color: #111827;">{{ $conductedByName }}</strong>
                                                </td>
                                            </tr>
                                        </table>
                                        @endif

                                        @if($notes)
                                        <!-- Notes -->
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="30" style="vertical-align: top; padding-top: 2px; font-size: 16px;">📝</td>
                                                <td>
                                                    <span style="font-size: 13px; color: #6b7280; display: block;">Notes</span>
                                                    <span style="font-size: 14px; color: #374151;">{{ $notes }}</span>
                                                </td>
                                            </tr>
                                        </table>
                                        @endif
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Action reminder -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                                   style="background-color: #fef9c3; border-radius: 6px;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6;">
                                            <strong>💡 What to bring:</strong><br>
                                            Please bring your signed Manifestation of Intent (MOI) form and any relevant business documents to the TNA session.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Help -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6;">
                                If you have questions or cannot attend, please contact your DOST-PSTO coordinator as soon as possible.
                            </p>
                        </td>
                    </tr>

                    <!-- Signature -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6;">
                                Best regards,<br>
                                <strong>SETUP CONNECT Team</strong><br>
                                <span style="color: #666666;">Department of Science and Technology</span>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                This is an automated message from SETUP Connect. Please do not reply directly to this email.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
