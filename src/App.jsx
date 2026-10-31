import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import Services from './components/Services.jsx';
import Qualifier from './components/Qualifier.jsx';
import Experience from './components/Experience.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-signal focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>
      <Nav />
      <main id="top">
        <Hero />
        <div className="grid gap-24 sm:gap-32">
          <Work />
          <Services />
          <Qualifier />
          <Experience />
          <Skills />
        </div>
      </main>
      <Contact />
    </>
  );
}
