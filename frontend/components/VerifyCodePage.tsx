/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { useAuth } from "@/store/authStore";
import { useRouter } from "next/navigation";

// ------------------------------
// Animated background shapes
// (same as LoginForm / SignupForm / CheckInboxPage)
// ------------------------------
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

const CODE_LENGTH = 6;

// ------------------------------
// Main Page
// ------------------------------
export default function VerifyCodePage() {
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [status, setStatus] = useState("idle"); // idle | verifying | success | error
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const { isLoading, error, verifyCode } = useAuth();
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    // allow only single digits
    const val = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = val;
    setDigits(next);

    if (val && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: {
    preventDefault: () => void;
    clipboardData: { getData: (arg0: string) => string };
  }) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((char: string, i: number) => (next[i] = char));
    setDigits(next);
    const lastIndex = Math.min(pasted.length, CODE_LENGTH) - 1;
    inputsRef.current[lastIndex]?.focus();
  };

  // Auto-submit once all 6 digits are filled
  useEffect(() => {
    const code = digits.join("");
    if (code.length === CODE_LENGTH && !digits.includes("")) {
      setStatus("verifying");

      const timer = setTimeout(() => {
        // Replace with real verification call
        console.log("Verifying code:", code);
        setStatus("success");
        verifyCode(code);
      }, 1000);
      router.push("/");
      return () => clearTimeout(timer);
    }
  }, [digits]);

  return (
    <div className="relative min-h-screen w-full bg-white flex items-center justify-center px-4 overflow-hidden">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-100 shadow-xl shadow-rose-100/50 rounded-2xl p-10 flex flex-col items-center text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 180,
            damping: 14,
          }}
          className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-pink-50"
        >
          <HiOutlineShieldCheck className="text-pink-500" size={52} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-xl font-semibold text-gray-900 mb-2"
        >
          Verify your code
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-gray-500 text-sm leading-relaxed mb-7"
        >
          Enter the 6-digit code
        </motion.p>

        {/* Digit inputs */}
        <div className="flex gap-2.5 justify-center mb-6" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <motion.input
              key={i}
              whileFocus={{ scale: 1.05 }}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={status === "verifying" || status === "success"}
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-semibold rounded-xl border
                bg-white text-gray-900 outline-none transition-all duration-200
                ${
                  status === "error"
                    ? "border-red-400 focus:ring-2 focus:ring-red-300"
                    : status === "success"
                      ? "border-green-400 focus:ring-2 focus:ring-green-300"
                      : "border-gray-200 focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
                }`}
            />
          ))}
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {/* Status feedback */}
        <AnimatePresence mode="wait">
          {status === "verifying" && isLoading && (
            <motion.p
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-rose-500 text-sm font-medium"
            >
              Verifying code...
            </motion.p>
          )}
        </AnimatePresence>

        {status === "idle" && (
          <p className="text-xs text-gray-400">
            Did not get a code?{" "}
            <button className="text-rose-500 hover:text-rose-600 font-medium transition-colors">
              Resend
            </button>
          </p>
        )}
      </motion.div>
    </div>
  );
}
