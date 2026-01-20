import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center px-5 overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 
                        w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw]
                        bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_60%)]
                        pointer-events-none" />

        <div className="absolute bottom-[-20%] right-[-10%]
                        w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw]
                        bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,transparent_60%)]
                        pointer-events-none" />

        <div className="container max-w-[900px] animate-fade-in">

          {/* Badge */}
          <div className="
            inline-block px-4 py-1.5 rounded-full mb-8 text-sm
            bg-[rgba(255,255,255,0.05)]
            border border-[var(--border-glass)]
            text-[var(--primary)]
          ">
            ✦ The Photographer's Best Friend
          </div>

          {/* Title */}
          <h1 className="
            text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight mb-8
            bg-gradient-to-r from-white to-[#b8c1ec]
            bg-clip-text text-transparent
          ">
            Deliver Photos <br className="hidden sm:block" /> Like a Pro.
          </h1>

          {/* Description */}
          <p className="
            text-lg md:text-xl max-w-[600px] mx-auto mb-12
            text-[var(--text-muted)]
          ">
            Seamlessly connect Google Drive, create client galleries, and share your work with powerful tools designed for modern photographers.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/signup")}
              className="px-10 py-4 text-lg w-full sm:w-auto"
            >
              Get Started Free
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/about")}
              className="px-10 py-4 text-lg w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="container px-6 md:px-10 py-20">

        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-[2.5rem] mb-4">
            Workflow Simplified
          </h2>
          <p className="text-base md:text-lg max-w-[500px] mx-auto">
            Everything you need to manage and share your photography business.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
          gap-6 md:gap-8
        ">
          <FeatureCard
            icon="🔒"
            title="Secure Galleries"
            desc="Create private, view-only links for your clients. Prevent unauthorized downloads."
          />
          <FeatureCard
            icon="☁️"
            title="Drive Integration"
            desc="Connect directly to Google Drive. No need to double-upload your high-res files."
          />
          <FeatureCard
            icon="⏱️"
            title="Auto-Expiry"
            desc="Set custom expiration dates for your links to manage client access automatically."
          />
          <FeatureCard
            icon="✨"
            title="Premium UI"
            desc="A stunning, dark-themed experience that highlights your work without distractions."
          />
        </div>
      </section>
    </Layout>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="
    glass-card p-8 border border-[rgba(255,255,255,0.05)]
    flex flex-col gap-4
  ">
    <div className="
      w-14 h-14 md:w-16 md:h-16 rounded-xl 
      bg-[rgba(255,255,255,0.05)]
      flex items-center justify-center text-3xl mb-2
    ">
      {icon}
    </div>

    <h3 className="text-xl md:text-[1.4rem] font-semibold">
      {title}
    </h3>

    <p className="text-sm md:text-[0.95rem] text-[var(--text-muted)]">
      {desc}
    </p>
  </div>
);

export default Home;
