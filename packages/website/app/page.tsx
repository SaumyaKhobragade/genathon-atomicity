import Features from "./components/Landing/Core/Features";
import Hero from "./components/Landing/Core/Hero";
import Footer from "./components/Landing/Core/Footer";
import Privacy from "./components/Landing/Core/Privacy";
import Preview from "./components/Landing/Core/Preview";
import CTA from "./components/Landing/Core/CTA";

export default function Home() {
  return (
    <div>
      {/* hero */}
      <section>
        <Hero />
      </section>

      {/* features */}
      <section className="py-12 px-15">
        <Features />
      </section>

      {/* preview */}
      <section className="py-12">
        <Preview />
      </section>

      {/* privacy */}
      <section className="py-12 px-15">
        <Privacy />
      </section>

      {/* CTA */}
      <section >
        <CTA />
      </section>

      <section>
        <Footer />
      </section>
    </div>
  );
}
