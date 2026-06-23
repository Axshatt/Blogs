'use client';

/**
 * AnalyticsExamples
 *
 * A reference component demonstrating how to use Umami analytics
 * for various custom events across Portfolio and Services pages.
 *
 * Copy and adapt these patterns into your own components.
 * This component is NOT rendered anywhere by default.
 */

import { trackEvent } from '@/lib/analytics';

// ─── Portfolio Events ────────────────────────────────────────────

/** Track when a user views a specific project */
export function ProjectViewExample({ projectId }: { projectId: string }) {
  return (
    <button
      onClick={() => trackEvent('project_view', { project: projectId })}
    >
      View Project
    </button>
  );
}

/** Track when a user downloads a resume */
export function ResumeDownloadExample() {
  return (
    <a
      href="/resume.pdf"
      download
      onClick={() => trackEvent('resume_download', { source: 'portfolio' })}
    >
      Download Resume
    </a>
  );
}

/** Track when a user submits a contact form */
export function ContactFormExample() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // …your form submission logic…
    trackEvent('contact_submit', { source: 'portfolio_page' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      <button type="submit">Send Message</button>
    </form>
  );
}

// ─── Services Events ─────────────────────────────────────────────

/** Track when a user views a service */
export function ServiceViewExample({ serviceId }: { serviceId: string }) {
  return (
    <button
      onClick={() => trackEvent('service_view', { service: serviceId })}
    >
      View Service Details
    </button>
  );
}

/** Track when a user requests a quote */
export function QuoteRequestExample() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // …your quote request logic…
    trackEvent('quote_request', { source: 'services_page' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="service">
        <option value="web-dev">Web Development</option>
        <option value="design">Design</option>
        <option value="consulting">Consulting</option>
      </select>
      <textarea name="details" placeholder="Project details" required />
      <button type="submit">Request Quote</button>
    </form>
  );
}

/** Track when a user books a consultation */
export function ConsultationBookedExample() {
  return (
    <button
      onClick={() =>
        trackEvent('consultation_booked', { type: 'initial_call' })
      }
    >
      Book Consultation
    </button>
  );
}
