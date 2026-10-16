"use client";
import Link from "next/link";
import { useState } from "react";

// --- IMPORT THE LOGO HERE (Exact path from your folder structure) ---
import inuLogo from "@/asstes/icons/logo.jpg"; 

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans selection:bg-[#1B7F4B] selection:text-white">
      
      {/* ================= NAVIGATION BAR ================= */}
      <nav className="fixed w-full top-0 z-50 bg-[#0B1F2C]/95 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo and University Name */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full p-0.5 shadow-lg border border-white/20 flex items-center justify-center overflow-hidden">
                <img 
                  src={inuLogo.src} 
                  alt="Injibara University Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg leading-tight tracking-wide">INJIBARA UNIVERSITY</h1>
                <p className="text-[#D4AF37] text-xs font-medium">Student Registration & Enrollment System</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Features</a>
              <a href="#announcements" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Announcements</a>
              <a href="#support" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Support</a>
              
              <div className="flex items-center gap-4 ml-4">
                <Link href="/login" className="text-white hover:text-[#D4AF37] text-sm font-semibold transition-colors px-4 py-2">
                  Sign In
                </Link>
                <Link href="/register" className="bg-[#1B7F4B] hover:bg-[#15663C] text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
                  Register Now
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0B1F2C] border-t border-white/10 px-4 pt-2 pb-6 space-y-4 shadow-xl">
            <a href="#features" className="block text-gray-300 hover:text-white py-2 text-base font-medium">Features</a>
            <a href="#announcements" className="block text-gray-300 hover:text-white py-2 text-base font-medium">Announcements</a>
            <a href="#support" className="block text-gray-300 hover:text-white py-2 text-base font-medium">Support</a>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <Link href="/login" className="w-full text-center text-white border border-white/20 hover:bg-white/5 font-semibold py-3 rounded-lg transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="w-full text-center bg-[#1B7F4B] hover:bg-[#15663C] text-white font-bold py-3 rounded-lg transition-colors shadow-md">
                Register Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0B1F2C]">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#1B7F4B]/20 rounded-full blur-3xl mix-blend-screen"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl mix-blend-screen"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-[#0B1F2C] to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-[#D4AF37] font-medium backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                Academic Year 2024/2025 Open
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
                Welcome to Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F8E7A1]">
                  Academic World
                </span>
              </h1>
              
              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                Register for courses, view your dormitory allocation, check grades, and manage your academic journey seamlessly in one centralized portal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/register" className="inline-flex justify-center items-center gap-2 bg-[#1B7F4B] hover:bg-[#15663C] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 text-lg">
                  Get Started
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </Link>
                <Link href="/login" className="inline-flex justify-center items-center gap-2 bg-transparent hover:bg-white/5 text-white border-2 border-white/20 font-bold py-4 px-8 rounded-xl transition-all duration-300 active:scale-95 text-lg">
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right Content - Visual Mockup */}
            <div className="relative lg:ml-10 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#112A3A]">
                {/* Mockup Header */}
                <div className="bg-[#0B1F2C] px-4 py-3 border-b border-white/10 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-xs text-gray-400 font-mono">portal.inu.edu.et/dashboard</div>
                </div>
                {/* Mockup Body */}
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg">Student Dashboard</h3>
                      <p className="text-gray-400 text-sm">Welcome back, Hana</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                      HT
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-[#1B7F4B]/20 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-[#1B7F4B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                      </div>
                      <h4 className="text-white font-semibold text-sm">Course Registration</h4>
                      <p className="text-gray-400 text-xs mt-1">Register for Semester II</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <h4 className="text-white font-semibold text-sm">Grades</h4>
                      <p className="text-gray-400 text-xs mt-1">View your results</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                      </div>
                      <h4 className="text-white font-semibold text-sm">Dormitory</h4>
                      <p className="text-gray-400 text-xs mt-1">Check allocation</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <h4 className="text-white font-semibold text-sm">Payments</h4>
                      <p className="text-gray-400 text-xs mt-1">Make a payment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F2C] mb-4">Everything You Need in One Place</h2>
            <p className="text-gray-600 text-lg">The Injibara University Student Portal provides a comprehensive suite of tools to manage your entire academic lifecycle.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
              <div className="w-14 h-14 rounded-xl bg-[#1B7F4B]/10 flex items-center justify-center mb-6 group-hover:bg-[#1B7F4B] transition-colors duration-300">
                <svg className="w-7 h-7 text-[#1B7F4B] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#0B1F2C] mb-3">Course Registration</h3>
              <p className="text-gray-600 leading-relaxed">Easily browse available courses, register for your semester, and manage your class schedule without any paperwork.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
              <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] transition-colors duration-300">
                <svg className="w-7 h-7 text-[#D4AF37] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#0B1F2C] mb-3">Grades & Transcripts</h3>
              <p className="text-gray-600 leading-relaxed">View your official grades, track your GPA, and request transcripts directly from the portal securely.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-300">
                <svg className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#0B1F2C] mb-3">Dormitory Allocation</h3>
              <p className="text-gray-600 leading-relaxed">Check your dormitory assignment, view room details, and manage your campus housing preferences.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= ANNOUNCEMENTS SECTION ================= */}
      <section id="announcements" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F2C] mb-6">Latest Announcements</h2>
              <p className="text-gray-600 text-lg mb-8">Stay updated with the latest news and important dates from the registrar's office.</p>
              
              <div className="space-y-4">
                <div className="bg-[#F8F7F4] border-l-4 border-[#1B7F4B] p-5 rounded-r-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#0B1F2C]">Registration for Semester II is now open</h3>
                    <span className="text-xs font-semibold text-[#1B7F4B] bg-[#1B7F4B]/10 px-2 py-1 rounded">New</span>
                  </div>
                  <p className="text-gray-600 text-sm">All students are required to complete their course registration before the deadline on Friday.</p>
                </div>
                
                <div className="bg-[#F8F7F4] border-l-4 border-[#D4AF37] p-5 rounded-r-xl shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-[#0B1F2C]">Check your dormitory allocation</h3>
                  <p className="text-gray-600 text-sm mt-1">Dormitory assignments for the new academic year have been published. Please check your portal.</p>
                </div>
                
                <div className="bg-[#F8F7F4] border-l-4 border-blue-500 p-5 rounded-r-xl shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-[#0B1F2C]">Library services updated</h3>
                  <p className="text-gray-600 text-sm mt-1">New digital resources and extended opening hours are now available for all students.</p>
                </div>
              </div>
            </div>

            {/* Right side visual for announcements */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1B7F4B] to-[#0B1F2C] rounded-3xl transform rotate-3 scale-105 opacity-10"></div>
              <div className="relative bg-[#0B1F2C] rounded-3xl p-8 shadow-2xl text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl"></div>
                <h3 className="text-2xl font-bold mb-6 relative z-10">Need Help?</h3>
                <p className="text-gray-300 mb-8 relative z-10">Our ICT support team is available to assist you with any technical issues.</p>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-[#1B7F4B]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#1B7F4B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Call Support</p>
                      <p className="font-semibold">+251 911 234567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email Support</p>
                      <p className="font-semibold">ictsupport@inu.edu.et</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="support" className="bg-[#0B1F2C] text-white pt-16 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-full p-0.5 flex items-center justify-center overflow-hidden">
                  <img src={inuLogo.src} alt="INU Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">INJIBARA UNIVERSITY</h3>
                  <p className="text-[#D4AF37] text-xs">ኢንጅባራ ዩኒቨርሲቲ</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                The official student registration and enrollment system for Injibara University. Access your academic records, register for courses, and manage your campus life.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/login" className="hover:text-[#D4AF37] transition-colors">Student Login</Link></li>
                <li><Link href="/register" className="hover:text-[#D4AF37] transition-colors">New Registration</Link></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Academic Calendar</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Library Services</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1B7F4B] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>Injibara, Ethiopia</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1B7F4B] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <span>+251 911 234567</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1B7F4B] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span>ictsupport@inu.edu.et</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2024 Injibara University. All rights reserved.</p>
            <p>Powered by <span className="text-gray-300 font-medium">IU ICT Center</span></p>
          </div>
        </div>
      </footer>

    </div>
  );
}