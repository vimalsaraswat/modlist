import React from "react";
import { MessageSquare, Shield, Trophy, Users } from "lucide-react";

export default function CommunitySection() {
  const stats = [
    {
      icon: Users,
      value: "15,000+",
      label: "Active Members",
      description: "Car enthusiasts from across India",
    },
    {
      icon: MessageSquare,
      value: "80K+",
      label: "Messages Sent",
      description: "Connecting buyers and sellers daily",
    },
    {
      icon: Trophy,
      value: "96%",
      label: "Success Rate",
      description: "Successful transactions completed",
    },
    {
      icon: Shield,
      value: "4.8/5",
      label: "Trust Score",
      description: "Based on user reviews and ratings",
    },
  ];

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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
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
      </div>
    </section>
  );
}
