import { Link } from 'react-router-dom';
import { ArrowRight, PieChart, Shield, Zap } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="px-6 h-20 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium hover:text-brand-600 transition-colors">Features</a>
          <a href="#about" className="text-sm font-medium hover:text-brand-600 transition-colors">About Us</a>
          <Link to="/login" className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-medium transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center p-8 pt-20 pb-32 relative overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/20 blur-[120px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full -z-10" />

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400">
          Split expenses, <br /> maximize friendships.
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
          The most advanced expense sharing platform with powerful analytics, real-time insights, and a beautiful offline-first interface.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login" className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-brand-600/20 flex items-center justify-center gap-2 hover:-translate-y-1">
            Try Demo <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full font-bold text-lg transition-all">
            Learn More
          </button>
        </div>

        {/* Demo Image Mockup */}
        <div className="mt-20 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-w-5xl mx-auto opacity-90 hover:opacity-100 transition-opacity">
          <div className="bg-slate-50 dark:bg-slate-900 h-8 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="ml-4 h-4 bg-slate-200 dark:bg-slate-800 rounded w-64"></div>
          </div>
          <div className="h-[400px] bg-slate-100 dark:bg-black/50 flex items-center justify-center text-slate-400">
            (Interactive Dashboard Preview)
          </div>
        </div>
      </section>

      {/* Trusted By using modern typography logos */}
      <section className="py-12 border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Trusted by finance teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Minimal text-based logos for premium enterprise feel */}
            <span className="text-2xl font-bold font-sans text-slate-800 dark:text-slate-200">ACME<span className="text-brand-600">Corp</span></span>
            <span className="text-2xl font-bold font-serif italic text-slate-800 dark:text-slate-200">Vertex</span>
            <span className="text-2xl font-extrabold tracking-tighter text-slate-800 dark:text-slate-200">G<span className="text-blue-500">K</span>O</span>
            <span className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Nebula.io</span>
            <span className="text-2xl font-mono text-slate-800 dark:text-slate-200">stack_overflow</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need</h2>
            <p className="text-slate-500 text-lg">Powerful features wrapped in a simple, elegant interface.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={PieChart}
              title="Advanced Analytics"
              desc="Visualize user spending habits with interactive graphs, heatmaps, and smart trend insights."
            />
            <FeatureCard
              icon={Zap}
              title="Instant Sync"
              desc="Offline-first architecture ensures your data is always available, anywhere. No server delays."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Private"
              desc="Your financial data stays on your device using local persistence. No cloud storage, no tracking."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-brand-500 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by 500,000+ users</h2>
            <p className="text-slate-400 text-lg">Don't just take our word for it. Here's what our community says.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="SplitwisePro completely changed how my roommates and I handle bills. The analytics are insane—I finally know where my money goes!"
              author="Sarah Jenkins"
              role="Product Designer"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
            />
            <TestimonialCard
              quote="The offline-first architecture is a game changer for our hiking trips. No signal? No problem. It just works."
              author="Mike Chen"
              role="Travel Blogger"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
            />
            <TestimonialCard
              quote="Finally, a finance app that feels like it was designed by humans. The dark mode is beautiful and the charts are super helpful."
              author="Emily Davis"
              role="Software Engineer"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQItem
              question="Is my financial data secure?"
              answer="Absolutely. We use a local-first architecture, meaning your data lives on your device and is never sent to our servers. You have complete control."
            />
            <FAQItem
              question="Can I export my data?"
              answer="Yes! You can export all your expenses and group data to CSV or JSON formats at any time for your own records."
            />
            <FAQItem
              question="Is it really free?"
              answer="SplitwisePro is free for personal use with up to 5 groups. We offer a Pro plan for power users who need unlimited history and advanced export features."
            />
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-24 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-lg text-slate-500 leading-relaxed mb-8">
            We are a team of passionate engineers dedicated to solving the awkwardness of money sharing.
            SplitwisePro was built during the TamboAI Hackathon to demonstrate the power of modern client-side
            technologies. We believe financial tools should be beautiful, fast, and respectful of your data.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#" className="font-semibold text-brand-600 hover:text-brand-700">Meet the Team &rarr;</a>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-100 dark:border-slate-900">
        &copy; 2026 SplitwisePro. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group">
      <div className="w-14 h-14 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, role, avatar }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700">
      <div className="flex gap-1 mb-4 text-yellow-400">
        {[1, 2, 3, 4, 5].map(i => <span key={i}>★</span>)}
      </div>
      <p className="text-lg text-slate-200 mb-6 italic">"{quote}"</p>
      <div className="flex items-center gap-4">
        <img src={avatar} alt={author} className="w-12 h-12 rounded-full border-2 border-brand-500" />
        <div>
          <p className="font-bold text-white">{author}</p>
          <p className="text-sm text-slate-400">{role}</p>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }) {
  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
      <h3 className="font-bold text-lg mb-2">{question}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{answer}</p>
    </div>
  )
}
