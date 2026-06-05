import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Divider, Row, Col, Select, Checkbox } from 'antd';
import { errorType } from '../../../authentication/Login';
import { useUpdateProfileMutation } from '../../../../redux/apiSlices/authSlice';
import { CameraOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { getImageUrl } from '../../../../utils/getImageUrl';

const { TextArea } = Input;

interface EditProfileProps {
    user: any;
    onCancel: () => void;
    refetch: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onCancel, refetch }) => {
    const [profileForm] = Form.useForm();
    const [imgURL, setImgURL] = useState('');
    const [imgFile, setImageFile] = useState<File | null>(null);
    const [updateProfile, { isLoading, isSuccess, isError, error, data }] = useUpdateProfileMutation();

    useEffect(() => {
        if (user) {
            let addressStr = user?.address || '';
            if (typeof addressStr === 'string' && addressStr.startsWith('{')) {
                try {
                    const parsed = JSON.parse(addressStr);
                    addressStr = `${parsed.city || ''}, ${parsed.streetAddress || ''}`;
                } catch (e) {
                    // ignore
                }
            }

            const city = typeof addressStr === 'string' ? addressStr.split(', ')[0] || '' : '';
            const streetAddress = typeof addressStr === 'string' ? addressStr.split(', ').slice(1).join(', ') || '' : '';

            let careerDirs = [];
            if (Array.isArray(user?.careerDirections)) {
                careerDirs = user.careerDirections;
            } else if (typeof user?.careerDirections === 'string') {
                if (user.careerDirections.startsWith('[')) {
                    try {
                        careerDirs = JSON.parse(user.careerDirections);
                    } catch (e) {
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
                careerDirections: careerDirs,
                havealaptop: user?.havealaptop === true || user?.havealaptop === 'true' ? 'Yes' : user?.havealaptop === false || user?.havealaptop === 'false' ? 'No' : user?.havealaptop,
                city: city || user?.city,
                zipCode: user?.zipCode,
                streetAddress: streetAddress || user?.streetAddress,
                vNumber: user?.vNumber,
                note: user?.note || user?.notes,
                linkedInProfile: user?.linkedInProfile,
                githubProfile: user?.githubProfile,
                PortfolioWebsite: user?.PortfolioWebsite || user?.portfolioWebsite,
            });
            setImgURL(
                getImageUrl(user?.profile)
            );
        }
    }, [profileForm, user]);

    useEffect(() => {
        if (isSuccess && data) {
            Swal.fire({
                text: data?.message,
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
    }, [isSuccess, isError, error, data, onCancel]);

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

        // Split fullName into firstName + lastName for the backend
        if (values.fullName) {
            const parts = values.fullName.trim().split(' ');
            formData.append('firstName', parts[0] || '');
            formData.append('lastName', parts.slice(1).join(' ') || '');
            delete values.fullName;
        }

        // Address is combined as a single string field
        const address = `${values.city || ''}, ${values.streetAddress || ''}`;
        formData.append('address', address);
        formData.append('zipCode', values.zipCode || '');

        Object.keys(values).forEach((key) => {
            if (key === 'city' || key === 'streetAddress' || key === 'zipCode') {
                return;
            }
            if (values[key] !== undefined && values[key] !== null) {
                if (key === 'careerDirections' && Array.isArray(values[key])) {
                    values[key].forEach((direction: string) => {
                        formData.append('careerDirections', direction);
                    });
                } else if (key === 'havealaptop') {
                    formData.append(key, String(values[key] === 'Yes'));
                } else {
                    formData.append(key, values[key]);
                }
            }
        });

        await updateProfile(formData).unwrap();
    };

    const sectionTitle = (title: string) => (
        <div className="mb-6">
            <h4 className="text-lg font-bold text-[#333333]">{title}</h4>
            <Divider className="my-2 border-gray-100" />
        </div>
    );

    return (
        <div className="container mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <Form
                name="update_profile"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onProfileFinish}
                form={profileForm}
                className="edit-profile-form"
            >
                {/* Profile Photo */}
                <div className="flex flex-col items-center mb-12">
                    <div className="relative">
                        <div
                            className="w-32 h-32 rounded-xl bg-gray-100 bg-cover bg-center border-2 border-gray-100 shadow-inner"
                            style={{ backgroundImage: `url(${imgURL})` }}
                        />
                        <div className="hidden">
                            <input onChange={onChange} type="file" id="img" className="hidden" accept='.jpeg, .jpg, .png, .gif' />
                        </div>
                        <label
                            htmlFor="img"
                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-all border-2 border-white group"
                        >
                            <CameraOutlined className="text-white text-lg group-hover:scale-110 transition-transform" />
                        </label>
                    </div>
                    <span className="text-gray-500 text-sm mt-4 font-medium uppercase tracking-wider">
                        Update Profile Photo
                    </span>
                </div>

                {/* About Me */}
                {sectionTitle('About')}
                <Form.Item name="about" className="mb-8">
                    <TextArea
                        rows={5}
                        placeholder="Tell us about yourself..."
                        className="rounded-lg border-gray-200 focus:border-primary hover:border-primary transition-colors text-gray-700"
                    />
                </Form.Item>

                {/* Basic Information */}
                {sectionTitle('Basic Information')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-8">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700">First Name</span>}
                        name="firstName"
                        rules={[{ required: true, message: 'Please input your first name!' }]}
                    >
                        <Input className="h-12 rounded-lg" placeholder="Michael" />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Last Name</span>}
                        name="lastName"
                        rules={[{ required: true, message: 'Please input your last name!' }]}
                    >
                        <Input className="h-12 rounded-lg" placeholder="Johnson" />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Email</span>}
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input
                            className="h-12 rounded-lg bg-gray-50 cursor-not-allowed"
                            placeholder="alexmichael@gmail.com"
                            readOnly
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Professional Title</span>}
                        name="professionalTitle"
                    >
                        <Input className="h-12 rounded-lg" placeholder="Coordinator" />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-medium text-gray-700">Contact Number</span>}
                        name="contactNumber"
                    >
                        <Input
                            className="h-11 rounded-md"
                            variant="filled"
                            style={{ backgroundColor: '#f9f9f9' }}
                        />
                    </Form.Item>
                    <Form.Item label={<span className="font-medium text-gray-700">Gender</span>} name="gender">
                        <Select
                            className="h-11 rounded-md"
                            options={[
                                { label: 'Male', value: 'Male' },
                                { label: 'Female', value: 'Female' },
                                { label: 'Other', value: 'Other' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-medium text-gray-700">Highest Education</span>}
                        name="highestEducation"
                    >
                        <Select
                            placeholder="Select high school"
                            className="h-11 rounded-md"
                            options={[
                                { label: 'High School', value: 'High School' },
                                { label: 'Associate Degree', value: 'Associate Degree' },
                                { label: 'Bachelor Degree', value: 'Bachelor Degree' },
                                { label: 'Master Degree', value: 'Master Degree' },
                                { label: 'PhD', value: 'PhD' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-medium text-gray-700">Has Laptop</span>}
                        name="havealaptop"
                    >
                        <Select
                            className="h-11 rounded-md"
                            options={[
                                { label: 'Yes', value: 'Yes' },
                                { label: 'No', value: 'No' },
                            ]}
                        />
                    </Form.Item>
                </div>

                <div className="mb-8">
                    <Form.Item
                        label={<span className="font-medium text-gray-700">Career Directions</span>}
                        name="careerDirections"
                    >
                        <Checkbox.Group className="w-full">
                            <Row gutter={[16, 16]}>
                                {[
                                    'I have no idea yet',
                                    'Frontend development (HTML/CSS/Javascript)',
                                    'App development',
                                    'Game development',
                                    'AI (Artificial Intelligence)',
                                    'Cybersecurity',
                                    'Web design / UXD (User experience design)',
                                    'Tester',
                                    'UI/UX',
                                    'Data Analyst'
                                ].map((direction) => (
                                    <Col span={12} key={direction}>
                                        <Checkbox value={direction}>{direction}</Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                </div>

                {/* Address Information */}
                {sectionTitle('Address Information')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-8">
                    <Form.Item label={<span className="font-medium text-gray-700">City</span>} name="city">
                        <Input
                            className="h-11 rounded-md"
                            variant="filled"
                            style={{ backgroundColor: '#f9f9f9' }}
                        />
                    </Form.Item>
                    <Form.Item label={<span className="font-medium text-gray-700">Zip Code</span>} name="zipCode">
                        <Input
                            className="h-11 rounded-md"
                            variant="filled"
                            style={{ backgroundColor: '#f9f9f9' }}
                        />
                    </Form.Item>
                </div>
                <Form.Item
                    label={<span className="font-medium text-gray-700">Street Address</span>}
                    name="streetAddress"
                    className="mb-8"
                >
                    <Input className="h-11 rounded-md" variant="filled" style={{ backgroundColor: '#f9f9f9' }} />
                </Form.Item>

                {/* Administrative Information */}
                {sectionTitle('Administrative Information')}
                <Form.Item label={<span className="font-medium text-gray-700">V-Number</span>} name="vNumber" className="mb-8">
                    <Input className="h-11 rounded-md" variant="filled" style={{ backgroundColor: '#f9f9f9' }} />
                </Form.Item>
                <Form.Item label={<span className="font-medium text-gray-700">Notes</span>} name="note" className="mb-8">
                    <Input.TextArea
                        rows={4}
                        placeholder="Enter notes..."
                        className="rounded-md"
                        variant="filled"
                        style={{ backgroundColor: '#f9f9f9' }}
                    />
                </Form.Item>

                {/* Socials */}
                {sectionTitle('Links')}
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label={<span className="font-medium text-gray-700">LinkedIn</span>}
                            name="linkedInProfile"
                        >
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={<span className="font-medium text-gray-700">GitHub</span>}
                            name="githubProfile"
                        >
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={<span className="font-medium text-gray-700">Portfolio</span>}
                            name="PortfolioWebsite"
                        >
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-gray-100">
                    <Button
                        onClick={onCancel}
                        className="h-12 px-8 rounded-lg border-gray-200 hover:text-red-500 hover:border-red-500 transition-all font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="h-12 px-10 rounded-lg shadow-md font-bold transition-all"
                    >
                        Save Changes
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default EditProfile;
