import { useState } from "react";
import { Button, Avatar } from "antd";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Laptop,
  Linkedin,
  Github,
  Globe,
  Edit3,
  CheckCircle2,
  XCircle,
  Sparkles,
  Users,
  FileText,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";
import EditProfile from "./components/EditProfile";
import { useProfileQuery as useGetProfileQuery } from "../../../redux/apiSlices/authSlice";
import Spinner from "../../../components/shared/Spinner";
import { getImageUrl } from "../../../utils/getImageUrl";

export default function MentorCoordinatorProfile() {
  const { data, isLoading, refetch } = useGetProfileQuery({});
  const user = data?.data?.data ?? data?.data ?? data;
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  const roleName = (user?.role || "").trim().toUpperCase();
  const isStudent = roleName === "STUDENT";
  const isCoordinator = roleName === "COORDINATOR";
  const isMentor = roleName === "MENTOR";

  if (isEditing) {
    return (
      <div className="max-w-6xl mx-auto py-4">
        <EditProfile
          user={user}
          onCancel={() => setIsEditing(false)}
          refetch={refetch}
        />
      </div>
    );
  }

  const displayName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Anonymous User";

  // Parse Address
  const getParsedAddress = () => {
    let city = user?.city || "";
    let streetAddress = user?.streetAddress || "";
    let zipCode = user?.zipCode || "";

    if (user?.address) {
      const addressStr = user.address;
      if (typeof addressStr === "string" && addressStr.startsWith("{")) {
        try {
          const parsed = JSON.parse(addressStr);
          city = parsed.city || city;
          streetAddress = parsed.streetAddress || streetAddress;
          zipCode = parsed.zipCode || zipCode;
        } catch {
          // ignore
        }
      } else if (typeof addressStr === "string" && addressStr.includes(",")) {
        const parts = addressStr.split(",").map((s: string) => s.trim());
        if (!city && parts[0]) city = parts[0];
        if (!streetAddress && parts.length > 1)
          streetAddress = parts.slice(1).join(", ");
      } else if (typeof addressStr === "string") {
        if (!streetAddress) streetAddress = addressStr;
      }
    }
    return { city, streetAddress, zipCode };
  };

  const { city, streetAddress, zipCode } = getParsedAddress();
  const fullAddress =
    [streetAddress, city, zipCode].filter(Boolean).join(", ") ||
    "Address not provided";

  // Parse Career Directions (Student only)
  const getCareerDirectionsList = (): string[] => {
    if (!user?.careerDirections) return [];
    if (Array.isArray(user.careerDirections)) {
      return user.careerDirections;
    }
    if (typeof user.careerDirections === "string") {
      if (user.careerDirections.startsWith("[")) {
        try {
          const parsed = JSON.parse(user.careerDirections);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          // ignore
        }
      }
      return user.careerDirections
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const careerDirectionsList = getCareerDirectionsList();

  // Has Laptop status (Student only)
  const hasLaptopValue =
    user?.havealaptop === true ||
    user?.havealaptop === "true" ||
    user?.havealaptop === "Yes"
      ? "Yes"
      : user?.havealaptop === false ||
          user?.havealaptop === "false" ||
          user?.havealaptop === "No"
        ? "No"
        : null;

  // Role display configuration
  const getRoleBadge = () => {
    if (isStudent) {
      return {
        label: "Student",
        icon: <GraduationCap className="w-3.5 h-3.5" />,
        className: "bg-emerald-500/15 text-emerald-700 border-emerald-200/80",
      };
    }
    if (isMentor) {
      return {
        label: "Mentor",
        icon: <Sparkles className="w-3.5 h-3.5" />,
        className: "bg-indigo-500/15 text-indigo-700 border-indigo-200/80",
      };
    }
    if (isCoordinator) {
      return {
        label: "Coordinator",
        icon: <ShieldCheck className="w-3.5 h-3.5" />,
        className: "bg-sky-500/15 text-sky-700 border-sky-200/80",
      };
    }
    return {
      label: user?.role || "Member",
      icon: <User className="w-3.5 h-3.5" />,
      className: "bg-gray-100 text-gray-700 border-gray-200",
    };
  };

  const roleBadge = getRoleBadge();
  const groupName = user?.userGroup?.[0]?.name;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Hero / Profile Header Card */}
      <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 rounded-3xl p-6 sm:p-9 text-white shadow-sm border border-emerald-900/10 overflow-hidden">
        {/* Subtle Ambient Decorative Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-16 w-64 h-64 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar + Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left">
            {/* Avatar */}
            <div className=" overflow-hidden">
              <Avatar
                shape="square"
                size={110}
                src={getImageUrl(user?.profile)}
                className="rounded-3xl object-cover bg-white/20 backdrop-blur-md shrink-0"
              />
            </div>

            {/* Name, Badges & Titles */}
            <div className="space-y-2">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-2xs">
                  {roleBadge.icon}
                  <span>{roleBadge.label}</span>
                </span>
                {groupName && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/40 backdrop-blur-md text-emerald-100 border border-white/15">
                    <Users className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{groupName}</span>
                  </span>
                )}
              </div>

              {/* User Display Name */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                {displayName}
              </h1>

              {/* Professional Title */}
              {user?.professionalTitle && (
                <p className="text-emerald-100 font-medium text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-300" />
                  <span>{user.professionalTitle}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right: Action Button */}
          {!isCoordinator && (
            <div className="self-center lg:self-auto shrink-0">
              <Button
                type="primary"
                icon={<Edit3 className="w-4 h-4 mr-1 inline-block" />}
                onClick={() => setIsEditing(true)}
                className="h-11 px-7 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 bg-[#66D978] hover:bg-[#58c769] border-none text-slate-900 text-sm"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>

        {/* Quick Contact Info Strip */}
        <div className="mt-7 pt-5 border-t border-white/15 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 relative z-10 text-xs sm:text-sm">
          {user?.email && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-white">
              <Mail className="w-3.5 h-3.5 text-emerald-300" />
              <span>{user.email}</span>
            </span>
          )}
          {(user?.contactNumber || user?.mobileNumber) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-white">
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>{user?.contactNumber || user?.mobileNumber}</span>
            </span>
          )}
          {city && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-white">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>{city}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols on lg): Bio & Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Me Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">About Me</h2>
                <p className="text-xs text-slate-400">
                  Personal bio and background
                </p>
              </div>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100">
              {user?.aboutMe || user?.about ? (
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {user?.aboutMe || user?.about}
                </p>
              ) : (
                <p className="text-slate-400 text-sm italic py-2">
                  No bio available yet. Click &apos;Edit Profile&apos; to share
                  your story, expertise, and interests.
                </p>
              )}
            </div>
          </div>

          {/* General / Personal Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-semibold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  General Information
                </h2>
                <p className="text-xs text-slate-400">
                  Personal & academic credentials
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-900">
                  {displayName}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-900 truncate block">
                  {user?.email || "N/A"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Gender
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-900">
                  {user?.gender || "Not specified"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Highest Education
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-900">
                  {user?.highestEducation || "N/A"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Contact Phone
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-900">
                  {user?.contactNumber || user?.mobileNumber || "N/A"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Assigned Group
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-900">
                  {groupName || "Not assigned yet"}
                </span>
              </div>
            </div>
          </div>

          {/* STUDENT ONLY SECTION: Laptop Availability & Career Directions */}
          {isStudent && (
            <div className="bg-white rounded-3xl border border-emerald-200/80 shadow-sm p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full pointer-events-none -z-0" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-semibold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        Student Learning & Career Directions
                      </h2>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                        Student Only
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Equipment status and targeted career pathways
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Has Laptop Status */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200/60 flex items-center justify-center text-slate-700">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                          Laptop Availability
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          Do you own or have access to a personal laptop?
                        </span>
                      </div>
                    </div>

                    <div>
                      {hasLaptopValue === "Yes" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Yes, Has Laptop
                        </span>
                      ) : hasLaptopValue === "No" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-xs sm:text-sm">
                          <XCircle className="w-4 h-4 text-amber-600" />
                          No Laptop
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 px-3 py-1 rounded-full bg-slate-100">
                          Not Specified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Career Directions */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                        Career Directions & Goals
                      </span>
                      <span className="text-xs font-semibold text-emerald-700">
                        {careerDirectionsList.length} Selected
                      </span>
                    </div>

                    {careerDirectionsList.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {careerDirectionsList.map((direction, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-emerald-200/80 text-emerald-900 font-semibold text-xs sm:text-sm shadow-2xs hover:border-emerald-300 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                            {direction}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">
                        No career directions selected yet. Edit your profile to
                        pick your target tech pathways!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col on lg): Address & Social Links */}
        <div className="space-y-6">
          {/* Address Information Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Address</h2>
                <p className="text-xs text-slate-400">Residential details</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Street Address
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {streetAddress || "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    City
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {city || "N/A"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Zip Code
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {zipCode || "N/A"}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>{fullAddress}</span>
              </div>
            </div>
          </div>

          {/* Social & Professional Links Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-semibold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Links & Socials
                </h2>
                <p className="text-xs text-slate-400">
                  Professional online presence
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* LinkedIn */}
              {user?.linkedInProfile ? (
                <a
                  href={
                    user.linkedInProfile.startsWith("http")
                      ? user.linkedInProfile
                      : `https://${user.linkedInProfile}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 block">
                        LinkedIn
                      </span>
                      <span className="text-xs text-slate-500 truncate block group-hover:text-blue-600 transition-colors">
                        {user.linkedInProfile}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 ml-2" />
                </a>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">
                      LinkedIn not linked
                    </span>
                  </div>
                </div>
              )}

              {/* GitHub */}
              {user?.githubProfile ? (
                <a
                  href={
                    user.githubProfile.startsWith("http")
                      ? user.githubProfile
                      : `https://${user.githubProfile}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-300 hover:bg-slate-100/60 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Github className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 block">
                        GitHub
                      </span>
                      <span className="text-xs text-slate-500 truncate block group-hover:text-slate-900 transition-colors">
                        {user.githubProfile}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 shrink-0 ml-2" />
                </a>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center">
                      <Github className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">
                      GitHub not linked
                    </span>
                  </div>
                </div>
              )}

              {/* Portfolio Website */}
              {user?.PortfolioWebsite || user?.portfolioWebsite ? (
                <a
                  href={
                    (user.PortfolioWebsite || user.portfolioWebsite).startsWith(
                      "http",
                    )
                      ? user.PortfolioWebsite || user.portfolioWebsite
                      : `https://${user.PortfolioWebsite || user.portfolioWebsite}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 block">
                        Portfolio
                      </span>
                      <span className="text-xs text-slate-500 truncate block group-hover:text-emerald-600 transition-colors">
                        {user.PortfolioWebsite || user.portfolioWebsite}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2" />
                </a>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">
                      Portfolio not linked
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
