"use client";

import { motion } from "framer-motion";

export default function Navbar({ setActive, active }) {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <h1 className="text-xl font-bold">AI Rhinoplasty Tool</h1>

      <div className="flex gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`px-4 py-2 rounded-md transition ${
            active === "before" ? "bg-blue-500" : "bg-gray-700"
          }`}
          onClick={() => setActive("before")}
        >
          Before
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`px-4 py-2 rounded-md transition ${
            active === "after" ? "bg-blue-500" : "bg-gray-700"
          }`}
          onClick={() => setActive("after")}
        >
          After
        </motion.button>
      </div>
    </nav>
  );
}
