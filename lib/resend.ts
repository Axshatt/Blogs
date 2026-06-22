import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || 'newsletter@mydomain.com';

// Lightweight markdown-to-HTML compiler for email compatibility
export function markdownToHtml(md: string): string {
  // Normalize line endings
  let html = md.replace(/\r\n/g, '\n');

  // Code blocks (do first to avoid conflicts)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre style="background-color: #f4f4f0; border: 1px solid #c8c7bf; padding: 16px; border-radius: 4px; font-family: 'Courier New', Courier, monospace; font-size: 14px; line-height: 1.4; color: #1c1b1b; overflow-x: auto; margin: 16px 0;"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background-color: #f4f4f0; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 14px; color: #1c1b1b;">$1</code>');

  // Headings
  html = html.replace(/^# (.*?)$/gm, '<h1 style="font-family: \'Inter\', sans-serif; font-size: 26px; font-weight: 800; line-height: 1.2; color: #000000; margin: 28px 0 16px 0;">$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2 style="font-family: \'Inter\', sans-serif; font-size: 20px; font-weight: 700; line-height: 1.3; color: #000000; margin: 24px 0 12px 0;">$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3 style="font-family: \'Inter\', sans-serif; font-size: 16px; font-weight: 600; line-height: 1.4; color: #000000; margin: 20px 0 8px 0;">$1</h3>');

  // Blockquotes / Callouts
  html = html.replace(/^> (.*?)$/gm, '<blockquote style="border-left: 4px solid #566500; padding: 4px 0 4px 16px; margin: 16px 0; font-style: italic; color: #474741;">$1</blockquote>');

  // Lists (Unordered)
  html = html.replace(/^\* (.*?)$/gm, '<li style="margin-bottom: 8px;">$1</li>');
  html = html.replace(/(<li style="margin-bottom: 8px;">[\s\S]*?<\/li>)/g, '<ul style="padding-left: 20px; margin: 16px 0;">$1</ul>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #566500; text-decoration: underline; font-weight: 500;">$1</a>');

  // Bold / Italics
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Paragraphs (wrap lines that aren't already wrapped in block elements)
  const lines = html.split('\n');
  const wrappedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '<div style="height: 12px;"></div>';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li') || trimmed.startsWith('<pre') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<div')) {
      return line;
    }
    return `<p style="font-family: \'Inter\', sans-serif; font-size: 16px; line-height: 1.6; color: #1c1b1b; margin: 0 0 16px 0;">${line}</p>`;
  });

  return wrappedLines.join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Wrap all links in the email with a click tracking redirect, except unsubscribe/mailto links
export function wrapTrackingLinks(html: string, nid: number, sid: number, customSiteUrl?: string): string {
  const activeSiteUrl = customSiteUrl || siteUrl;
  return html.replace(/href="([^"]+)"/g, (match, url) => {
    if (url.startsWith('mailto:') || url.includes('/unsubscribe') || url.includes('/api/newsletter/track')) {
      return match;
    }
    const trackedUrl = `${activeSiteUrl}/api/newsletter/track?nid=${nid}&sid=${sid}&event=click&url=${encodeURIComponent(url)}`;
    return `href="${trackedUrl}"`;
  });
}

// ── Email Shell Template ──

function getEmailLayout(title: string, bodyContent: string, unsubscribeLink?: string, customSiteUrl?: string): string {
  const activeSiteUrl = customSiteUrl || siteUrl;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 16px !important;
      }
    }
  </style>
</head>
<body style="background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 24px 0;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <table className="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #eeeeee; padding: 32px; border-radius: 8px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #eeeeee; text-align: left;">
              <a href="${activeSiteUrl}" style="font-size: 22px; font-weight: 900; letter-spacing: -1px; text-decoration: none; color: #000000; font-family: sans-serif;">
                AkshatCodes
              </a>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 24px 0; text-align: left; font-size: 16px; line-height: 1.6; color: #1c1b1b;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #eeeeee; text-align: center; font-size: 12px; color: #858481; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">You received this email because you subscribed to AkshatCodes newsletter.</p>
              ${
                unsubscribeLink
                  ? `<p style="margin: 0;"><a href="${unsubscribeLink}" style="color: #566500; text-decoration: underline;">Unsubscribe</a> from future issues.</p>`
                  : ''
              }
              <p style="margin: 8px 0 0 0;">Designed with discipline.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ── Service Operations ──

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  if (!resend) {
    console.log('\x1b[33m%s\x1b[0m', '=== [DRY RUN] MOCK EMAIL SENT ===');
    console.log(`From: ${fromEmail}`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML length: ${html.length} chars`);
    console.log('=================================');
    return { id: 'mock-' + Math.random().toString(36).substr(2, 9), error: null };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    });
    return { id: data?.id || null, error };
  } catch (err: any) {
    console.error('Error sending email via Resend:', err);
    return { id: null, error: err };
  }
}

// 1. Send Double Opt-In Verification Email
export async function sendVerificationEmail(email: string, token: string, customSiteUrl?: string) {
  const activeSiteUrl = customSiteUrl || siteUrl;
  const verifyLink = `${activeSiteUrl}/api/newsletter/verify?token=${token}`;
  
  const bodyContent = `
    <h2 style="margin-top: 0; font-size: 20px; font-weight: 800;">Confirm your subscription</h2>
    <p>Thanks for signing up to the AkshatCodes newsletter! Please confirm your subscription by clicking the button below.</p>
    <div style="margin: 24px 0; text-align: center;">
      <a href="${verifyLink}" style="background-color: #000000; color: #ffffff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 15px;">
        Verify Email Address
      </a>
    </div>
    <p style="font-size: 14px; color: #858481;">If the button doesn't work, copy and paste this link into your browser: <br/> 
    <a href="${verifyLink}" style="color: #566500; word-break: break-all;">${verifyLink}</a></p>
    <p>This verification link will expire in 24 hours.</p>
  `;

  const html = getEmailLayout('Confirm your subscription', bodyContent, undefined, activeSiteUrl);
  return sendEmail({
    to: email,
    subject: 'Confirm your subscription to AkshatCodes',
    html,
    text: `Confirm your subscription to AkshatCodes by visiting this link: ${verifyLink}`,
  });
}

// 2. Send Welcome Email
export async function sendWelcomeEmail(email: string, customSiteUrl?: string) {
  const activeSiteUrl = customSiteUrl || siteUrl;
  const unsubscribeLink = `${activeSiteUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
  
  const bodyContent = `
    <h2 style="margin-top: 0; font-size: 20px; font-weight: 800;">You're in!</h2>
    <p>Your subscription is confirmed. Welcome to the AkshatCodes newsletter community.</p>
    <p>Every Saturday morning, you'll receive a curated recap containing:</p>
    <ul style="padding-left: 20px; margin: 16px 0;">
      <li style="margin-bottom: 8px;"><strong>Full-stack dev tutorials</strong> and code insights</li>
      <li style="margin-bottom: 8px;"><strong>Premium designs</strong>, UX strategies, and aesthetics reviews</li>
      <li style="margin-bottom: 8px;"><strong>AI engineering</strong> updates and tinkering retrospectives</li>
    </ul>
    <p>I'm excited to share this journey with you. Feel free to reply to any issue to share your thoughts directly!</p>
  `;

  const html = getEmailLayout("You're in!", bodyContent, unsubscribeLink, activeSiteUrl);
  return sendEmail({
    to: email,
    subject: 'Welcome to AkshatCodes Newsletter!',
    html,
    text: "Welcome to AkshatCodes Newsletter! Your subscription is confirmed.",
  });
}

// 3. Send Newsletter Campaign
export async function sendCampaignEmail({
  to,
  email,
  title,
  markdown,
  nid,
  sid,
  customSiteUrl,
}: {
  to: string;
  email: string;
  title: string;
  markdown: string;
  nid: number;
  sid: number;
  customSiteUrl?: string;
}) {
  const activeSiteUrl = customSiteUrl || siteUrl;
  const unsubscribeLink = `${activeSiteUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
  const openTrackingPixel = `${activeSiteUrl}/api/newsletter/track?nid=${nid}&sid=${sid}&event=open`;

  // Compile Markdown to HTML
  let rawHtmlContent = markdownToHtml(markdown);

  // Wrap links with click-tracking redirects
  let trackedHtmlContent = wrapTrackingLinks(rawHtmlContent, nid, sid, activeSiteUrl);

  // Append Open Tracking Pixel (1x1 invisible image)
  trackedHtmlContent += `\n<img src="${openTrackingPixel}" width="1" height="1" border="0" style="display:none; width:1px; height:1px;" alt="" />`;

  const html = getEmailLayout(title, trackedHtmlContent, unsubscribeLink, activeSiteUrl);

  return sendEmail({
    to,
    subject: title,
    html,
  });
}
