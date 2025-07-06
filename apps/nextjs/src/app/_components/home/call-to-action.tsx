import React from "react";
import Link from "next/link";
import { Download, MessageCircle, QrCode, Smartphone } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-orange-900/30 to-zinc-900 py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl">
            Start building your{" "}
            <span className="text-orange-400">dream ride</span> today
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-zinc-400">
            Join 25,000+ car enthusiasts who choose ModList for buying and
            selling quality used car parts, mods, and accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left Side - Features */}
          <div className="space-y-8">
            <div className="rounded-3xl border border-zinc-700/50 bg-zinc-800/50 p-8 backdrop-blur-xl">
              <h3 className="mb-4 text-2xl font-bold text-white">
                Why ModList?
              </h3>
              <div className="space-y-4">
                {[
                  "Direct WhatsApp messaging with sellers",
                  "Local meetups for safe transactions",
                  "No hidden fees or commissions",
                  "Verified seller ratings and reviews",
                  "City-specific part recommendations",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-orange-400" />
                    <span className="text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/listings"
                className="flex items-center justify-center space-x-3 rounded-2xl bg-orange-500 px-8 py-4 font-medium text-white transition-all duration-300 hover:bg-orange-600"
              >
                <MessageCircle size={20} />
                <span>Start Browsing</span>
              </Link>

              <Link
                href="/listings/new"
                className="flex items-center justify-center space-x-3 rounded-2xl border border-zinc-700/50 bg-zinc-800/80 px-8 py-4 font-medium text-white backdrop-blur-xl transition-all duration-300 hover:bg-zinc-800"
              >
                <Download size={20} />
                <span>List Your Parts</span>
              </Link>
            </div>
          </div>

          {/* Right Side - App Download */}
          <div className="text-center">
            <div className="mb-8 inline-block rounded-3xl bg-white p-8 shadow-2xl">
              <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-zinc-900">
                <QrCode size={120} className="text-white" />
              </div>
            </div>

            <div className="mb-6 text-white">
              <div className="mb-2 text-lg font-bold">
                Coming soon to mobile
              </div>
              <div className="text-zinc-400">
                Get notified when our app launches
              </div>
            </div>

            <div className="inline-block">
              <Smartphone className="text-orange-400" size={48} />
            </div>
          </div>
        </div>

        {/* <div className="mt-16 text-center">
          <button className="inline-flex items-center space-x-3 rounded-full bg-orange-500 px-12 py-6 text-xl font-bold text-white transition-colors hover:bg-orange-600">
            <span>Join ModList Today</span>
          </button>

          <div className="mt-6 text-zinc-400">
            Free to join • No listing fees • Direct seller contact
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default CallToAction;
