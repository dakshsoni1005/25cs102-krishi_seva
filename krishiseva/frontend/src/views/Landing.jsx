import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Compass,
  Cpu,
  Scan,
  MessageSquare,
  Sprout,
  Sun,
  Globe
} from "lucide-react";
import { Button } from "../components/common";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2C2E2B] font-sans overflow-x-hidden selection:bg-[#E2E8DE] selection:text-[#2C2E2B]">
      
      {/* 1. NAVBAR - FLOATING ROUNDED PILL */}
      <header className="max-w-7xl mx-auto px-4 pt-6">
        <nav className="bg-white/80 backdrop-blur-md border border-[#E9E8E3] rounded-full h-16 px-6 md:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-black tracking-tight text-lg text-[#1C201A]">
            <div className="w-5 h-5 rounded-full bg-[#3B5A30] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span>Rultivo</span>
            <span className="text-xs text-[#3B5A30] font-bold tracking-widest uppercase ml-1">KrishiSeva</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#666B62]">
            <a href="#about" className="hover:text-[#1C201A] transition-colors">Home</a>
            <a href="#features" className="hover:text-[#1C201A] transition-colors">About Us</a>
            <a href="#solutions" className="hover:text-[#1C201A] transition-colors">Products</a>
            <a href="#revolution" className="hover:text-[#1C201A] transition-colors">Join Us</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-[#1C201A] hover:text-[#3B5A30] px-4 py-2 transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <button className="bg-[#1C201A] hover:bg-[#3B5A30] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all">
                Sign up free
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 bg-[#E9EDE6] text-[#3B5A30] text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-[#D5DDD0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B5A30] animate-pulse" />
          Top Notch Smart Agri Platform
        </div>
        
        <h1 className="text-4xl md:text-7xl font-light tracking-tight text-[#1C201A] max-w-4xl leading-tight m-0">
          Bring Fresh Growth <br />
          <span className="font-extrabold">To Agriculture.</span>
        </h1>
        
        <p className="text-sm md:text-base text-[#666B62] max-w-xl font-medium leading-relaxed">
          KrishiSeva unifies AI leaf disease scanning, regional NPK soil diagnostics, micro-climate weather warnings, live APMC market prices, and government schemes into a single smart dashboard.
        </p>

        <Link to="/register" className="mt-4">
          <button className="bg-[#1C201A] hover:bg-[#3B5A30] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full inline-flex items-center gap-3 transition-all shadow-md hover:-translate-y-0.5">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </section>

      {/* 3. HERO IMAGE CARD WITH OVERLAY */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E9E8E3] h-[350px] md:h-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80" 
            alt="Lush green agriculture field landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="text-white max-w-lg">
              <h2 className="text-2xl md:text-3xl font-extrabold m-0 tracking-tight leading-snug">
                The Journey to a <br />Perfection.
              </h2>
              <p className="text-xs text-white/80 font-semibold uppercase tracking-wider mt-2">
                Active Crop Surveillance & Precision Management
              </p>
            </div>
            
            <Link to="/login" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-full border border-white/20 transition-all flex items-center gap-2">
              Book a Free Demo Experience
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS BANNER */}
      <section className="bg-white border-y border-[#E9E8E3] py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col gap-1 md:border-r border-[#F0EFEA] md:pr-6">
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1C201A]">94%</span>
            <span className="text-[10px] font-bold text-[#666B62] uppercase tracking-widest">AI Scanner Accuracy</span>
          </div>
          <div className="flex flex-col gap-1 md:border-r border-[#F0EFEA] md:pr-6">
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1C201A]">15,000+</span>
            <span className="text-[10px] font-bold text-[#666B62] uppercase tracking-widest">Gujarat Fields Mapped</span>
          </div>
          <div className="flex flex-col gap-1 md:border-r border-[#F0EFEA] md:pr-6">
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1C201A]">120,000+</span>
            <span className="text-[10px] font-bold text-[#666B62] uppercase tracking-widest">Advisories Generated</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1C201A]">$15 Billion</span>
            <span className="text-[10px] font-bold text-[#666B62] uppercase tracking-widest">Subsidies Catalogued</span>
          </div>
        </div>
      </section>

      {/* 5. SPLIT STATEMENT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-4 flex flex-col gap-4 text-xs font-bold uppercase tracking-wider text-[#666B62]">
          <span className="text-[#3B5A30]">2026 Platform</span>
          
          <div className="flex flex-col gap-3 mt-4 border-t border-[#E9E8E3] pt-6">
            <div className="flex items-center justify-between text-[#1C201A] group cursor-pointer py-1">
              <span>Organic Soil Diagnostics</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center justify-between hover:text-[#1C201A] group cursor-pointer py-1">
              <span>AI Pest Scanner</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center justify-between hover:text-[#1C201A] group cursor-pointer py-1">
              <span>Mandi Price Monitor</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col gap-6">
          <h3 className="text-xl md:text-3xl font-light leading-relaxed text-[#1C201A] m-0">
            Despite advances in Agri-Tech, traditional labor-intensive monitoring triggers <span className="font-extrabold">costly crop errors.</span> KrishiSeva automates it with unified intelligence.
          </h3>
          
          <div className="flex gap-12 text-xs font-bold uppercase tracking-wider text-[#666B62] mt-4 border-t border-[#E9E8E3] pt-8">
            <div className="flex flex-col gap-2">
              <span className="text-[#1C201A]">Harvesting Legacy.</span>
              <span className="text-[10px] font-medium leading-relaxed">Securing regional food supplies across Saurashtra.</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[#1C201A]">Planting Tomorrow.</span>
              <span className="text-[10px] font-medium leading-relaxed">Predicting pest distributions before outbreaks happen.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COLLABORATE BANNER - HIGH END SAGE GREEN SCREEN */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative rounded-3xl overflow-hidden shadow-sm h-[250px] md:h-[350px]">
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80" 
            alt="Lush rolling green pasture hills" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#3B5A30]/40 backdrop-brightness-75 mix-blend-multiply" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white max-w-2xl mx-auto gap-4">
            <h3 className="text-2xl md:text-4xl font-extrabold m-0 tracking-tight leading-tight">
              Collaborate And Learn <br />From Industry Experts <br />And Enthusiasts
            </h3>
            <Link to="/register" className="mt-2">
              <button className="bg-white text-[#1C201A] hover:bg-[#3B5A30] hover:text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all">
                Join Ecosystem
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. NEXT-GEN SOLUTIONS - THREE CARD GRID */}
      <section id="solutions" className="bg-white border-y border-[#E9E8E3] py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#1C201A] m-0">
                Next-Gen Solutions For <br />
                <span className="font-extrabold">Optimal Crop Growth</span>
              </h2>
            </div>
            <div className="md:col-span-5">
              <p className="text-xs text-[#666B62] leading-relaxed font-semibold">
                We provide cutting-edge services to help farmers maximize crop yields. Our precision farming, crop monitoring, and automation solutions aim to revolutionize agriculture.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col gap-4 group">
              <div className="rounded-2xl overflow-hidden border border-[#E9E8E3] h-[200px] md:h-[260px] relative">
                <img 
                  src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=600&q=80" 
                  alt="Precision smart farming data analysis" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-lg font-extrabold text-[#1C201A] m-0 group-hover:text-[#3B5A30] transition-colors">
                Farming Precision
              </h4>
              <p className="text-xs text-[#666B62] leading-relaxed font-semibold m-0">
                Our precision farming employs state-of-the-art leaf scanners to diagnose diseases instantly.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col gap-4 group">
              <div className="rounded-2xl overflow-hidden border border-[#E9E8E3] h-[200px] md:h-[260px] relative">
                <img 
                  src="https://images.unsplash.com/photo-1527847263472-aa5338d178b8?auto=format&fit=crop&w=600&q=80" 
                  alt="Drones surveillance over green fields" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-lg font-extrabold text-[#1C201A] m-0 group-hover:text-[#3B5A30] transition-colors">
                Crop Surveillance
              </h4>
              <p className="text-xs text-[#666B62] leading-relaxed font-semibold m-0">
                Track your crops' health and growth in real-time with our innovative task checklists.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col gap-4 group">
              <div className="rounded-2xl overflow-hidden border border-[#E9E8E3] h-[200px] md:h-[260px] relative">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80" 
                  alt="Automated farm irrigation systems" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-lg font-extrabold text-[#1C201A] m-0 group-hover:text-[#3B5A30] transition-colors">
                Automated Farming
              </h4>
              <p className="text-xs text-[#666B62] leading-relaxed font-semibold m-0">
                Enhance farm efficiency and productivity with our cutting-edge automation solutions.
              </p>
            </div>
          </div>

          {/* 8. CASE STUDY HORIZONTAL PILL CARD */}
          <div className="bg-[#F9F8F6] border border-[#E9E8E3] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between mt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E2E8DE] text-[#3B5A30] flex items-center justify-center shrink-0">
                <Sprout className="w-6 h-6" />
              </div>
              <p className="text-xs md:text-sm font-extrabold text-[#1C201A] leading-relaxed m-0">
                Changing The Game In Farming With Sustainable Practices And Cool Technologies, Shaping The Future Of Agriculture.
              </p>
            </div>
            
            <Link to="/register">
              <button className="bg-[#1C201A] hover:bg-[#3B5A30] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all shrink-0">
                Read Stories
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. REVOLUTION CTA SECTION - BOTTOM SUBSCRIPTION BANNER */}
      <section id="revolution" className="max-w-7xl mx-auto px-6 py-24">
        <div className="relative rounded-3xl overflow-hidden shadow-sm h-[300px] md:h-[400px]">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80" 
            alt="Irrigation system watering crops during sunset" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white max-w-xl mx-auto gap-6 z-10">
            <h2 className="text-2xl md:text-4xl font-extrabold m-0 tracking-tight leading-snug">
              Join The Agricultural <br />Revolution Today!
            </h2>
            <p className="text-xs text-white/80 font-semibold max-w-sm m-0 leading-relaxed">
              Sign up for a free developer account in under 2 minutes. Experience the unified farmer dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mt-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs px-6 py-3 rounded-full outline-hidden w-full focus:bg-white/25 transition-all text-center sm:text-left"
              />
              <Link to="/register" className="w-full sm:w-auto shrink-0">
                <button className="bg-white hover:bg-[#3B5A30] hover:text-white text-[#1C201A] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all w-full flex items-center justify-center gap-2">
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SLEEK FOOTER */}
      <footer className="bg-white border-t border-[#E9E8E3] py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-start pb-12 border-b border-[#F0EFEA]">
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 font-black tracking-tight text-lg text-[#1C201A]">
              <div className="w-5 h-5 rounded-full bg-[#3B5A30] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <span>Rultivo</span>
            </div>
            <p className="text-xs text-[#666B62] leading-relaxed font-semibold max-w-xs m-0">
              We are custom home builder located in Dallas, TX servicing Highland Park. Cultivate & Precision farming options.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-[#666B62] mt-2">
              <a href="#" className="hover:text-[#3B5A30]">Fb</a>
              <a href="#" className="hover:text-[#3B5A30]">Tw</a>
              <a href="#" className="hover:text-[#3B5A30]">Ig</a>
              <a href="#" className="hover:text-[#3B5A30]">Ln</a>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-bold uppercase tracking-wider text-[#666B62]">
            <div className="flex flex-col gap-3">
              <span className="text-[#1C201A] font-extrabold">Company</span>
              <a href="#about" className="hover:text-[#3B5A30] font-semibold">Features</a>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">Pricing</a>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">About Us</a>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">Contact</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[#1C201A] font-extrabold">Resource</span>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">Blog</a>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">Customers</a>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">Information</a>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">Legal</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[#1C201A] font-extrabold">Career</span>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">Jobs</a>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">Hiring</a>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">Press</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[#1C201A] font-extrabold">Help</span>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">FAQ</a>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">Help Center</a>
              <a href="#" className="hover:text-[#3B5A30] font-semibold">Support</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-[#666B62] uppercase tracking-wider pt-8">
          <span>© 2026 Rultivo Unified AgriTech Platform. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#3B5A30]">Privacy Policy</a>
            <a href="#" className="hover:text-[#3B5A30]">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
