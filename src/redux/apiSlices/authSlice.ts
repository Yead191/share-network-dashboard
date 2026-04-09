import { getFromLocalStorage } from '../../utils/local-storage';
import { api } from '../api/baseApi';
const resetToken = getFromLocalStorage('resetToken');
const authSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        otpVerify: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/auth/verify-email',
                    body: data,
                };
            },
        }),

        resendOtp: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/auth/resend-otp',
                    body: data,
                };
            },
        }),

        login: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/auth/email-login',
                    body: data,
                };
            },
            invalidatesTags: ['Profile'],
        }),

        forgetPassword: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/auth/forget-password',
                    body: data,
                };
            },
        }),

        resetPassword: builder.mutation({
            query: (value) => ({
                url: '/auth/reset-password',
                headers: { authorization: resetToken ?? undefined },
                method: 'POST',
                body: value,
            }),
        }),

        changePassword: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/auth/change-password',
                    body: data,
                };
            },
        }),

        signup: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/user',
                    body: data,
                };
            },
        }),

        updateProfile: builder.mutation({
            query: (data) => {
                return {
                    method: 'PATCH',
                    url: '/user',
                    body: data,
                };
            },
        }),

        profile: builder.query({
            query: () => {
                return {
                    url: '/user/profile',
                };
            },
            providesTags: ['Profile'],
        }),
    }),
});

export const {
    useOtpVerifyMutation,
    useLoginMutation,
    useSignupMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useUpdateProfileMutation,
    useProfileQuery,
    useResendOtpMutation,
} = authSlice;
