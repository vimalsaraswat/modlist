"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Car, Wrench, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

// tRPC & React Query
import { useTRPC } from "~/trpc/react";

export default function WaitlistPage() {
  const trpc = useTRPC();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef(null);

  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: ["start start", "end end"],
  // });

  // ✅ Fix: Move blobs from the top
  // const blobY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // --- FORM SETUP ---
  const joinWaitlist = useMutation(
    trpc.waitlist.join.mutationOptions({
      onSuccess: () => {
        toast.success("You're on the list! 🎉");
      },
      onError: (err) => {
        let errMsg = "Failed to join waitlist. Please try again.";

        try {
          const parsedError = JSON.parse(err.message) as unknown;
          if (Array.isArray(parsedError) && parsedError.length > 0) {
            errMsg =
              (parsedError as { message: string }[])[0]?.message ?? errMsg;
          }
        } catch (err) {
          console.log(err);
        }

        toast.error(errMsg);
      },
    }),
  );

  const getWaitlistCount = useQuery(
    trpc.waitlist.count.queryOptions(undefined, {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
  );

  const waitlistCount = getWaitlistCount.data ?? 0;

  // --- FORM HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      await joinWaitlist.mutateAsync({ email });
      setEmail("");
      await getWaitlistCount.refetch();
    } catch (err) {
      console.log("Error joining the waitlist:", err);
    }
  };

  // --- ANIMATIONS ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-background text-foreground"
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 top-0 z-0 overflow-hidden"
        // style={{ y: blobY }}
      >
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted/20 to-accent/10" />

        {/* Top-left Blob */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.4 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 12,
            ease: "easeInOut",
          }}
          className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />

        {/* Bottom-right Blob */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.3, opacity: 0.3 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 10,
            delay: 2,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
        />
      </motion.div>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-20 text-center">
        {/* Content */}
        <motion.div
          className="relative z-10 mx-auto max-w-4xl space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl font-extrabold md:text-7xl"
          >
            The <span className="text-primary">ModList</span> is Coming
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-xl text-muted-foreground"
          >
            India’s first dedicated marketplace for car mods, performance parts,
            and tuner culture.
            <br />
            <span className="text-accent">Get early access. No spam.</span>
          </motion.p>

          {/* Waitlist Form */}
          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="mx-auto mt-8 max-w-md space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">
                Email Address
              </Label>
              <div className="group flex">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@tuner.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 group-hover:border-primary/50"
                  disabled={joinWaitlist.isPending}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="rounded-l-none transition-transform hover:scale-105"
                  disabled={joinWaitlist.isPending}
                >
                  {joinWaitlist.isPending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Inline Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
          </motion.form>

          {/* Social Proof */}
          <motion.p
            variants={fadeInUp}
            className="text-sm text-muted-foreground"
          >
            Join{" "}
            <span className="font-medium text-primary">
              {!getWaitlistCount.isLoading && waitlistCount > 10
                ? `${waitlistCount.toLocaleString()}+`
                : "fellow"}
            </span>{" "}
            tuners already waiting.
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="text-sm text-muted-foreground"
          >
            By joining, you agree to our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex h-10 w-6 justify-center rounded-full border border-border">
            <div className="mt-2 h-3 w-1 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="bg-muted/20 px-6 py-24"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Performance First",
              desc: "Turbo kits, ECUs, exhausts — only the best parts for your build.",
            },
            {
              icon: Wrench,
              title: "Trusted Sellers",
              desc: "Every seller is community-verified. No junk, no scams.",
            },
            {
              icon: Car,
              title: "Built for India",
              desc: "From Maruti to Mustang, find parts for any car on Indian roads.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="space-y-4 text-center"
              whileHover={{ y: -6 }}
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform hover:scale-110">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="px-6 py-24"
      >
        <motion.div
          variants={fadeInUp}
          className="mx-auto mb-16 max-w-4xl text-center"
        >
          <h2 className="text-4xl font-bold md:text-5xl">
            How <span className="text-primary">ModList</span> Works
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Simple. Fast. Built for tuners.
          </p>
        </motion.div>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {[
            "List your parts in minutes",
            "Buyers message you directly",
            "Meet locally & test before buying",
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="rounded-xl border border-border bg-card/50 p-6 text-center transition-all hover:bg-card hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                {i + 1}
              </div>
              <p className="text-card-foreground">{step}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="z-20 bg-gradient-to-br from-primary/10 via-muted/20 to-accent/10 px-6 py-24"
      >
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            Ready to <span className="text-primary">mod smarter?</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Join{" "}
            {!getWaitlistCount.isLoading && waitlistCount > 10
              ? `${waitlistCount.toLocaleString()}+`
              : "fellow"}{" "}
            tuners waiting for early access. Be first in line.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="z-20 bg-primary/80 transition-transform hover:scale-105"
            >
              <Link href="#waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ModList. Made for Indian Tuners.</p>
      </footer>
    </div>
  );
}
