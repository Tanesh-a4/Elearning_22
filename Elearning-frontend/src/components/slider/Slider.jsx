import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Brain, Lightbulb, Rocket, Award, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Slider() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      size: Math.random() * 10 + 5,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      moveX: (Math.random() - 0.5) * 150,
      moveY: (Math.random() - 0.5) * 150,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden" aria-hidden="false">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Background Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isVisible ? [0, 0.6, 0.4] : 0,
            scale: isVisible ? [0.8, 1.2, 1] : 0.8,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-teal-400/20 to-cyan-400/20 blur-xl"
          style={{ willChange: "transform, opacity" }}
        />

        {/* Particles */}
        {particles.map((particle, index) => (
          <motion.div
            key={`particle-${index}`}
            className={`absolute rounded-full ${
              index % 3 === 0
                ? "bg-gradient-to-r from-teal-300 to-cyan-300"
                : index % 3 === 1
                ? "bg-gradient-to-r from-emerald-300 to-teal-300"
                : "bg-gradient-to-r from-cyan-300 to-blue-300"
            }`}
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.left,
              top: particle.top,
              willChange: "transform, opacity",
            }}
            initial={{ opacity: 0 }}
            animate={{
              x: [0, particle.moveX],
              y: [0, particle.moveY],
              opacity: isVisible ? [0, 0.4, 0] : 0,
              scale: isVisible ? [0.8, 1.2, 0.8] : 0.8,
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Geometric Floating Shapes */}
        {[
          { shape: "circle", size: 16, color: "border-teal-400", delay: 0.2 },
          { shape: "square", size: 14, color: "border-emerald-400", delay: 1.4 },
          { shape: "circle", size: 22, color: "border-indigo-400", delay: 2.6 },
          { shape: "square", size: 18, color: "border-cyan-400", delay: 0.8 },
          { shape: "circle", size: 20, color: "border-blue-400", delay: 2.0 },
        ].map((item, index) => {
          const distance = 180 + index * 15;
          const speed = 15 + index * 5;

          return (
            <motion.div
              key={`shape-${index}`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isVisible ? 0.6 : 0,
                rotate: 360,
              }}
              transition={{
                opacity: { duration: 1, delay: item.delay },
                rotate: { duration: speed, repeat: Infinity, ease: "linear" },
              }}
              style={{
                width: item.size,
                height: item.size,
                borderWidth: 2,
                borderRadius: item.shape === "circle" ? "50%" : "0",
                left: `${50 + index * 10}%`,
                top: `${30 + index * 8}%`,
                position: "absolute",
                willChange: "transform, opacity",
              }}
              className={`${item.color}`}
            >
              <motion.div
                animate={{
                  x: [
                    Math.cos(0) * distance,
                    Math.cos(Math.PI / 2) * distance,
                    Math.cos(Math.PI) * distance,
                    Math.cos((Math.PI * 3) / 2) * distance,
                    Math.cos(Math.PI * 2) * distance,
                  ],
                  y: [
                    Math.sin(0) * distance,
                    Math.sin(Math.PI / 2) * distance,
                    Math.sin(Math.PI) * distance,
                    Math.sin((Math.PI * 3) / 2) * distance,
                    Math.sin(Math.PI * 2) * distance,
                  ],
                }}
                transition={{
                  duration: speed,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          );
        })}

        {/* Animated Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <motion.path
            d="M0,0 C100,100 200,50 300,150 C400,250 500,100 600,200"
            stroke="#0D9488"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: isVisible ? 1 : 0,
              opacity: isVisible ? 1 : 0,
              strokeDashoffset: [0, 1000],
            }}
            transition={{
              pathLength: { duration: 2, delay: 1 },
              opacity: { duration: 1, delay: 1 },
              strokeDashoffset: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            strokeDasharray="5,5"
          />
          <motion.path
            d="M600,0 C500,100 400,50 300,150 C200,250 100,100 0,200"
            stroke="#0D9488"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: isVisible ? 1 : 0,
              opacity: isVisible ? 1 : 0,
              strokeDashoffset: [1000, 0],
            }}
            transition={{
              pathLength: { duration: 2, delay: 1.5 },
              opacity: { duration: 1, delay: 1.5 },
              strokeDashoffset: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            strokeDasharray="5,5"
          />
        </svg>

        {/* Animated Wave at Bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
            <motion.path
              d="M0,0 C150,90 350,0 500,100 C650,200 750,40 900,80 C1050,120 1200,80 1200,80 L1200,120 L0,120 Z"
              fill="#008e9b"
              fillOpacity="0.2"
              initial={{ y: 100 }}
              animate={{ y: isVisible ? 0 : 100 }}
              transition={{ duration: 1.5, delay: 1.5 }}
            />
            <motion.path
              d="M0,80 C150,100 350,10 500,110 C650,210 750,70 900,110 C1050,150 1200,100 1200,100 L1200,120 L0,120 Z"
              fill="#0D9488"
              fillOpacity="0.3"
              initial={{ y: 100 }}
              animate={{ y: isVisible ? 0 : 100 }}
              transition={{ duration: 1.5, delay: 1.7 }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div>
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
              Gain in-demand skills, learn from industry experts, and accelerate your career with our expert-led online courses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/courses"
                className="no-underline px-6 py-3 text-white bg-teal-600 rounded-lg font-medium shadow-lg hover:bg-teal-700 transition duration-200"
              >
                Browse Courses
              </Link>
              <Link
                to="/about"
                className="no-underline px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium shadow-md hover:bg-gray-100 transition duration-200"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Right Side (Graduation Cap + Icons) */}
          <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isVisible ? 0.5 : 0,
                scale: isVisible ? [0.95, 1.05, 0.95] : 0.8,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-teal-300/20 to-cyan-300/20 blur-3xl"
            />

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="absolute z-10 bg-white shadow-2xl rounded-full w-40 h-40 md:w-48 md:h-48 flex items-center justify-center"
            >
              <GraduationCap className="w-24 h-24 text-teal-600" />
            </motion.div>

            {[{ icon: BookOpen, delay: 0.5, color: "bg-teal-500", label: "Courses" },
              { icon: Brain, delay: 0.7, color: "bg-cyan-500", label: "Knowledge" },
              { icon: Lightbulb, delay: 0.9, color: "bg-emerald-500", label: "Ideas" },
              { icon: Rocket, delay: 1.1, color: "bg-blue-500", label: "Growth" },
              { icon: Award, delay: 1.3, color: "bg-indigo-500", label: "Success" }
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
                    scale: { duration: 3, repeat: Infinity, repeatType: "reverse" },
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