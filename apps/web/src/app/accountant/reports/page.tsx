'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  GraduationCap, BookOpen, Users, Award, Shield, TrendingUp,
  CheckCircle, ArrowRight, LogIn, UserPlus, Building2, ClipboardList,
  Sparkles, Star, Zap, Target, Rocket, Globe, Calendar, DollarSign,
} from 'lucide-react';

const ROLE_ROUTES: Record<string, string> = {
  super_admin: '/super-admin',
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
  accountant: '/accountant',
  dept_head: '/dept-head',
};

// Animated counter component
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

// Fade-in on scroll wrapper
function FadeIn({
  children,
  delay = 0,
  y = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserRole(user.role || '');
      } catch {
        localStorage.clear();
      }
    }

    // Mouse tracking for hero glow effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDashboard = () => {
    const target = ROLE_ROUTES[userRole];
    if (target) router.push(target);
  };

  const features = [
    { icon: GraduationCap, title: 'Student Management', desc: 'Register students, track academics, manage enrollment seamlessly.', color: 'from-blue-500 to-blue-600' },
    { icon: BookOpen, title: 'Course Management', desc: 'Create courses, sections, and assign teachers with ease.', color: 'from-green-500 to-green-600' },
    { icon: Users, title: 'Faculty Portal', desc: 'Teachers manage classes, grades, attendance, and materials.', color: 'from-purple-500 to-purple-600' },
    { icon: Award, title: 'Grading System', desc: 'Record grades, calculate GPA, and generate transcripts.', color: 'from-yellow-500 to-orange-500' },
    { icon: ClipboardList, title: 'Enrollment System', desc: 'Students enroll in courses online with approval workflows.', color: 'from-red-500 to-pink-500' },
    { icon: Shield, title: 'Role-Based Access', desc: 'Secure access control for 6 different roles.', color: 'from-indigo-500 to-purple-500' },
  ];

  const roles = [
    { icon: Shield, label: 'Super Admin', desc: 'System control', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Building2, label: 'Admin', desc: 'Manage academics', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Users, label: 'Teacher', desc: 'Teach & grade', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: GraduationCap, label: 'Student', desc: 'Learn & enroll', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { icon: TrendingUp, label: 'Accountant', desc: 'Fees & payments', color: 'text-red-600', bg: 'bg-red-50' },
    { icon: BookOpen, label: 'Dept Head', desc: 'Lead department', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ============================================
          NAVBAR
      ============================================ */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Student Portal
              </h1>
              <p className="text-xs text-gray-500">Enrollment System</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDashboard}
                className="btn btn-primary flex items-center gap-2 shadow-lg"
              >
                <TrendingUp size={18} />
                Go to Dashboard
              </motion.button>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/login"
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <LogIn size={18} />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="btn btn-primary flex items-center gap-2 shadow-lg"
                  >
                    <UserPlus size={18} />
                    <span className="hidden sm:inline">Register</span>
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ============================================
          HERO SECTION
      ============================================ */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur border border-blue-200 text-blue-700 rounded-full text-sm font-medium mb-6 shadow-sm"
              >
                <Sparkles size={14} className="text-yellow-500" />
                Complete Academic Management
                <Zap size={14} className="text-yellow-500" />
              </motion.span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Student Portal
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-lg text-gray-600 max-w-lg"
              >
                A complete enrollment and academic management system. Manage
                students, teachers, courses, grades, and fees — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                {isLoggedIn ? (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDashboard}
                    className="btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-2 text-lg px-6 py-3 shadow-xl hover:shadow-2xl transition"
                  >
                    <Rocket size={20} />
                    Go to Dashboard
                    <ArrowRight size={18} />
                  </motion.button>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/login"
                        className="btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-2 text-lg px-6 py-3 shadow-xl hover:shadow-2xl transition"
                      >
                        <LogIn size={20} />
                        Sign In
                        <ArrowRight size={18} />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/register"
                        className="btn bg-white text-blue-600 border-2 border-blue-200 flex items-center gap-2 text-lg px-6 py-3 shadow-lg hover:border-blue-400 transition"
                      >
                        <UserPlus size={20} />
                        Create Account
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>

              {/* Live stats with animated counters */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <FadeIn delay={0.2}>
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900">
                      <AnimatedCounter target={6} />
                    </p>
                    <p className="text-sm text-gray-500 mt-1">User Roles</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.3}>
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900">
                      <AnimatedCounter target={20} />+
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Features</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.4}>
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900">
                      <AnimatedCounter target={100} />%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Web-based</p>
                  </div>
                </FadeIn>
              </div>
            </motion.div>

            {/* Right: Interactive dashboard preview */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 relative z-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg"
                  >
                    <GraduationCap className="text-white" size={28} />
                  </motion.div>
                  <div>
                    <p className="font-semibold">Dashboard Overview</p>
                    <p className="text-xs text-gray-500">All your data at a glance</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Students', value: '1,234', icon: GraduationCap, color: 'from-green-500 to-emerald-600' },
                    { label: 'Teachers', value: '78', icon: Users, color: 'from-blue-500 to-cyan-600' },
                    { label: 'Courses', value: '45', icon: BookOpen, color: 'from-yellow-500 to-orange-500' },
                    { label: 'Enrollments', value: '892', icon: ClipboardList, color: 'from-purple-500 to-pink-500' },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-4 cursor-pointer shadow-lg`}
                      >
                        <Icon size={20} className="mb-2 opacity-90" />
                        <p className="text-xs opacity-90">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { text: 'Enrollment approved', time: 'just now' },
                    { text: 'Grade submitted', time: '2m ago' },
                    { text: 'Payment received', time: '5m ago' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.2 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="p-1 bg-green-100 rounded-full">
                        <CheckCircle className="text-green-600" size={14} />
                      </div>
                      <span className="text-gray-700 flex-1">{item.text}</span>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-3 border border-gray-100 z-20"
              >
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={16} fill="currentColor" />
                  <span className="text-xs font-semibold">Top Rated</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-3 border border-gray-100 z-20"
              >
                <div className="flex items-center gap-2">
                  <Shield className="text-blue-500" size={16} />
                  <span className="text-xs font-semibold">Secure</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURES SECTION
      ============================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4"
              >
                <Target size={14} className="inline mr-1" />
                Features
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Everything You Need
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                A complete suite of tools to manage every aspect of academic
                administration.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <FadeIn key={f.title} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="card h-full cursor-pointer border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`p-3 rounded-xl inline-block bg-gradient-to-br ${f.color} shadow-lg`}
                    >
                      <Icon className="text-white" size={24} />
                    </motion.div>
                    <h3 className="font-semibold text-lg mt-4">{f.title}</h3>
                    <p className="text-gray-500 text-sm mt-2">{f.desc}</p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          ROLES SECTION
      ============================================ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                <Globe size={14} className="inline mr-1" />
                Multi-Role
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Built for Every Role
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Each user gets their own dashboard with role-specific features.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {roles.map((r, i) => {
              const Icon = r.icon;
              return (
                <FadeIn key={r.label} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`card text-center cursor-pointer ${r.bg} border-2 border-transparent hover:border-blue-300 transition`}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`mx-auto ${r.color}`} size={28} />
                    </motion.div>
                    <p className="font-medium mt-3 text-sm">{r.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{r.desc}</p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
      ============================================ */}
      {!isLoggedIn && (
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

          {/* Animated background pattern */}
          <motion.div
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Rocket className="text-white" size={48} />
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-blue-100 text-lg">
                Create an account or sign in to access your personalized dashboard.
              </p>

              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="btn bg-white text-blue-600 hover:bg-gray-50 flex items-center gap-2 text-lg px-8 py-4 font-semibold shadow-2xl"
                  >
                    <UserPlus size={20} />
                    Create Account
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/login"
                    className="btn bg-blue-800 text-white hover:bg-blue-900 flex items-center gap-2 text-lg px-8 py-4 font-semibold border-2 border-white/20"
                  >
                    <LogIn size={20} />
                    Sign In
                  </Link>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ============================================
          FOOTER
      ============================================ */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <GraduationCap className="text-white" size={18} />
                </div>
                <span className="text-white font-semibold text-lg">
                  Student Portal
                </span>
              </div>
              <p className="text-sm max-w-md">
                A modern enrollment and academic management system for schools,
                colleges, and universities.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/login" className="hover:text-white transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition">
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">System</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="http://localhost:4000/api/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition"
                  >
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} Student Portal. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Calendar size={14} />
              <span>Academic Year {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}