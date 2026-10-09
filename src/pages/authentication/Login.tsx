import React, { useState } from "react";
import { Button, Checkbox, ConfigProvider, Form, FormProps, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthSidebar from "../../components/ui/AuthSidebar";
import { useLoginMutation } from "../../redux/apiSlices/authSlice";
import { toast } from "sonner";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Users,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

export type errorType = {
  data: {
    errorMessages: { message: string }[];
    message: string;
  };
};

interface LoginFormValues {
  role: string;
  email: string;
  password?: string;
  remember?: boolean;
}

const ROLES = [
  {
    id: "student",
    label: "Student",
    desc: "Learning Portal",
    icon: GraduationCap,
  },
  {
    id: "mentor",
    label: "Mentor",
    desc: "Student Guidance",
    icon: Sparkles,
  },
  {
    id: "teacher",
    label: "Teacher",
    desc: "Class Resources",
    icon: BookOpen,
  },
  {
    id: "mentor-coordinator",
    label: "Coordinator",
    desc: "Group Management",
    icon: Users,
  },
  {
    id: "admin",
    label: "Admin",
    desc: "Platform Overview",
    icon: ShieldCheck,
  },
];

interface RoleSelectorProps {
  value?: string;
  onChange?: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {ROLES.map((r, index) => {
        const isSelected = value === r.id;
        const IconComponent = r.icon;
        const isLast = index === 4;

        return (
          <button
            type="button"
            key={r.id}
            onClick={() => onChange?.(r.id)}
            className={`group relative flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all duration-200 select-none cursor-pointer ${
              isLast ? "col-span-2 sm:col-span-1" : ""
            } ${
              isSelected
                ? "bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs"
                : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700 shadow-2xs"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                isSelected
                  ? "bg-emerald-500 text-white shadow-2xs scale-105"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
              }`}
            >
              <IconComponent className="w-4 h-4" />
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-xs sm:text-sm font-bold truncate leading-tight">
                {r.label}
              </span>
              <span className="block text-[10px] text-slate-400 group-hover:text-slate-500 truncate leading-tight mt-0.5">
                {r.desc}
              </span>
            </div>

            {isSelected && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            )}
          </button>
        );
      })}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [form] = Form.useForm();
  const [hiddenForget, setHiddenForget] = useState(false);

  const onFinish: FormProps<LoginFormValues>["onFinish"] = async (values) => {
    try {
      toast.promise(login(values).unwrap(), {
        loading: "Signing in...",
        success: (res) => {
          localStorage.setItem("token", res?.data?.accessToken);
          localStorage.setItem("role", res?.data?.role);
          const role = res?.data?.role?.toLowerCase();
          let routeRole = role;
          if (role === "super_admin") {
            routeRole = "admin";
          } else if (role === "coordinator") {
            routeRole = "mentor-coordinator";
          }
          navigate(`/${routeRole}/overview`);
          return res.message || "Login successful";
        },
        error: async (err) => {
          const message =
            err?.data?.message ||
            err?.data?.errorMessages?.[0]?.message ||
            "Login failed";
          return message;
        },
      });
    } catch (error) {
      const err = error as errorType;
      console.log(err?.data?.errorMessages?.[0]?.message);
    }
  };

  const handleValuesChange = (changedValues: any) => {
    if (changedValues.role === "mentor") {
      setHiddenForget(true);
    } else if (changedValues.role) {
      setHiddenForget(false);
    }
  };

  return (
    <section className="min-h-screen grid lg:grid-cols-2 bg-slate-50 antialiased">
      <AuthSidebar backgroundImage="/assets/images/auth/login.jpg" />

      {/* Right Side: Login Form */}
      <div className="min-h-screen flex items-center justify-center p-6 sm:p-10 relative">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#66D978",
              colorBgContainer: "#fff",
              borderRadius: 14,
            },
            components: {
              Input: {
                controlHeight: 50,
                colorBorder: "#E2E8F0",
                borderRadius: 12,
              },
              Button: {
                controlHeight: 52,
                borderRadius: 12,
              },
            },
          }}
        >
          <div className="bg-white/95 backdrop-blur-xl w-full max-w-[540px] rounded-3xl border border-slate-200/80 shadow-2xl p-7 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#11998e] via-[#10b981] to-[#059669] shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-100/80 mb-3.5 p-2.5 transition-transform hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Share Network Logo"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl text-slate-900 font-extrabold tracking-tight">
                Welcome Back
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Select your portal role and sign in to continue
              </p>
            </div>

            <Form
              form={form}
              name="normal_login"
              className="login-form space-y-4"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onValuesChange={handleValuesChange}
              requiredMark={false}
            >
              {/* Role Selection Grid */}
              <Form.Item
                label={
                  <span className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                    Select Portal Role
                  </span>
                }
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please select a role to sign in",
                  },
                ]}
                className="mb-5"
              >
                <RoleSelector />
              </Form.Item>

              {/* Email */}
              <Form.Item
                label={
                  <span className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                    Email Address
                  </span>
                }
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input
                  prefix={
                    <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  }
                  placeholder="name@share-network.org"
                  type="email"
                  className="rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500"
                />
              </Form.Item>

              {/* Password */}
              <Form.Item
                label={
                  <span className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                    Password
                  </span>
                }
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  prefix={
                    <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  }
                  placeholder="Enter your password"
                  className="rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500"
                />
              </Form.Item>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1 pb-2">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-slate-500 text-xs sm:text-sm font-medium">
                    Remember Me
                  </Checkbox>
                </Form.Item>

                {!hiddenForget && (
                  <Link
                    to="/forget-password"
                    className="text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>

              {/* Submit Button */}
              <Form.Item className="mb-4 pt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  icon={<ArrowRight className="w-4 h-4 mr-1 inline-block" />}
                  className="h-[52px] text-base font-bold bg-[#66D978] hover:bg-[#58C469] border-none shadow-md shadow-emerald-200/60 text-slate-900 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Sign In
                </Button>
              </Form.Item>

              {/* Sign Up Link */}
              <div className="text-center text-slate-500 text-xs sm:text-sm pt-2">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            </Form>
          </div>
        </ConfigProvider>
      </div>
    </section>
  );
};

export default Login;
