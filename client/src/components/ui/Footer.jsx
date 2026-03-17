import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Twitter, Github, Linkedin, 
  ChevronUp, ArrowRight, Shield,
  Package, Star, AlertCircle, Heart
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    {
      title: "Get to Know Us",
      links: ["About AETHER", "Careers", "Press Releases", "Scientific Heritage"]
    },
    {
      title: "Connect with Us",
      links: ["Twitter (X)", "Neural Link Support", "Discord Hive", "Laboratory Contacts"]
    },
    {
      title: "Sell on AETHER",
      links: ["Seller Central", "Research Funding", "Hardware Payouts", "Fulfillment by AETHER"]
    },
    {
      title: "Let Us Help You",
      links: ["Your Neural ID", "Returns Center", "Recall Alerts", "Help Matrix"]
    }
  ];

  return (
    <footer className="bg-[#172337] pt-12 mt-12 text-white font-body">
      {/* Back to top feature is usually a light gray bar in Flipkart */}
      <button 
        onClick={scrollToTop}
        className="w-full bg-[#37475a] py-4 text-white text-xs font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
      >
        Back to top
      </button>

      {/* Main Links */}
      <div className="max-w-[1500px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-[#878787] font-bold text-xs mb-4 uppercase tracking-tighter">ABOUT</h3>
          <ul className="flex flex-col gap-2">
            {["Contact Us", "About Us", "Careers", "Flipkart Stories", "Press", "Flipkart Wholesale", "Corporate Information"].map(link => (
              <li key={link}><a href="#" className="text-white text-[12px] hover:underline">{link}</a></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-1">
          <h3 className="text-[#878787] font-bold text-xs mb-4 uppercase tracking-tighter">HELP</h3>
          <ul className="flex flex-col gap-2">
            {["Payments", "Shipping", "Cancellation & Returns", "FAQ", "Report Infringement"].map(link => (
              <li key={link}><a href="#" className="text-white text-[12px] hover:underline">{link}</a></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-1">
          <h3 className="text-[#878787] font-bold text-xs mb-4 uppercase tracking-tighter">POLICY</h3>
          <ul className="flex flex-col gap-2">
            {["Return Policy", "Terms Of Use", "Security", "Privacy", "Sitemap", "EPR Compliance"].map(link => (
              <li key={link}><a href="#" className="text-white text-[12px] hover:underline">{link}</a></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-1 border-r border-[#454d5e] pr-4">
          <h3 className="text-[#878787] font-bold text-xs mb-4 uppercase tracking-tighter">SOCIAL</h3>
          <ul className="flex flex-col gap-2">
            {["Twitter", "Facebook", "YouTube"].map(link => (
              <li key={link}><a href="#" className="text-white text-[12px] hover:underline">{link}</a></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-1 pl-4">
          <h3 className="text-[#878787] font-bold text-xs mb-4 uppercase tracking-tighter">Mail Us:</h3>
          <p className="text-[12px] text-white leading-relaxed">
            Aether Internet Private Limited,<br/>
            Neural Tower, Sector 4,<br/>
            New Delhi, India, 110001
          </p>
        </div>
        <div className="lg:col-span-1">
          <h3 className="text-[#878787] font-bold text-xs mb-4 uppercase tracking-tighter">Registered Office:</h3>
          <p className="text-[12px] text-white leading-relaxed">
            Aether Internet Private Limited,<br/>
            Neural Tower, Sector 4,<br/>
            New Delhi, India, 110001
          </p>
        </div>
      </div>

      {/* System Logo & Language */}
      <div className="border-t border-border-main py-12 flex flex-col items-center gap-8">
         <div className="flex items-center gap-2 opacity-80">
            <div className="w-5 h-5 bg-accent-primary rounded-[2px] rotate-45" />
            <span className="font-display text-xl text-text-main font-extrabold tracking-tighter">AETHER</span>
         </div>
         
         <div className="flex flex-wrap items-center justify-center gap-6">
            <button className="px-5 py-2.5 border border-border-main rounded-sm text-text-muted text-[10px] font-bold uppercase tracking-widest hover:border-accent-primary transition-all flex items-center gap-3 italic">
              English (Universal)
            </button>
            <button className="px-5 py-2.5 border border-border-main rounded-sm text-text-muted text-[10px] font-bold uppercase tracking-widest hover:border-accent-primary transition-all flex items-center gap-3">
               $ USD (Neuro-Credits)
            </button>
         </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#454d5e] py-6 px-10 bg-[#172337]">
        <div className="max-w-[1500px] mx-auto flex flex-wrap gap-8 justify-between text-white text-[12px]">
           <div className="flex items-center gap-2">
              <Package size={14} className="text-accent-warning" />
              <span>Become a Seller</span>
           </div>
           <div className="flex items-center gap-2">
              <Star size={14} className="text-accent-warning" />
              <span>Advertise</span>
           </div>
           <div className="flex items-center gap-2">
              <Heart size={14} className="text-accent-warning" />
              <span>Gift Cards</span>
           </div>
           <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-accent-warning" />
              <span>Help Center</span>
           </div>
           <div className="ml-auto opacity-70">
              &copy; 2040-2041 Aether.com
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
