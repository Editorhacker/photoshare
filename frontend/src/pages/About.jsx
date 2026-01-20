import Layout from "../components/layout/Layout";

const About = () => {
  return (
    <Layout>
      {/* HERO SECTION */}
      <section
        className="
          pt-24 pb-14 px-5 text-center
          bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_70%)]
        "
      >
        <h1
          className="
            text-[clamp(2.5rem,4vw,3.4rem)] mb-4 font-bold
            bg-gradient-to-r from-white via-[#c7d2fe] to-[#a78bfa]
            bg-clip-text text-transparent
          "
        >
          About PhotoShare
        </h1>

        <p
          className="
            max-w-[720px] mx-auto text-lg
            text-[var(--text-muted)]
          "
        >
          A platform built by photographers, for photographers — to make
          delivering work to clients simple, beautiful, and secure.
        </p>
      </section>

      <div className="container max-w-[900px] mx-auto px-5 pb-24 pt-10">
        {/* MISSION CARD */}
        <div
          className="
            p-9 rounded-[22px] mb-14
            bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.02)]
            border border-[rgba(255,255,255,0.06)]
            backdrop-blur-md
          "
        >
          <h2 className="text-[var(--primary)] mb-3 text-xl font-semibold">
            Our Mission
          </h2>

          <p className="text-[1.05rem] leading-[1.8]">
            PhotoShare was created to remove friction from photo delivery.
            Instead of juggling downloads, zip files, and permissions,
            photographers can connect Google Drive and instantly create
            professional client galleries.
            <br />
            <br />
            We believe that great photography deserves a great presentation —
            without technical headaches.
          </p>
        </div>

        {/* TWO COLUMN SECTIONS - RESPONSIVE */}
        <div
          className="
            grid grid-cols-1 md:grid-cols-2 gap-6
          "
        >
          <InfoCard
            title="For Photographers"
            text="Spend more time shooting and editing, not managing files. Connect your Drive, select a folder, and generate secure, beautiful client galleries in minutes."
            icon="📷"
          />

          <InfoCard
            title="For Clients"
            text="A clean, distraction-free gallery experience where clients can view images, mark favorites, and receive selections effortlessly."
            icon="✨"
          />
        </div>
      </div>
    </Layout>
  );
};

const InfoCard = ({ title, text, icon }) => (
  <div
    className="
      p-8 rounded-[20px]
      bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.02)]
      border border-[rgba(255,255,255,0.06)]
      backdrop-blur-md
    "
  >
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="text-xl mb-2 font-semibold">{title}</h3>
    <p className="text-[var(--text-muted)] leading-[1.7]">
      {text}
    </p>
  </div>
);

export default About;
