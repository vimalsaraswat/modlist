import React from "react";
import Link from "next/link";
import { Camera, Handshake, MessageCircle, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Search",
    description:
      "Find exactly what you need with our powerful search and filters. Browse by car model, location, or part category.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MessageCircle,
    title: "Connect with Sellers",
    description:
      "Message sellers directly through WhatsApp. Ask questions, negotiate prices, and arrange meetups safely.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Handshake,
    title: "Meet & Inspect",
    description:
      "Meet in safe public locations. Inspect parts in person before buying. Cash or e-transfer accepted.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Camera,
    title: "List Your Parts",
    description:
      "Got parts to sell? Upload photos, set your price, and reach thousands of potential buyers in minutes.",
    color: "from-purple-500 to-pink-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-zinc-900 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            How it <span className="text-orange-400">works</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-zinc-400">
            Simple, safe, and straightforward. Join the community of car
            enthusiasts buying and selling parts the right way.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div
                className={`relative z-10 inline-flex h-20 w-20 items-center justify-center bg-gradient-to-br ${step.color} mb-6 rounded-2xl`}
              >
                <step.icon className="text-white" size={32} />
              </div>

              <div className="rounded-2xl border border-zinc-700/30 bg-zinc-800/30 p-6 backdrop-blur-xl">
                <h3 className="mb-4 text-2xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>

              {/* Step Number */}
              <div className="absolute -left-2 -top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-700/50 bg-zinc-800/50 p-8 backdrop-blur-xl">
            <h3 className="mb-4 text-2xl font-bold text-white">
              Ready to get started?
            </h3>
            <p className="mb-6 text-zinc-400">
              Join thousands of car enthusiasts already using ModList to buy and
              sell parts.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/listings"
                className="rounded-full bg-orange-500 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-orange-600"
              >
                Start Browsing
              </Link>
              <Link
                href="/listings/new"
                className="rounded-full border border-zinc-600 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-zinc-800"
              >
                List Your First Part
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
