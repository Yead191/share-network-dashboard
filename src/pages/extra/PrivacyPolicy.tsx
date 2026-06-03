
import { HiArrowLeft, HiShieldCheck } from "react-icons/hi";
import { HiOutlineEye, HiOutlineLockClosed, HiOutlineUserGroup, HiOutlineServer, HiOutlineRefresh, HiOutlineMail } from "react-icons/hi";
import { Link } from "react-router-dom";

const sections = [
    {
        id: "information-we-collect",
        icon: <HiOutlineEye className="w-5 h-5" />,
        title: "Information We Collect",
        content: [
            {
                subtitle: "Account Information",
                text: "When you register on Share Network, we collect your full name, email address, role (Admin, Teacher, Mentor, Mentor Coordinator, or Student), profile photo, and institutional affiliation. This information is essential to provide you with a personalized and role-appropriate experience.",
            },
            {
                subtitle: "Usage Data",
                text: "We automatically collect data about how you interact with our platform — including pages visited, content accessed, session duration, device type, browser type, and IP address. This helps us improve platform performance and your learning experience.",
            },
            {
                subtitle: "Educational Content",
                text: "Assignments, submissions, messages, feedback, and any content you create or share on the platform are collected and stored to facilitate the educational process and maintain an accurate record of academic activity.",
            },
        ],
    },
    {
        id: "how-we-use",
        icon: <HiOutlineServer className="w-5 h-5" />,
        title: "How We Use Your Information",
        content: [
            {
                subtitle: "Platform Functionality",
                text: "Your data powers the core features of Share Network — connecting students with mentors and teachers, facilitating content sharing, enabling communication between roles, and ensuring each user has access to their appropriate dashboard and tools.",
            },
            {
                subtitle: "Personalization & Analytics",
                text: "We use aggregated and anonymized data to understand learning patterns, improve our recommendation systems, and enhance the overall platform experience. Individual data is never sold to third parties.",
            },
            {
                subtitle: "Communications",
                text: "We may send you important notifications regarding your account, platform updates, educational milestones, or administrative messages. You can manage your notification preferences from your account settings.",
            },
        ],
    },
    {
        id: "user-roles",
        icon: <HiOutlineUserGroup className="w-5 h-5" />,
        title: "Data Access by Role",
        content: [
            {
                subtitle: "Admins",
                text: "Administrators have access to platform-wide data for management and oversight purposes. This includes user accounts, content moderation tools, and analytics dashboards. Admin activity is logged and audited.",
            },
            {
                subtitle: "Teachers & Mentors",
                text: "Teachers and Mentors can view the profiles and academic activity of students assigned to them. Access is strictly scoped — a teacher cannot view students outside their assigned cohorts.",
            },
            {
                subtitle: "Mentor Coordinators",
                text: "Mentor Coordinators oversee mentor-student pairings and can view assignment data and progress reports within their purview. They do not have access to private messages between mentors and students.",
            },
            {
                subtitle: "Students",
                text: "Students can view and edit their own profiles, access their submitted work, and see feedback provided by their teachers and mentors. Students cannot view other students' private data.",
            },
        ],
    },
    {
        id: "data-security",
        icon: <HiOutlineLockClosed className="w-5 h-5" />,
        title: "Data Security",
        content: [
            {
                subtitle: "Encryption & Storage",
                text: "All data transmitted on Share Network is encrypted using TLS 1.3. Data at rest is encrypted using AES-256 industry-standard encryption. Our servers are hosted in secure, certified data centers with restricted physical and digital access.",
            },
            {
                subtitle: "Access Controls",
                text: "We employ strict role-based access controls (RBAC) to ensure users only access data appropriate to their role. All sensitive operations are authenticated and logged for security audits.",
            },
        ],
    },
    {
        id: "your-rights",
        icon: <HiOutlineRefresh className="w-5 h-5" />,
        title: "Your Rights",
        content: [
            {
                subtitle: "Access & Correction",
                text: "You have the right to access your personal data at any time through your account settings. You may also request corrections to inaccurate or incomplete data. We will process such requests within 14 business days.",
            },
            {
                subtitle: "Data Deletion",
                text: "You may request the deletion of your account and associated personal data. Note that academic records tied to institutional requirements may be retained for a period defined by your institution's policy, even after account deletion.",
            },
            {
                subtitle: "Data Portability",
                text: "You can export a copy of your personal data in a machine-readable format. This includes your profile information, submitted content, and activity history from the platform.",
            },
        ],
    },
    {
        id: "contact",
        icon: <HiOutlineMail className="w-5 h-5" />,
        title: "Contact Us",
        content: [
            {
                subtitle: "Privacy Inquiries",
                text: "If you have any questions, concerns, or requests related to this Privacy Policy or the handling of your personal data, please reach out to our dedicated privacy team at privacy@sharenetwork.edu. We aim to respond to all inquiries within 5 business days.",
            },
            {
                subtitle: "Policy Updates",
                text: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a prominent notice on the platform. Continued use of Share Network after such updates constitutes your acceptance of the revised policy.",
            },
        ],
    },
];

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#F7FDF9] font-sans">
            {/* Decorative background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#66D978]/10" />
                <div className="absolute top-1/2 -left-60 w-[500px] h-[500px] rounded-full bg-[#66D978]/8" />
                <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] rounded-full bg-[#66D978]/6" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

                {/* Back to Login */}
                <div className="mb-10">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#66D978] transition-colors duration-200 group"
                    >
                        <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-[#66D978] group-hover:bg-[#66D978]/5 transition-all duration-200">
                            <HiArrowLeft className="w-4 h-4" />
                        </span>
                        Back to Login
                    </Link>
                </div>

                {/* Hero Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#66D978] flex items-center justify-center shadow-lg shadow-[#66D978]/30">
                            <HiShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-[#66D978] tracking-widest uppercase">Share Network</span>
                    </div>

                    <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
                        Privacy <span className="text-[#66D978]">Policy</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                        We believe privacy is a right, not a feature. Here's a transparent, plain-language explanation of how Share Network handles your data across all roles on our educational platform.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-8">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-[#66D978]" />
                            Effective: January 1, 2025
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-[#66D978]" />
                            Last Updated: May 2026
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-[#66D978]" />
                            Version 2.1
                        </span>
                    </div>
                </div>

                {/* Quick summary card */}
                <div className="mb-16 rounded-3xl bg-[#66D978] p-8 text-white shadow-xl shadow-[#66D978]/25 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-20 w-32 h-32 rounded-full bg-white/10 translate-y-1/2" />
                    <div className="relative z-10">
                        <p className="text-sm font-bold uppercase tracking-widest mb-3 text-white/70">TL;DR — The Short Version</p>
                        <p className="text-xl font-semibold leading-relaxed max-w-2xl">
                            We collect only what's needed to run Share Network. We never sell your data. Access is role-based and strictly controlled. You have full rights over your information.
                        </p>
                    </div>
                </div>

                {/* Policy Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            id={section.id}
                            className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                        >
                            {/* Section Header */}
                            <div className="flex items-center gap-4 px-8 py-6 border-b border-gray-50">
                                <div className="w-10 h-10 rounded-2xl bg-[#66D978]/10 text-[#66D978] flex items-center justify-center flex-shrink-0">
                                    {section.icon}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-300 tabular-nums">0{index + 1}</span>
                                    <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                                </div>
                            </div>

                            {/* Section Content */}
                            <div className="px-8 py-6 space-y-6">
                                {section.content.map((item) => (
                                    <div key={item.subtitle} className="flex gap-5">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#66D978] mt-2" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">{item.subtitle}</h3>
                                            <p className="text-gray-500 leading-relaxed text-[15px]">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-16 pt-10 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-sm text-gray-400">
                            © 2026 Share Network. All rights reserved.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            This policy applies to all users across Admin, Teacher, Mentor, Mentor Coordinator, and Student roles.
                        </p>
                    </div>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#66D978] text-white text-sm font-semibold hover:bg-[#52c965] transition-colors duration-200 shadow-lg shadow-[#66D978]/30 flex-shrink-0"
                    >
                        <HiArrowLeft className="w-4 h-4" />
                        Return to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}