import { HiArrowLeft, HiOutlineTrash, HiOutlineUser, HiOutlineCog, HiOutlineShieldCheck, HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const deleteSteps = [
    {
        step: 1,
        title: "Navigate to Profile",
        action: "Tap the 'Profile' icon in the bottom navigation bar.",
        description: "From your main dashboard, locate the bottom navigation bar. Click on the 'Profile' icon at the bottom right corner to open your profile overview screen.",
        image: "/assets/images/delete-account/step1.png",
        badgeColor: "bg-[#66D978]/10 text-[#66D978]",
        icon: <HiOutlineUser className="w-5 h-5" />,
    },
    {
        step: 2,
        title: "Access Account Settings",
        action: "Scroll down to view settings options on your profile screen.",
        description: "Once on the Profile page, you will see your academic stats and personal information. Scroll down past the personal information links to access the Settings list.",
        image: "/assets/images/delete-account/step2.png",
        badgeColor: "bg-[#66D978]/10 text-[#66D978]",
        icon: <HiOutlineCog className="w-5 h-5" />,
    },
    {
        step: 3,
        title: "Select 'Delete Account'",
        action: "Find and tap the 'Delete Account' option.",
        description: "In the Settings list, locate the 'Delete Account' option. It is highlighted with a red trash/logout style indicator for easy recognition. Tap it to proceed.",
        image: "/assets/images/delete-account/step3.png",
        badgeColor: "bg-red-50 text-red-500",
        icon: <HiOutlineTrash className="w-5 h-5" />,
    },
    {
        step: 4,
        title: "Confirm Your Password",
        action: "Read the warning, enter your password, and confirm.",
        description: "A secure confirmation screen will appear detailing that this action is permanent. Enter your password to authenticate ownership and click the red 'Delete Account' button.",
        image: "/assets/images/delete-account/step4.png",
        badgeColor: "bg-red-50 text-red-500",
        icon: <HiOutlineExclamationCircle className="w-5 h-5" />,
    },
    {
        step: 5,
        title: "Successful Deletion",
        action: "You will be automatically signed out.",
        description: "Once processed, all account data is permanently wiped from the database. You will be redirected back to the Sign In page of Share Network.",
        image: "/assets/images/delete-account/step5.png",
        badgeColor: "bg-[#66D978]/10 text-[#66D978]",
        icon: <HiOutlineShieldCheck className="w-5 h-5" />,
    },
];

export default function HowToDelete() {
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
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <HiOutlineTrash className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-red-500 tracking-widest uppercase">Account Security</span>
                    </div>

                    <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4 font-sans">
                        How to Delete <span className="text-red-500">Account</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                        A step-by-step guide to permanently removing your account and all associated personal data from the Share Network platform.
                    </p>
                </div>

                {/* Warning Callout Box */}
                <div className="mb-16 rounded-3xl bg-red-500 p-8 text-white shadow-xl shadow-red-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-20 w-32 h-32 rounded-full bg-white/10 translate-y-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            <HiOutlineExclamationCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest mb-1 text-red-100">Critical Warning</p>
                            <p className="text-lg font-medium leading-relaxed max-w-2xl">
                                Account deletion is irreversible. Once confirmed, your profile, active courses, mentor matches, and submissions will be permanently wiped.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step-by-Step Guide */}
                <div className="space-y-12">
                    {deleteSteps?.map((stepData) => (
                        <div
                            key={stepData.step}
                            className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 p-8 md:p-10"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                {/* Text Information */}
                                <div className="lg:col-span-7 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-2xl ${stepData.badgeColor} flex items-center justify-center flex-shrink-0 font-bold`}>
                                            {stepData.icon}
                                        </div>
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Step 0{stepData.step}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{stepData.title}</h2>
                                    <p className="text-sm font-semibold text-[#66D978] bg-[#66D978]/5 px-3 py-1.5 rounded-lg inline-block">
                                        {stepData.action}
                                    </p>
                                    <p className="text-gray-500 leading-relaxed text-[15px]">
                                        {stepData.description}
                                    </p>
                                </div>

                                {/* Screenshot Display */}
                                <div className="lg:col-span-5 flex justify-center">
                                    <div className="relative group/image max-w-[240px] w-full">
                                        {/* Subtle colored glow behind image */}
                                        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#66D978]/20 to-emerald-500/20 rounded-[2.5rem] blur opacity-40 group-hover/image:opacity-75 transition duration-500" />

                                        {/* Phone screen frame mock */}
                                        <div className="relative bg-gray-950 p-2.5 rounded-[2.5rem] shadow-2xl border-4 border-gray-800">
                                            {/* <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                                                <div className="w-3 h-3 rounded-full bg-gray-800" />
                                            </div> */}
                                            <div className="rounded-[1.8rem] overflow-hidden bg-white border border-gray-100 relative">
                                                <img
                                                    src={stepData.image}
                                                    alt={`Step ${stepData.step}: ${stepData.title}`}
                                                    className="w-full h-auto object-cover select-none pointer-events-none group-hover/image:scale-[1.02] transition-transform duration-300"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Customer Support Info Section */}
                <div className="mt-16 rounded-3xl bg-white border border-gray-100 shadow-sm p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#66D978]/5 -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-2 h-6 rounded-full bg-[#66D978]" />
                            <h2 className="text-xl font-bold text-gray-900">Need Assistance? Contact Customer Support</h2>
                        </div>
                        <p className="text-gray-500 text-sm mb-8 max-w-xl">
                            If you are having trouble deleting your account, need help backing up your data, or have general questions about how we handle user data, please feel free to reach out to our team.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Organization Card */}
                            <div className="bg-[#F7FDF9] rounded-2xl p-5 border border-[#66D978]/10 hover:border-[#66D978]/30 transition-all duration-200">
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Organization</div>
                                <div className="font-semibold text-gray-800 text-[15px]">Share Network</div>
                                {/* <div className="text-gray-500 text-xs mt-0.5">(Share Network)</div> */}
                            </div>

                            {/* Phone Card */}
                            <div className="bg-[#F7FDF9] rounded-2xl p-5 border border-[#66D978]/10 hover:border-[#66D978]/30 transition-all duration-200">
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Phone Support</div>
                                <a
                                    href="tel:+310611793588"
                                    className="font-semibold text-[#66D978] hover:text-[#52c965] transition-colors text-[15px] block"
                                >
                                    +31(0)611793588
                                </a>
                                <div className="text-gray-500 text-xs mt-0.5">Available Mon - Fri, 9am - 5pm</div>
                            </div>

                            {/* Email Card */}
                            <div className="bg-[#F7FDF9] rounded-2xl p-5 border border-[#66D978]/10 hover:border-[#66D978]/30 transition-all duration-200">
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Email Support</div>
                                <a
                                    href="mailto:info@share-network.org"
                                    className="font-semibold text-[#66D978] hover:text-[#52c965] transition-colors text-[15px] block"
                                >
                                    info@share-network.org
                                </a>
                                <div className="text-gray-500 text-xs mt-0.5">Response within 24 hours</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer section */}
                <div className="mt-16 pt-10 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-sm text-gray-400">
                            © 2026 Share Network. All rights reserved.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            If you experience any difficulties deleting your account, contact support at info@share-network.org.
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
