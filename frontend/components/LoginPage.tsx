/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImSpinner2 } from "react-icons/im";
import { GoogleLogin } from "@react-oauth/google";

// ------------------------------
// Animated background shapes
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

// ------------------------------
// Input Field component
// ------------------------------
type FieldProps = {
  label: string;
  type: React.HTMLInputTypeAttribute;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder: string;
};
function Field({
  label,
  type,
  name,
  value,
  onChange,
  error,
  placeholder,
}: FieldProps) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>
      <motion.input
        whileFocus={{ scale: 1.01 }}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white text-gray-900 placeholder-gray-400
          outline-none transition-all duration-200
          ${
            error
              ? "border-red-400 focus:ring-2 focus:ring-red-300"
              : "border-gray-200 focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
          }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-red-500 text-xs mt-1.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------
// Main Form
// ------------------------------

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const router = useRouter();
  const { isLoading, error, login, googleLogin } = useAuth();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await login(form.email, form.password);
    router.push("/");
  };

  const handleGoogleSuccess = async (res: { credential?: string }) => {
    if (!res.credential) return;
    try {
      await googleLogin(res.credential);
      router.push("/");
    } catch {}
  };

  return (
    <div className="relative min-h-screen w-full bg-white flex items-center justify-center px-4 overflow-hidden">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-100 shadow-xl shadow-rose-100/50 rounded-2xl p-8"
      >
        <div className="mb-7 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-semibold text-gray-900"
          >
            Welcome back
          </motion.h1>
          <p className="text-gray-500 text-sm mt-1.5">Log in to your account</p>
        </div>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Google login failed")}
          text="signin_with"
          shape="pill"
        />
        <div className="flex items-center justify-between w-full">
          <div className="w-full relative my-5 h-px bg-black/10">
            <p className="absolute top-0 bg-white p-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              or
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <Field
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@example.com"
          />
          <Field
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <div className="flex justify-end mb-1">
            <Link
              href="/forgot-password"
              className="text-xs text-rose-500 hover:text-rose-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          {error && <p className="my-2 text-red-500">{error}</p>}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-3 py-2.5 rounded-xl font-medium text-white
              bg-linear-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-200
              hover:shadow-rose-300 transition-shadow duration-300"
          >
            {isLoading ? (
              <ImSpinner2
                size={20}
                className="text-white mx-auto animate-spin"
              />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
        <div>
          <p className="text-sm text-center mt-4">
            Don&apos;t have an acount?
            <Link
              href="/signup"
              className="text-rose-500 pl-1 hover:text-rose-700 transition-colors"
            >
              Signup
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
