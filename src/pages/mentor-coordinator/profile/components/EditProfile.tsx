import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Row, Col, Select, Checkbox } from 'antd';
import { errorType } from '../../../authentication/Login';
import { useUpdateProfileMutation } from '../../../../redux/apiSlices/authSlice';
import { CameraOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { getImageUrl } from '../../../../utils/getImageUrl';
import {
    ArrowLeft,
    User,
    FileText,
    GraduationCap,
    MapPin,
    Globe,
    Laptop,
    Save,
    Upload,
    Camera,
    CheckCircle2,
    X
} from 'lucide-react';

const { TextArea } = Input;

interface EditProfileProps {
    user: any;
    onCancel: () => void;
    refetch: () => void;
}

const CAREER_DIRECTIONS_OPTIONS = [
    'I have no idea yet',
    'Frontend development (HTML/CSS/Javascript)',
    'App development',
    'Game development',
    'AI (Artificial Intelligence)',
    'Cybersecurity',
    'Web design / UXD (User experience design)',
    'Tester',
    'UI/UX',
    'Data Analyst',
];

const EditProfile: React.FC<EditProfileProps> = ({ user, onCancel, refetch }) => {
    const [profileForm] = Form.useForm();
    const [imgURL, setImgURL] = useState('');
    const [imgFile, setImageFile] = useState<File | null>(null);
    const [updateProfile, { isLoading, isSuccess, isError, error, data }] = useUpdateProfileMutation();

    const roleName = (user?.role || '').trim().toUpperCase();
    const isStudent = roleName === 'STUDENT';

    useEffect(() => {
        if (user) {
            let addressStr = user?.address || '';
            if (typeof addressStr === 'string' && addressStr.startsWith('{')) {
                try {
                    const parsed = JSON.parse(addressStr);
                    addressStr = `${parsed.city || ''}, ${parsed.streetAddress || ''}`;
                } catch {
                    // ignore
                }
            }

            const city = typeof addressStr === 'string' ? addressStr.split(', ')[0] || '' : '';
            const streetAddress = typeof addressStr === 'string' ? addressStr.split(', ').slice(1).join(', ') || '' : '';

            let careerDirs: string[] = [];
            if (Array.isArray(user?.careerDirections)) {
                careerDirs = user.careerDirections;
            } else if (typeof user?.careerDirections === 'string') {
                if (user.careerDirections.startsWith('[')) {
                    try {
                        careerDirs = JSON.parse(user.careerDirections);
                    } catch {
                        careerDirs = user.careerDirections.split(',').map((s: string) => s.trim());
                    }
                } else {
                    careerDirs = user.careerDirections.split(',').map((s: string) => s.trim());
                }
            }

            profileForm.setFieldsValue({
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                mobileNumber: user?.mobileNumber,
                contactNumber: user?.contactNumber || user?.mobileNumber,
                professionalTitle: user?.professionalTitle,
                preferredGroup: user?.preferedGroup,
                availableHours: user?.aviliableHours,
                about: user?.about || user?.aboutMe,
                gender: user?.gender,
                highestEducation: user?.highestEducation,
                careerDirections: isStudent ? careerDirs : undefined,
                havealaptop: isStudent
                    ? user?.havealaptop === true || user?.havealaptop === 'true' || user?.havealaptop === 'Yes'
                        ? 'Yes'
                        : user?.havealaptop === false || user?.havealaptop === 'false' || user?.havealaptop === 'No'
                        ? 'No'
                        : undefined
                    : undefined,
                city: city || user?.city,
                zipCode: user?.zipCode,
                streetAddress: streetAddress || user?.streetAddress,
                linkedInProfile: user?.linkedInProfile,
                githubProfile: user?.githubProfile,
                PortfolioWebsite: user?.PortfolioWebsite || user?.portfolioWebsite,
            });

            setImgURL(getImageUrl(user?.profile));
        }
    }, [profileForm, user, isStudent]);

    useEffect(() => {
        if (isSuccess && data) {
            Swal.fire({
                text: data?.message || 'Profile updated successfully!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            }).then(() => {
                refetch();
                onCancel();
            });
        }

        if (isError) {
            const errorMessage = (error as errorType)?.data?.errorMessages
                ? (error as errorType)?.data?.errorMessages.map((msg: { message: string }) => msg?.message).join('\n')
                : (error as errorType)?.data?.message || 'Something went wrong. Please try again.';
            Swal.fire({
                text: errorMessage,
                icon: 'error',
            });
        }
    }, [isSuccess, isError, error, data, onCancel, refetch]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImgURL(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    const onProfileFinish = async (values: any) => {
        const formData = new FormData();

        if (imgFile) {
            formData.append('image', imgFile);
        }

        // Split fullName into firstName + lastName for the backend if given
        if (values.fullName) {
            const parts = values.fullName.trim().split(' ');
            formData.append('firstName', parts[0] || '');
            formData.append('lastName', parts.slice(1).join(' ') || '');
            delete values.fullName;
        }

        // Address combined string
        const address = `${values.city || ''}, ${values.streetAddress || ''}`.trim();
        formData.append('address', address);
        if (values.zipCode) {
            formData.append('zipCode', values.zipCode);
        }

        // Append remaining fields (excluding removed administrative fields and address parts)
        Object.keys(values).forEach((key) => {
            if (
                key === 'city' ||
                key === 'streetAddress' ||
                key === 'zipCode' ||
                key === 'vNumber' ||
                key === 'note' ||
                key === 'notes'
            ) {
                return;
            }

            // Only append career directions if user is student
            if (key === 'careerDirections') {
                if (isStudent && Array.isArray(values[key])) {
                    values[key].forEach((direction: string) => {
                        formData.append('careerDirections', direction);
                    });
                }
                return;
            }

            // Only append havealaptop if user is student
            if (key === 'havealaptop') {
                if (isStudent && values[key]) {
                    formData.append('havealaptop', String(values[key] === 'Yes'));
                }
                return;
            }

            if (values[key] !== undefined && values[key] !== null) {
                formData.append(key, values[key]);
            }
        });

        await updateProfile(formData).unwrap();
    };

    return (
        <div className="space-y-6">
            {/* Top Navigation Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Profile</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {isStudent
                            ? 'Update your student credentials, personal details, and learning preferences'
                            : 'Update your personal credentials, contact details, and professional information'}
                    </p>
                </div>
                <Button
                    icon={<ArrowLeft className="w-4 h-4 mr-1 inline-block" />}
                    onClick={onCancel}
                    className="h-10 px-5 rounded-xl border-slate-200 hover:border-slate-300 font-semibold text-slate-700 flex items-center"
                >
                    Back to Profile
                </Button>
            </div>

            {/* Main Form Container */}
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
                <Form
                    name="update_profile"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onProfileFinish}
                    form={profileForm}
                    requiredMark={false}
                    className="space-y-8"
                >
                    {/* Premium Profile Photo Upload Card */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Avatar Preview with interactive hover overlay */}
                            <div className="relative group shrink-0">
                                <div
                                    className="w-32 h-32 rounded-3xl bg-slate-200 bg-cover bg-center border-4 border-white shadow-xl ring-2 ring-emerald-100 overflow-hidden relative cursor-pointer"
                                    style={{ backgroundImage: `url(${imgURL})` }}
                                    onClick={() => document.getElementById('profile-img-input')?.click()}
                                >
                                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center text-white">
                                        <Camera className="w-6 h-6 mb-1 text-emerald-300" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Change</span>
                                    </div>
                                </div>

                                {/* Floating Quick Camera Badge */}
                                <label
                                    htmlFor="profile-img-input"
                                    className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-[#66D978] hover:bg-[#58c769] text-slate-900 flex items-center justify-center cursor-pointer shadow-lg border-2 border-white transition-all transform hover:scale-110 active:scale-95"
                                    title="Upload photo"
                                >
                                    <CameraOutlined className="text-base" />
                                </label>
                            </div>

                            {/* Uploader Details & Action Buttons */}
                            <div className="flex-1 space-y-3 text-center sm:text-left">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Profile Photo</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        PNG, JPG, GIF or WEBP up to 5MB. A square ratio (1:1) looks best.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                                    <label
                                        htmlFor="profile-img-input"
                                        className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <Upload className="w-4 h-4 text-[#66D978]" />
                                        <span>Browse File</span>
                                    </label>

                                    {imgFile && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span className="truncate max-w-[160px]">{imgFile.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImgURL(getImageUrl(user?.profile));
                                                }}
                                                className="hover:text-red-600 ml-1 font-bold p-0.5"
                                                title="Remove selection"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hidden Native File Input with inline display: none */}
                        <input
                            onChange={onChange}
                            type="file"
                            id="profile-img-input"
                            style={{ display: 'none' }}
                            accept=".jpeg, .jpg, .png, .gif, .webp"
                        />
                    </div>

                    {/* About Me Section */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <FileText className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">About Me</h2>
                        </div>
                        <Form.Item name="about" className="mb-0">
                            <TextArea
                                rows={4}
                                placeholder="Write a short summary about yourself, background, passions, or goals..."
                                className="rounded-2xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500 text-slate-700 p-4 transition-all"
                            />
                        </Form.Item>
                    </div>

                    {/* Personal & Professional Information */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-5 pt-4 border-t border-slate-100">
                            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                                <User className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                            <Form.Item
                                label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">First Name</span>}
                                name="firstName"
                                rules={[{ required: true, message: 'Please input your first name!' }]}
                            >
                                <Input className="h-12 rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500" placeholder="First Name" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Last Name</span>}
                                name="lastName"
                                rules={[{ required: true, message: 'Please input your last name!' }]}
                            >
                                <Input className="h-12 rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500" placeholder="Last Name" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Email Address</span>}
                                name="email"
                            >
                                <Input
                                    className="h-12 rounded-xl bg-slate-50/80 border-slate-200 text-slate-500 cursor-not-allowed"
                                    placeholder="email@example.com"
                                    readOnly
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Professional Title</span>}
                                name="professionalTitle"
                            >
                                <Input className="h-12 rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500" placeholder="e.g. Software Engineering Student / Coordinator" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Contact Number</span>}
                                name="contactNumber"
                            >
                                <Input
                                    className="h-12 rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500"
                                    placeholder="e.g. +1 (555) 000-0000"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Gender</span>}
                                name="gender"
                            >
                                <Select
                                    className="h-12 w-full rounded-xl"
                                    placeholder="Select Gender"
                                    options={[
                                        { label: 'Male', value: 'Male' },
                                        { label: 'Female', value: 'Female' },
                                        { label: 'Other', value: 'Other' },
                                    ]}
                                />
                            </Form.Item>

                            <div className="md:col-span-2">
                                <Form.Item
                                    label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Highest Education</span>}
                                    name="highestEducation"
                                >
                                    <Select
                                        placeholder="Select your highest degree / education"
                                        className="h-12 w-full rounded-xl"
                                        options={[
                                            { label: 'High School', value: 'High School' },
                                            { label: 'Associate Degree', value: 'Associate Degree' },
                                            { label: 'Bachelor Degree', value: 'Bachelor Degree' },
                                            { label: 'Master Degree', value: 'Master Degree' },
                                            { label: 'PhD', value: 'PhD' },
                                        ]}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    {/* STUDENT ROLE ONLY SECTION: Laptop Availability & Career Directions */}
                    {isStudent && (
                        <div className="p-6 sm:p-7 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 space-y-6">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                                    <GraduationCap className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-slate-900">Student Learning Preferences</h2>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 uppercase tracking-wider">
                                            Student Only
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">Provide equipment access and targeted career directions</p>
                                </div>
                            </div>

                            {/* Has Laptop */}
                            <div>
                                <Form.Item
                                    label={
                                        <span className="font-semibold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                            <Laptop className="w-3.5 h-3.5 text-emerald-600" />
                                            Do you have a personal laptop?
                                        </span>
                                    }
                                    name="havealaptop"
                                    className="mb-0"
                                >
                                    <Select
                                        className="h-12 w-full sm:w-72 rounded-xl"
                                        placeholder="Select option"
                                        options={[
                                            { label: 'Yes, I have a laptop', value: 'Yes' },
                                            { label: 'No, I do not have a laptop', value: 'No' },
                                        ]}
                                    />
                                </Form.Item>
                            </div>

                            {/* Career Directions */}
                            <div className="pt-2 border-t border-emerald-100">
                                <Form.Item
                                    label={
                                        <span className="font-semibold text-slate-700 text-xs uppercase tracking-wider block mb-1">
                                            Career Directions (Select all that apply)
                                        </span>
                                    }
                                    name="careerDirections"
                                    className="mb-0"
                                >
                                    <Checkbox.Group className="w-full">
                                        <Row gutter={[12, 12]}>
                                            {CAREER_DIRECTIONS_OPTIONS.map((direction) => (
                                                <Col xs={24} sm={12} key={direction}>
                                                    <div className="p-3 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 transition-all shadow-2xs">
                                                        <Checkbox value={direction} className="w-full text-slate-800 text-sm font-medium">
                                                            {direction}
                                                        </Checkbox>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                            </div>
                        </div>
                    )}

                    {/* Address Information */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-5 pt-4 border-t border-slate-100">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Address Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mb-4">
                            <Form.Item
                                label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">City</span>}
                                name="city"
                            >
                                <Input className="h-12 rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500" placeholder="City" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Zip Code</span>}
                                name="zipCode"
                            >
                                <Input className="h-12 rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500" placeholder="Postal / Zip Code" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Street Address</span>}
                            name="streetAddress"
                            className="mb-0"
                        >
                            <Input className="h-12 rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500" placeholder="Street Address line" />
                        </Form.Item>
                    </div>

                    {/* Social & Professional Links */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-5 pt-4 border-t border-slate-100">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Globe className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Links & Social Profiles</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Form.Item
                                label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">LinkedIn Profile</span>}
                                name="linkedInProfile"
                            >
                                <Input
                                    className="h-12 rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500"
                                    placeholder="linkedin.com/in/username"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">GitHub Profile</span>}
                                name="githubProfile"
                            >
                                <Input
                                    className="h-12 rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500"
                                    placeholder="github.com/username"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Portfolio Website</span>}
                                name="PortfolioWebsite"
                            >
                                <Input
                                    className="h-12 rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500"
                                    placeholder="https://myportfolio.com"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                        <Button
                            onClick={onCancel}
                            className="h-12 px-7 rounded-xl border-slate-200 hover:border-slate-300 font-semibold text-slate-700 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            icon={<Save className="w-4 h-4 mr-1 inline-block" />}
                            className="h-12 px-8 rounded-xl font-bold shadow-sm hover:shadow-md transition-all bg-[#66D978] hover:bg-[#58c769] border-none text-slate-900"
                        >
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default EditProfile;
