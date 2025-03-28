"use client";
import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, Key } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const session = useSession();
  const userId = session.data?.user.id;
  return (
    <div className="w-full h-screen text-white bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/50" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-300 to-pink-600 text-transparent bg-clip-text leading-tight">
              Next-Gen
              <br />
              Code Reviews
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Revolutionize your development workflow with AI-powered insights
              and enterprise-grade security
            </p>
            <Link
              href={userId ? "/chat" : "signin"}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-110 transform transition-all duration-200 text-lg px-8 py-2 rounded-full shadow-xl hover:shadow-purple-500/20"
            >
              Start Free Trial
            </Link>
          </motion.div>

          {/* Animated Grid Pattern */}
          {/* <div className="absolute inset-0 -z-10 opacity-10">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-30 animate-pan" />
                    </div> */}

          {/* Feature Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24"
          >
            {[
              {
                icon: Sparkles,
                title: "AI Analysis",
                desc: "Deep learning-powered code insights",
                color: "purple",
              },
              {
                icon: Zap,
                title: "Real-Time",
                desc: "Instant feedback & suggestions",
                color: "pink",
              },
              {
                icon: Shield,
                title: "Security",
                desc: "Vulnerability detection & prevention",
                color: "purple",
              },
              {
                icon: Key,
                title: "MFA Protection",
                desc: "Military-grade authentication",
                color: "blue",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-lg hover:bg-gray-800/20 transition-all duration-300 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 mx-auto group-hover:bg-${feature.color}-500/20 transition-colors`}
                >
                  <feature.icon
                    className={`h-8 w-8 text-${feature.color}-500`}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          {/* Animated Background Elements */}
          <div className="absolute -top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full opacity-20 blur-3xl animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full opacity-10 blur-xl animate-spin-slow" />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
