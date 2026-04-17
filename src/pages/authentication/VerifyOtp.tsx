import { Button, ConfigProvider, Form, FormProps, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFromLocalStorage } from '../../utils/local-storage';
import AuthSidebar from '../../components/ui/AuthSidebar';
import { useOtpVerifyMutation, useResendOtpMutation } from '../../redux/apiSlices/authSlice';
import { toast } from 'sonner';

export type errorType = {
    data: {
        errorMessages: { message: string }[];
        message: string;
    };
};
interface VerifyOtpFormValues {
    otp: string;
}

const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [verifyOtp] = useOtpVerifyMutation();
    const [resendOtp] = useResendOtpMutation();

    // Get flow and email from state (preferred) or local storage (fallback for forget password)
    const flow = location.state?.flow || 'forget-password';
    const email = location.state?.email || getFromLocalStorage('forgetEmail')?.replace(/"/g, '');

    const onFinish: FormProps<VerifyOtpFormValues>['onFinish'] = async (values) => {
        try {
            const data = {
                email: email,
                oneTimeCode: (values.otp),
            };

            toast.promise(verifyOtp(data).unwrap(), {
                loading: 'Verifying OTP...',
                success: (res) => {
                    if (flow === 'register') {
                        navigate('/login');
                        return res.message || 'Email verified successfully! You can now login.';
                    } else {
                        // For forget-password, we might receive a token to use in the next step
                        if (res?.data?.token) {
                            localStorage.setItem('resetToken', res.data.token);
                        }
                        navigate('/new-password');
                        return res.message || 'OTP verified successfully!';
                    }
                },
                error: (err) => err?.data?.message || err?.data?.errorMessages?.[0]?.message || 'Verification failed',
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleResend = () => {
        try {
            const data = {
                email: email,
            };

            toast.promise(resendOtp(data).unwrap(), {
                loading: 'Resending OTP...',
                success: (res) => {
                    return res.message || 'OTP resent successfully!';
                },
                error: (err) => err?.data?.message || err?.data?.errorMessages?.[0]?.message || 'Resend failed',
            });
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <section className="min-h-screen grid lg:grid-cols-2 items-center bg-[#F8FAFC]">
            <AuthSidebar backgroundImage="/assets/images/auth/otp.jpg" />
            <div className="flex items-center justify-center p-10">
                <ConfigProvider
                    theme={{
                        components: {
                            Input: {
                                controlHeight: 50,
                                borderRadius: 10,
                            },
                        },
                        token: {
                            colorPrimary: '#66D978',
                        },
                    }}
                >
                    <div>
                        <div className="bg-white w-[630px] rounded-lg shadow-lg p-10 ">
                            <div className="text-primaryText space-y-3 text-center">
                                <h1 className="text-3xl text-center mt-2 text-[#000000] font-bold">
                                    {flow === 'register' ? 'Verify Your Email' : 'Check your email'}
                                </h1>
                                <p>
                                    We sent a {flow === 'register' ? 'verification' : 'reset'} code to <span className="font-semibold text-[#1E293B]">{email}</span>.
                                    Enter the 4-digit code mentioned in the email.
                                </p>
                            </div>

                            <Form
                                name="normal_VerifyOtp"
                                className="my-5"
                                layout="vertical"
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    className="flex items-center justify-center mx-auto"
                                    name="otp"
                                    rules={[{ required: true, message: 'Please input otp code here!' }]}
                                >
                                    <Input.OTP
                                        style={{ width: 300 }}
                                        variant="filled"
                                        length={4}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            height: 52,
                                            width: '100%',
                                            fontWeight: 600,
                                            fontSize: '18px',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        Verify OTP Code
                                    </Button>
                                </Form.Item>
                                <div className="text-center text-lg flex items-center justify-center gap-2">
                                    <p className="text-[#64748B]">Didn't receive the code?</p>
                                    <p onClick={handleResend} className="text-[#66D978] font-semibold cursor-pointer hover:underline">Resend</p>
                                </div>
                            </Form>
                        </div>
                    </div>
                </ConfigProvider>
            </div>
        </section>
    );
};

export default VerifyOtp;
