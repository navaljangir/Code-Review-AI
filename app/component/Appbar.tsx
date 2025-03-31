"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, User, LogOut, Ticket } from "lucide-react";
import Link from "next/link";

export function Appbar() {
  const session = useSession();
  const router = useRouter();

  return (
    <nav className="w-full fixed border-b border-white/10 z-50 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Link
              href={"/"}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
            >
              CodeReview
            </Link>
          </motion.div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {!session.data?.user.id ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm border border-white/10 hover:border-purple-500/40 rounded-xl px-6 py-2.5 transition-all duration-300"
                    onClick={() => router.push("/signin")}
                  >
                    <span className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-purple-400" />
                      <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                        Login
                      </span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-sm border border-white/10 hover:border-cyan-400/40 rounded-xl px-6 py-2.5 transition-all duration-300"
                    onClick={() => router.push("/signup")}
                  >
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4 text-cyan-400" />
                      <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                        Sign Up
                      </span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <Button onClick={()=> {
                  router.push('/buy')  
                }}
                className="gap-2 flex"
                >
                  <Ticket/>
                  Buy Tokens
                </Button>
                <Button
                  className="group relative overflow-hidden bg-gradient-to-br from-red-500/20 to-orange-600/20 backdrop-blur-sm border border-white/10 hover:border-red-400/40 rounded-xl px-6 py-2.5 transition-all duration-300"
                  onClick={() => signOut()}
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="h-4 w-4 text-red-400" />
                    <span className="bg-gradient-to-r from-red-200 to-orange-200 bg-clip-text text-transparent">
                      Logout
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Animated Border Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </nav>
  );
}
