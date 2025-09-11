import React from 'react'

export const metadata = {
  title: 'Privacy & Data Requests',
  description:
    'Learn how St Mary’s House Dental Care processes your personal data and how to request or delete it.',
}

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <h1 className="text-3xl font-bold">Privacy &amp; Data Requests</h1>
      <p>
        At St Mary’s House Dental Care we respect your privacy. We only collect data that is
        strictly necessary to provide our services, and we never share your personal
        information with third parties without your consent.
      </p>
      <h2 className="text-2xl font-semibold">Your Rights</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Request a copy of the information we hold about you</li>
        <li>Ask us to correct or delete your data</li>
        <li>Withdraw consent for optional cookies or marketing</li>
        <li>Contact our Data Protection Officer for any concerns</li>
      </ul>
      <p>
        To exercise any of these rights, please email us at{' '}
        <a href="mailto:info@smhdental.co.uk" className="underline">
          info@smhdental.co.uk
        </a>
        . We aim to respond within one working day.
      </p>
    </section>
  )
}