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
                <!-- Main Container -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #667eea; padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: bold;">🎉 Application Approved!</h1>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 30px 30px 10px 30px;">
                            <p style="font-size: 16px; color: #333333; margin: 0; line-height: 1.5;">
                                Dear <strong>{{ $applicantName ?? 'Applicant' }}</strong>,
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Congratulations Message -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <p style="font-size: 16px; color: #333333; margin: 0; line-height: 1.5;">
                                Congratulations! Your SETUP application has been <strong style="color: #10b981;">approved</strong>.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Next Steps Section (MOI + Submit Docs REMOVED) -->
                    <tr>
                        <td style="padding: 0 30px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-left: 4px solid #667eea;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 20px 0; color: #667eea; font-size: 18px;">📋 Next Step:</h3>

                                        <!-- Set Up Account (REMOVED MOI step, so now this becomes Step 1) -->
                                        <p style="margin: 0 0 5px 0; line-height: 1.6;">
                                            <strong style="color: #333333; font-size: 15px;">1. Set Up Your Account</strong><br>
                                            <span style="color: #666666; font-size: 14px;">We've created a SETUP Connect account for you. Click the button below to set your password:</span>
                                        </p>

                                        <!-- Button -->
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="{{ $resetPasswordUrl ?? '#' }}" 
                                                       style="background-color: #667eea; 
                                                              color: #ffffff; 
                                                              padding: 14px 32px; 
                                                              text-decoration: none; 
                                                              border-radius: 6px; 
                                                              display: inline-block;
                                                              font-weight: bold;
                                                              font-size: 15px;">
                                                        Set Your Password
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="color: #666666; font-size: 13px; margin: 0 0 15px 0; line-height: 1.5;">
                                            <strong>Note:</strong> This link will expire in 60 minutes for security purposes.
                                        </p>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Help Box -->
                    <tr>
                        <td style="padding: 20px 30px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 6px;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6;">
                                            <strong>💡 Need Help?</strong><br>
                                            If you have any questions or need assistance, simply reply to this email and we'll be happy to help.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Signature -->
                    <tr>
                        <td style="padding: 20px 30px 30px 30px;">
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
                                This is an automated message. Please do not reply directly to this email address.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
