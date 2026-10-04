/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { HiOutlineLockClosed } from "react-icons/hi";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { ImSpinner2 } from "react-icons/im";

// ------------------------------
// Zod validation schema
// ------------------------------
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ------------------------------
// Animated background shapes
// (same as LoginForm / SignupForm / previous pages)
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
// Main Page
// ------------------------------
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const router = useRouter();

  const { isLoading, error, resetPassword } = useAuth();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const result = resetPasswordSchema.safeParse(form);
    if (!token) {
      setErrors({ confirmPassword: "Invalid or missing reset link" });
      return;
    }
    if (!result.success) {
      const fieldErrors: { password?: string; confirmPassword?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === "password" || field === "confirmPassword") {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);

      return;
    }

    if (typeof token !== "string") {
      setErrors({});

      return;
    }

    setErrors({});

    await resetPassword(form.password, token);
    router.push("/");
    console.log("New password validated:", result.data.password);
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
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.15,
              type: "spring",
              stiffness: 180,
              damping: 14,
            }}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-pink-50"
          >
            <HiOutlineLockClosed className="text-pink-500" size={42} />
          </motion.div>
        </div>

        <div className="mb-7 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-2xl font-semibold text-gray-900"
          >
            Reset your password
          </motion.h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Enter a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Field
            label="New Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
          />
          <Field
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
          />
          {error && <p className="text-red-500 my-2">{error}</p>}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-2 py-2.5 rounded-xl font-medium text-white
              bg-linear-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-200
              hover:shadow-rose-300 transition-shadow duration-300"
          >
            {isLoading ? (
              <ImSpinner2
                size={20}
                className="text-white mx-auto animate-spin"
              />
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
