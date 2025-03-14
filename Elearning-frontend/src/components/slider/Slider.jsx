import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Brain, Lightbulb, Rocket, Award, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Slider() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side Content */}
          <div className="z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight"
            >
              Unlock Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-400">
                Learning Potential
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg"
            >
              Gain in-demand skills, learn from industry experts, and accelerate your career with our expert-led online
              courses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/courses"
                className="px-6 py-3 text-white bg-teal-600 rounded-lg font-medium shadow-lg hover:bg-teal-700 transition duration-200"
              >
                Browse Courses
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium shadow-md hover:bg-gray-100 transition duration-200"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Professional Animated Centerpiece (Education Theme) */}
          <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
            {/* Background Glow Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isVisible ? 0.5 : 0,
                scale: isVisible ? [0.95, 1.05, 0.95] : 0.8,
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-teal-300/20 to-cyan-300/20 blur-3xl"
            />

            {/* Static Graduation Cap Icon in the Center */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="absolute z-10 bg-white shadow-2xl rounded-full w-40 h-40 md:w-48 md:h-48 flex items-center justify-center"
            >
              <GraduationCap className="w-24 h-24 text-teal-600" />
            </motion.div>

            {/* Floating Icons */}
            {[
              { icon: BookOpen, delay: 0.5, color: "bg-teal-500", label: "Courses" },
              { icon: Brain, delay: 0.7, color: "bg-cyan-500", label: "Knowledge" },
              { icon: Lightbulb, delay: 0.9, color: "bg-emerald-500", label: "Ideas" },
              { icon: Rocket, delay: 1.1, color: "bg-blue-500", label: "Growth" },
              { icon: Award, delay: 1.3, color: "bg-indigo-500", label: "Success" },
            ].map((item, index) => {
              const angle = index * ((2 * Math.PI) / 5);
              const radius = 160;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    x: isVisible ? Math.cos(angle) * radius : 0,
                    y: isVisible ? Math.sin(angle) * radius : 0,
                    scale: isVisible ? [0.9, 1.1, 0.9] : 0.9,
                  }}
                  transition={{
                    opacity: { duration: 1, delay: item.delay },
                    x: { duration: 1, delay: item.delay, type: "spring" },
                    y: { duration: 1, delay: item.delay, type: "spring" },
                    scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                  }}
                  className={`absolute flex flex-col items-center ${item.color} text-white p-3 rounded-full shadow-lg`}
                >
                  <item.icon className="w-6 h-6 md:w-8 md:h-8" />
                  <span className="text-xs font-medium mt-1">{item.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
