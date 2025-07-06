import React from "react";
import { MessageSquare, Shield, Trophy, Users } from "lucide-react";

const communityStats = [
  {
    icon: Users,
    value: "25,000+",
    label: "Active Members",
    description: "Car enthusiasts from coast to coast",
  },
  {
    icon: MessageSquare,
    value: "150K+",
    label: "Messages Sent",
    description: "Connecting buyers and sellers daily",
  },
  {
    icon: Trophy,
    value: "98%",
    label: "Success Rate",
    description: "Successful transactions completed",
  },
  {
    icon: Shield,
    value: "4.9/5",
    label: "Trust Score",
    description: "Based on user reviews and ratings",
  },
];

const CommunitySection = () => {
  return (
    <section className="bg-gradient-to-br from-zinc-900 via-orange-900/10 to-zinc-900 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            Join the <span className="text-orange-400">community</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-zinc-400">
            More than just a marketplace - we're a community of passionate car
            enthusiasts helping each other build better rides.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {communityStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10">
                <stat.icon className="text-orange-400" size={28} />
              </div>

              <div className="mb-4">
                <div className="mb-2 text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="mb-2 text-lg font-semibold text-orange-400">
                  {stat.label}
                </div>
                <div className="text-sm text-zinc-400">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="rounded-3xl border border-zinc-700/50 bg-zinc-800/50 p-8 backdrop-blur-xl">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-3xl font-bold text-white">
                Why choose ModList?
              </h3>
              <div className="space-y-4">
                {[
                  "Direct WhatsApp messaging with sellers",
                  "Local meetups for safe transactions",
                  "Verified seller ratings and reviews",
                  "No listing fees or hidden charges",
                  "City-specific feeds and recommendations",
                  "Car-specific part compatibility",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-orange-400" />
                    <span className="text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="mb-6 inline-block rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 p-8">
                <Users className="text-white" size={64} />
              </div>
              <div className="mb-4 text-white">
                <div className="mb-2 text-2xl font-bold">Ready to join?</div>
                <div className="text-zinc-400">
                  It's free and takes less than 2 minutes
                </div>
              </div>
              <button className="rounded-full bg-orange-500 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-orange-600">
                Sign Up Now
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default CommunitySection;
