"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <main className="container">
        <h1 className="page-title mb-8">Contact Us</h1>

        <div className="form-container">
          {submitSuccess && (
            <div className="form-success-message">
              Message sent successfully! We&apos;ll get back to you soon.
            </div>
          )}

          {submitError && (
            <div className="form-error-message">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
            <div>
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                id="name"
                className="form-input"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="form-error-text">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                id="email"
                className="form-input"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="form-error-text">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="form-label">
                Phone (optional)
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                className="form-input"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                {...register('message', { required: 'Message is required' })}
                id="message"
                rows={4}
                className="form-input"
                disabled={isSubmitting}
              ></textarea>
              {errors.message && (
                <p className="form-error-text">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="form-button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
<br />
        <div className="mt-8 text-center text-text-light">
          <p>Prefer other methods? Reach us at:</p>
          <h4>
            Email
          </h4>
          <p className="mt-2">
            <Link href="mailto:higherlifec@gmail.com" className="link">
            higherlifec@gmail.com
            </Link>
          </p>
          <h4>
            Phone
          </h4>
          <p className="mt-2">(+268) 7626 8322</p>
          <p className="mt-2">(+268) 7979 6755</p>
          <p className="mt-2">(+268) 7643 8018</p>
          <p className="mt-2">(+268) 7604 5323</p>
        </div>
      </main>
    </div>
  );
}