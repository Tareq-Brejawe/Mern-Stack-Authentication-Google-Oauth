"use client";
import { useAuth } from "@/store/authStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ImSpinner2 } from "react-icons/im";

function AnimatedBackground() {
  const shapes = [
    { size: 380, top: "-10%", left: "-10%", color: "#fecdd3", duration: 10 },
    { size: 280, top: "60%", left: "75%", color: "#fda4af", duration: 13 },
    { size: 220, top: "10%", left: "80%", color: "#fecaca", duration: 9 },
    { size: 160, top: "75%", left: "5%", color: "#f87171", duration: 12 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-30 blur-3xl"
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            background: s.color,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* subtle diagonal accent shape */}
      <motion.div
        className="absolute w-125 h-125 rounded-[40%] opacity-10"
        style={{
          top: "30%",
          left: "35%",
          background: "linear-gradient(135deg, #f43f5e, #fb7185)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
const Page = () => {
  const { user, logout, isLoading, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(user);

  const handleSubmit = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div>
      <div className="relative min-h-screen w-full bg-white flex items-center justify-center px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-100 shadow-xl shadow-rose-100/50 rounded-2xl p-8"
        >
          <h1 className="text-center text-2xl font-bold text-rose-500">
            Home Page
          </h1>
          <div className="flex mt-4 text-lg font-medium gap-y-4 flex-col items-center">
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
          </div>
          <button
            className="w-full mt-3 py-2.5 rounded-xl font-medium text-white
              bg-linear-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-200
              hover:shadow-rose-300 transition-shadow duration-300"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <ImSpinner2 size={20} className="text- mx-auto animate-spin" />
            ) : (
              "Logout"
            )}
          </button>
        </motion.div>
        <AnimatedBackground />
      </div>
    </div>
  );
};

export default Page;
