import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reloqen Privacy Policy",
  description: "Privacy Policy for Reloqen, an offline-first job and customer management app.",
};

const sections = [
  {
    title: "Information stored on your device",
    body: (
      <>
        <p>Reloqen is an offline-first job and customer management application for service businesses. It stores information locally on your device so you can manage your business without a Reloqen account or app-level sign-in.</p>
        <p>Depending on the features you use, local records may include:</p>
        <ul>
          <li>Business name, contact information, address, default job settings, and business logo.</li>
          <li>Customer names, phone numbers, email addresses, notes, favorites, archive state, and related customer records.</li>
          <li>Job statuses, dates and timestamps, items, quantities, service details, prices, angles, conditions, notes, instructions, receipts, and related records.</li>
          <li>Photos and signatures associated with jobs or customers.</li>
          <li>Service catalog and pricing information, unfinished drafts, and the local status of your optional Reloqen Pro entitlement.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Contacts and camera",
    body: (
      <>
        <p>Reloqen may let you select a contact through Android&apos;s system contact picker. Contact information is accessed only when you explicitly select a contact and is used to populate a local customer record.</p>
        <p>When you explicitly choose to take a photo, Reloqen may use Android&apos;s camera functionality. Photos are stored locally with the related job or customer record. Reloqen does not automatically upload contact information or photos to a Reloqen server.</p>
      </>
    ),
  },
  {
    title: "Backups, restore, and sharing",
    body: (
      <>
        <p>Backup and restore are user-initiated. A backup may contain your local database, business settings, service catalog, photos, signatures, and business logo. Android&apos;s document picker lets you choose where the backup is saved and which backup is restored.</p>
        <p>Reloqen generates PDF receipts locally. If you choose Share, Android&apos;s system share chooser opens and the external application or provider you select may receive the PDF. Data deliberately shared with another application or storage provider is subject to that provider&apos;s privacy practices and control.</p>
      </>
    ),
  },
  {
    title: "Network services and advertising",
    body: (
      <>
        <p>Reloqen does not operate an app-owned cloud backend for customer or job information and does not automatically upload customer, job, photo, or business data to a Reloqen server. The app does not require a Reloqen account or app-level sign-in.</p>
        <p>Reloqen does not contain advertising and does not use an Advertising ID for advertising. No advertising profile is created by Reloqen.</p>
      </>
    ),
  },
  {
    title: "Google Play Billing",
    body: <p>Reloqen uses Google Play Billing for the optional one-time Reloqen Pro purchase. Google Play may process purchase, account, and payment transaction information under Google&apos;s policies. Reloqen does not directly collect or process payment-card details. Reloqen receives product and purchase status information needed to provide the entitlement and stores the local entitlement state for offline use.</p>,
  },
  {
    title: "Deletion and retention",
    body: <p>Locally stored Reloqen data can be removed by uninstalling Reloqen or clearing its app data, subject to Android and device behavior. User-created backups and PDFs saved or shared outside Reloqen are outside the app&apos;s control and may remain with the selected storage provider or application. Copies deliberately shared with another application or provider are governed by that provider&apos;s practices.</p>,
  },
];

export default function ReloqenPrivacyPolicy() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12 sm:px-10 sm:py-20">
      <header className="border-b border-white/15 pb-10">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-teal-200/80">RELOQEN // LEGAL</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">Privacy Policy</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">How Reloqen handles information in its offline-first job and customer management workflow.</p>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-white/45">Effective date: September 25, 2026</p>
      </header>
      <div className="divide-y divide-white/10">
        {sections.map((section) => (
          <section key={section.title} className="py-9 sm:py-11">
            <h2 className="text-xl font-medium text-teal-100 sm:text-2xl">{section.title}</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-white/70 sm:text-base [&_li]:pl-1 [&_li]:leading-7 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:max-w-3xl [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">{section.body}</div>
          </section>
        ))}
      </div>
      <footer className="border-t border-white/15 pt-9 text-sm leading-6 text-white/60">
        <h2 className="text-lg font-medium text-white">Contact</h2>
        <p className="mt-3">For privacy questions about Reloqen, contact <a className="text-teal-200 underline decoration-teal-200/40 underline-offset-4 hover:text-teal-100" href="mailto:cdokyung@gmail.com">cdokyung@gmail.com</a>.</p>
      </footer>
    </main>
  );
}
