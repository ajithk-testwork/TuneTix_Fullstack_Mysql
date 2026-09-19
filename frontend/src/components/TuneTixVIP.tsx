
import { motion } from 'framer-motion';
import { Crown, BellRing, Ticket, Sparkles, ArrowRight } from 'lucide-react';

const PERKS = [
  {
    id: 1,
    icon: <BellRing className="w-6 h-6 text-[#00B4D8]" />,
    title: "Pre-Sale Alerts",
    description: "Get notified 24 hours before general ticket sales open."
  },
  {
    id: 2,
    icon: <Ticket className="w-6 h-6 text-[#6C5CE7]" />,
    title: "Zero Hidden Fees",
    description: "Enjoy transparent pricing with waived convenience fees on checkout."
  },
  {
    id: 3,
    icon: <Crown className="w-6 h-6 text-[#F04438]" />,
    title: "VIP Meet & Greets",
    description: "Exclusive access to backstage passes and artist interactions."
  }
];

const TuneTixVIP = () => {
  return (
    <section className="w-full bg-[#F8F9FC] py-16 px-4 sm:px-6 lg:px-12 relative">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Main Banner Container */}
        <div className="relative bg-[#172033] rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(23,32,51,0.3)] px-8 py-16 sm:px-16 lg:py-20 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Background Ambient Orbs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#6C5CE7]/30 rounded-full blur-[100px]" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#00B4D8]/20 rounded-full blur-[100px]" />
          </div>

          {/* Left Content (Copy & CTA) */}
          <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/10 backdrop-blur-md border border-[#FFFFFF]/15 text-[#00B4D8] text-xs font-[800] uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" /> TuneTix Pro
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[800] text-[#FFFFFF] tracking-tight leading-[1.1] mb-6">
              Skip The Queue. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#00B4D8]">
                Own The Front Row.
              </span>
            </h2>
            
            <p className="text-[#FFFFFF]/80 font-[500] text-base sm:text-lg mb-10 max-w-lg leading-relaxed">
              Join our exclusive community of hardcore music fans. Never miss out on a sold-out stadium tour or underground acoustic set again.
            </p>

            <button className="group px-8 py-4 bg-[#6C5CE7] hover:bg-[#4834D4] text-[#FFFFFF] font-[800] rounded-xl shadow-[0_8px_20px_rgba(108,92,231,0.3)] transition-all flex items-center gap-3 active:scale-95">
              Claim Your VIP Access 
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[#FFFFFF]/50 text-xs font-[600] mt-4">
              *Cancel anytime. Subject to terms and conditions.
            </p>
          </div>

          {/* Right Content (Floating Perk Cards) */}
          <div className="relative z-10 w-full lg:w-1/2 flex flex-col gap-4 sm:gap-6">
            {PERKS.map((perk, index) => (
              <motion.div
                key={perk.id}
                initial={{ y: 0 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: index * 0.4 // Creates a staggered wave floating effect
                }}
                className="bg-[#FFFFFF]/10 backdrop-blur-xl border border-[#FFFFFF]/15 rounded-2xl p-5 sm:p-6 flex items-start gap-5 hover:bg-[#FFFFFF]/20 transition-colors cursor-default"
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#FFFFFF]/10 flex items-center justify-center border border-[#FFFFFF]/20 shadow-inner">
                  {perk.icon}
                </div>
                <div>
                  <h3 className="text-lg font-[800] text-[#FFFFFF] tracking-tight mb-1">
                    {perk.title}
                  </h3>
                  <p className="text-[#FFFFFF]/70 font-[500] text-sm leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default TuneTixVIP;