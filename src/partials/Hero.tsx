export default function Hero() {
  return (
    <div className="max-w-[85rem] px-4 py-4 sm:px-6 lg:px-8 lg:py-10 mx-auto">
      {/* Animated gradient line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#a5c2ff] to-transparent my-8 opacity-50"></div>
      
      <div className="mt-5 lg:mt-12 grid lg:grid-cols-3 gap-12 items-start">
        
        {/* Header Section */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-bold text-3xl text-[#a5c2ff] tracking-tight">
            Look Hook <br />
          </h2>
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wider text-white">
              DeVote System
            </p>
            <p className="text-gray-400 leading-relaxed">
              A strategic tool for coordination between the team and the community. We identify core interests and define the project's trajectory together.
            </p>
          </div>
        </div>

        {/* Feature Grid Section */}
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
            
            {/* Community Voice */}
            <Feature 
              title="Community Voice" 
              desc="Directly influence development priorities and new product features."
              icon={<path d="M12 5v14M5 12h14" />} 
            />

            {/* Vision Alignment */}
            <Feature 
              title="Vision Alignment" 
              desc="Ensuring a balance between community feedback and the project's long-term roadmap."
              icon={<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />} 
            />

            {/* Active Rewards */}
            <Feature 
              title="Active Rewards" 
              desc="Participate-to-Earn: every on-chain action is rewarded with HASH tokens."
              icon={<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />} 
            />

            {/* Core Principles */}
            <Feature 
              title="Principles" 
              desc="A commitment to follow community will, unless it conflicts with system security."
              icon={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />} 
            />

          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="flex gap-x-4 group">
      <div className="relative">
        <div className="absolute -inset-1 bg-[#a5c2ff]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
        <svg
          className="relative shrink-0 size-6 text-[#a5c2ff]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      </div>
      <div className="grow">
        <h3 className="text-base font-bold text-gray-200 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-400 leading-snug">
          {desc}
        </p>
      </div>
    </div>
  );
}