'use client';

import AuthGateway from '@/components/auth/AuthGateway';
import GDPRConsentDrawer from '@/components/gdpr/GDPRConsentDrawer';

export default function VideoConsultationsPortalPage() {
  return (
    <AuthGateway>
      <main className="min-h-[60vh] px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">
          Video Consultations (coming soon)
        </h1>
        <p className="mt-4 text-muted-foreground">
          Secure, GDPR-compliant video consults will be enabled here shortly.
        </p>
      </main>
      <GDPRConsentDrawer />
    </AuthGateway>
  );
}
