import Navbar from "./Navbar";
import Footer from "./Footer";
import Doodles from "./Doodles";

const Section = ({ title, children }) => (
  <section className="mt-8">
    <h2 className="font-display text-xl font-semibold text-[#111] tracking-tightish mb-2">
      {title}
    </h2>
    <div className="text-sm text-gray-600 leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

const PrivacyPolicy = () => {
  const lastUpdated = "May 2026";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="relative flex-grow overflow-hidden">
        <Doodles variant="hero" />

        <main className="relative z-10 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
          <header className="mb-2">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#111] tracking-tightish">
              Privacy{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-2">
              Last updated: {lastUpdated}
            </p>
          </header>

          <p className="text-sm text-gray-600 leading-relaxed mt-6">
            KIIT Events is a student-built platform for discovering campus
            events at KIIT University. This page explains what data we
            collect, why, and how it's handled. If you have questions, reach
            out via the Contact page.
          </p>

          <Section title="What we collect">
            <p>
              When you sign in with your <strong>@kiit.ac.in</strong> Google
              account, Google shares your <strong>name</strong>,{" "}
              <strong>email address</strong>, and a unique account identifier
              with us. We don't ask for or store passwords — sign-in is
              handled entirely by Google.
            </p>
            <p>
              When you register for an event, we store the event ID against
              your account so organisers know who's coming. When you submit a
              query through the Contact page, we store the message you typed
              alongside your name and email so admins can respond.
            </p>
            <p>
              If you apply to run a society, the form fields you fill in
              (society name, description, contact email, phone) are stored
              alongside your account.
            </p>
          </Section>

          <Section title="How we use it">
            <p>
              Your name and email are used to identify you on the platform
              (e.g. on event registration lists shown to organisers, on
              announcements you post if you're a society, on queries you send
              to admins). Notifications about events you've registered for,
              announcements from societies, and admin replies are shown
              in-app.
            </p>
            <p>
              We don't sell data, run ads, or share information with anyone
              outside the platform's normal use — event organisers see who's
              registered for their event; admins see queries sent to them.
            </p>
          </Section>

          <Section title="Where it lives">
            <p>
              Account and event data is stored in a MongoDB Atlas database.
              Event poster images you upload are stored on Cloudinary.
              Authentication is handled by Google OAuth — we receive a
              short-lived token from Google and issue our own session token
              (a JWT) that expires after 7 days.
            </p>
          </Section>

          <Section title="Cookies & local storage">
            <p>
              We don't set tracking cookies. Your session token, role, and
              display name are kept in your browser's <code>localStorage</code>{" "}
              so you stay signed in across tabs and reloads. Clearing your
              browser storage signs you out.
            </p>
          </Section>

          <Section title="Third parties">
            <p>
              We rely on three external services:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Google</strong> — for sign-in (OAuth). Subject to
                Google's own privacy policy.
              </li>
              <li>
                <strong>MongoDB Atlas</strong> — for the database.
              </li>
              <li>
                <strong>Cloudinary</strong> — for event poster images.
              </li>
            </ul>
          </Section>

          <Section title="Your data, your control">
            <p>
              You can update your display name from the profile page. To
              delete your account or request that we remove the data we hold
              about you, send a message through the Contact page and an admin
              will action it.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If we change anything material, we'll update the "Last updated"
              date at the top of this page. For substantive changes we'll
              also post an announcement on the app.
            </p>
          </Section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
