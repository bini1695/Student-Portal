'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Globe2,
  GraduationCap,
  LogIn,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { INULogo } from '@/components/ui/INULogo';

const ROLE_ROUTES: Record<string, string> = {
  super_admin: '/super-admin',
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
  accountant: '/accountant',
  dept_head: '/dept-head',
};

function AnimatedCounter({
  target,
  duration = 1800,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | undefined;
    let frame = 0;
    const animate = (time: number) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration, isInView, target]);

  return <span ref={ref}>{count}</span>;
}

function FadeIn({
  children,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-48px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) return;

    try {
      const user: unknown = JSON.parse(userData);
      if (
        typeof user === 'object' &&
        user !== null &&
        'role' in user &&
        typeof user.role === 'string' &&
        ROLE_ROUTES[user.role]
      ) {
        setUserRole(user.role);
        return;
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const isLoggedIn = Boolean(userRole);
  const handleDashboard = () => {
    const target = ROLE_ROUTES[userRole];
    if (target) router.push(target);
  };

  const features = [
    {
      icon: GraduationCap,
      title: 'Student Management',
      desc: 'Register students, track academic progress, and manage enrollment seamlessly.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: BookOpen,
      title: 'Course Management',
      desc: 'Create courses and sections, and assign teachers with ease.',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Users,
      title: 'Faculty Portal',
      desc: 'Manage classes, grades, attendance, and learning materials.',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: Award,
      title: 'Grading System',
      desc: 'Record grades, calculate academic results, and generate transcripts.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: ClipboardList,
      title: 'Online Enrollment',
      desc: 'Enroll in courses online with clear approval workflows.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      desc: 'Give each member of the university a secure, dedicated workspace.',
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  const roles = [
    { icon: Shield, label: 'Super Admin', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Building2, label: 'Admin', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Users, label: 'Teacher', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: GraduationCap, label: 'Student', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: TrendingUp, label: 'Accountant', color: 'text-rose-600', bg: 'bg-rose-50' },
    { icon: BookOpen, label: 'Dept Head', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-white">
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 shadow-sm backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Injibara University home">
            <motion.div whileHover={{ scale: 1.02 }}>
              <INULogo size={48} />
            </motion.div>
          </Link>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleDashboard}
                className="btn btn-primary flex items-center gap-2 shadow-md"
              >
                <TrendingUp size={18} />
                <span className="hidden sm:inline">Go to Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </motion.button>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary flex items-center gap-2">
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link href="/register" className="btn btn-primary flex items-center gap-2 shadow-md">
                  <UserPlus size={18} />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, 40, 0], y: [0, -24, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-blue-200 opacity-40 blur-3xl"
        />
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, -36, 0], y: [0, 24, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-200 opacity-40 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-4 rounded-2xl border border-white bg-white/90 px-5 py-4 shadow-lg backdrop-blur"
              >
                <INULogo size={64} showText={false} />
                <div>
                  <p className="text-xl font-bold text-blue-800">Injibara University</p>
                  <p className="text-sm text-gray-500">Student Portal &amp; Enrollment System</p>
                </div>
              </motion.div>

              <motion.span
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm backdrop-blur"
              >
                <Sparkles size={14} className="text-amber-500" />
                Complete Academic Management
                <Zap size={14} className="text-amber-500" />
              </motion.span>

              <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  INU Portal
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-6 max-w-lg text-lg leading-relaxed text-gray-600"
              >
                A complete enrollment and academic management system for Injibara University.
                Manage students, teachers, courses, grades, and fees — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                {isLoggedIn ? (
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleDashboard}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-xl transition hover:shadow-2xl"
                  >
                    <Rocket size={20} />
                    Go to Dashboard
                    <ArrowRight size={18} />
                  </motion.button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-xl transition hover:shadow-2xl"
                    >
                      <LogIn size={20} />
                      Sign In
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-2 rounded-xl border-2 border-blue-200 bg-white px-6 py-3 text-lg font-semibold text-blue-700 shadow-md transition hover:border-blue-400 hover:shadow-lg"
                    >
                      <UserPlus size={20} />
                      Create Account
                    </Link>
                  </>
                )}
              </motion.div>

              <div className="mt-12 grid max-w-lg grid-cols-3 gap-5">
                {[
                  { value: 6, suffix: '', label: 'User Roles' },
                  { value: 20, suffix: '+', label: 'Features' },
                  { value: 100, suffix: '%', label: 'Web-based' },
                ].map((stat, index) => (
                  <FadeIn key={stat.label} delay={0.12 * index}>
                    <p className="text-3xl font-bold text-gray-900 md:text-4xl">
                      <AnimatedCounter target={stat.value} />
                      {stat.suffix}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                  </FadeIn>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto w-full max-w-lg px-4 py-5 sm:px-8"
            >
              <motion.div
                aria-hidden="true"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute -right-1 top-0 h-28 w-28 rounded-full border-4 border-dashed border-blue-300 opacity-50"
              />
              <motion.div
                aria-hidden="true"
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-1 left-0 h-36 w-36 rounded-full border-4 border-dashed border-purple-300 opacity-40"
              />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl"
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="/images/inu-campus.jpg"
                    alt="Injibara University campus"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 90vw, 40vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/95 via-blue-900/60 to-transparent p-6 pt-24">
                    <div className="flex items-center gap-3">
                      <div className="overflow-hidden rounded-full border-2 border-white/70">
                        <INULogo size={36} showText={false} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">Injibara University</p>
                        <p className="text-sm text-blue-100">Main Campus</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-blue-100">
                      Established with excellence in education
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -left-1 top-14 z-20 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl sm:-left-4"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-amber-100 p-2">
                    <Star className="text-amber-600" size={18} fill="currentColor" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold text-gray-800">Top Rated</span>
                    <span className="block text-[10px] text-gray-500">University</span>
                  </span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 z-20 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl sm:-right-4"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-blue-100 p-2">
                    <Shield className="text-blue-600" size={18} />
                  </span>
                  <span>
                    <span className="block text-xs font-bold text-gray-800">Secure</span>
                    <span className="block text-[10px] text-gray-500">Portal</span>
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50/50 py-20 lg:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-14 text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                <Target size={14} />
                Powerful Features
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 md:text-5xl">
                Everything You Need
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                A complete suite of tools to manage academic administration at Injibara University.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={feature.title} delay={index * 0.08}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 280 }}
                    className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition hover:border-blue-200 hover:shadow-2xl"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity group-hover:opacity-[0.04]`}
                    />
                    <div className="relative">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}
                      >
                        <Icon className="text-white" size={26} />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-gray-800">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.desc}</p>
                    </div>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-purple-50/60 to-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-14 text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700">
                <Globe2 size={14} />
                Multi-Role
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 md:text-5xl">
                Built for Every Role
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                Each user gets their own dashboard with role-specific features.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <FadeIn key={role.label} delay={index * 0.07}>
                  <motion.div
                    whileHover={{ y: -7, scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={`${role.bg} cursor-default rounded-2xl border-2 border-transparent p-5 text-center shadow-md transition hover:border-blue-200 hover:shadow-xl`}
                  >
                    <Icon className={`mx-auto ${role.color}`} size={32} />
                    <p className="mt-3 text-sm font-semibold text-gray-800">{role.label}</p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {!isLoggedIn && (
        <section className="relative overflow-hidden py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
          <motion.div
            aria-hidden="true"
            animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-amber-300 blur-3xl"
          />
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <FadeIn>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6 inline-block"
              >
                <Rocket className="text-white" size={48} />
              </motion.div>
              <h2 className="text-3xl font-bold text-white md:text-5xl">Ready to Get Started?</h2>
              <p className="mt-4 text-lg text-blue-100">
                Create an account or sign in to access your INU dashboard.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 shadow-2xl transition hover:bg-blue-50"
                >
                  <UserPlus size={20} />
                  Create Account
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl border-2 border-white/25 bg-blue-800 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-900"
                >
                  <LogIn size={20} />
                  Sign In
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      <footer className="bg-gray-950 py-12 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-5 flex items-center gap-3">
                <INULogo size={52} showText={false} />
                <div>
                  <p className="text-xl font-bold text-white">Injibara University</p>
                  <p className="text-xs text-blue-300">Student Portal</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-relaxed">
                A modern enrollment and academic management system for Injibara University,
                empowering students, faculty, and staff with seamless digital tools.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-white">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/login" className="flex items-center gap-2 transition hover:text-blue-300">
                    <ArrowRight size={12} /> Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="flex items-center gap-2 transition hover:text-blue-300">
                    <ArrowRight size={12} /> Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-white">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="http://localhost:4000/api/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 transition hover:text-blue-300"
                  >
                    <ArrowRight size={12} /> API Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 md:flex-row">
            <p className="text-sm">
              © {new Date().getFullYear()} <span className="font-semibold text-white">Injibara University</span>.
              {' '}All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <CalendarDays size={14} />
              <span>Academic Year {new Date().getFullYear()}</span>
              <CheckCircle2 size={14} className="ml-1" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
