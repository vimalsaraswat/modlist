"use client";

import { Camera, Handshake, MessageCircle, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your Part",
    description:
      "Use filters to find the right part for your car. Search by model, location, or part name.",
  },
  {
    icon: MessageCircle,
    title: "Chat with Seller",
    description:
      "Connect with sellers directly via WhatsApp. Ask questions, negotiate price.",
  },
  {
    icon: Handshake,
    title: "Meet & Inspect",
    description: "Meet in safe public places. Inspect the part before buying.",
  },
  {
    icon: Camera,
    title: "List Your Parts",
    description: "Got parts to sell? Upload photos and details in minutes.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-secondary/20 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            How it <span className="text-accent">Works</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Simple, safe, and fast. Buy and sell car parts the Indian way.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/50 bg-card/50 p-6"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <step.icon size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
