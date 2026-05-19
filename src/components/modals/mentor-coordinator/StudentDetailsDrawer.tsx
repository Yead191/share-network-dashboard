import React from 'react';
import { Drawer, Avatar, Typography, Tag, Descriptions, List } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    LinkedinOutlined,
    GithubOutlined,
    GlobalOutlined,
    AimOutlined,
} from '@ant-design/icons';
import { getImageUrl } from '../../../utils/getImageUrl';

const { Title, Text, Paragraph } = Typography;

interface StudentDetailsDrawerProps {
    open: boolean;
    onClose: () => void;
    student: any;
}

const StudentDetailsDrawer: React.FC<StudentDetailsDrawerProps> = ({ open, onClose, student }) => {
    // console.log(student)
    return (
        <Drawer
            title={<span className="text-xl font-bold">Student Profile Details</span>}
            placement="right"
            width={650}
            onClose={onClose}
            open={open}
        >
            {student && (
                <div className="space-y-6">
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                        <Avatar
                            src={student.profile ? getImageUrl(student.profile) : undefined}
                            icon={!student.profile && <UserOutlined />}
                            size={84}
                            className="border-4 border-gray-50 shadow-sm"
                        />
                        <div>
                            <Title level={4} className="m-0 mb-1">{student.firstName} {student.lastName}</Title>
                            <Text className="text-gray-500 block">{student.professionalTitle || 'Student'}</Text>
                            <div className="mt-2 flex gap-2">
                                <Tag color={student.status === 'ACTIVE' ? 'success' : 'error'} className="rounded-full m-0">{student.status || 'ACTIVE'}</Tag>
                            </div>
                        </div>
                    </div>

                    {student.about && (
                        <div>
                            <Title level={5} className="mb-2 text-gray-800">About</Title>
                            <Paragraph className="text-gray-600">{student.about}</Paragraph>
                        </div>
                    )}

                    <Descriptions title="Contact Information" column={1} size="small" bordered className="bg-white">
                        <Descriptions.Item label={<span className="flex items-center gap-2"><MailOutlined /> Email</span>}>{student.email}</Descriptions.Item>
                        <Descriptions.Item label={<span className="flex items-center gap-2"><PhoneOutlined /> Phone</span>}>{student.mobileNumber || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label={<span className="flex items-center gap-2"><EnvironmentOutlined /> Location</span>}>{student.address || 'N/A'}</Descriptions.Item>
                    </Descriptions>

                    <Descriptions title="Academics & Tracks" column={1} size="small" bordered className="bg-white">
                        <Descriptions.Item label="Highest Education">{student.highestEducation || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Group">{student.userGroup?.map((g: any) => g.name).join(', ') || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Track">{student.userGroupTrack?.name || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Career Directions">
                            {student.careerDirections?.length ? (
                                <div className="flex gap-1 flex-wrap">
                                    {student.careerDirections.map((dir: string) => <Tag key={dir} className="m-0 text-xs text-blue-600 bg-blue-50 border-blue-100 rounded-full">{dir}</Tag>)}
                                </div>
                            ) : 'None selected'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Available Hours">{student.aviliableHours || 'N/A'}</Descriptions.Item>
                    </Descriptions>

                    {(student.linkedInProfile || student.githubProfile || student.PortfolioWebsite) && (
                        <Descriptions title="Social Links" column={1} size="small" bordered className="bg-white">
                            {student.linkedInProfile && <Descriptions.Item label={<span className="flex items-center gap-2 text-blue-700"><LinkedinOutlined /> LinkedIn</span>}><a href={student.linkedInProfile} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Profile</a></Descriptions.Item>}
                            {student.githubProfile && <Descriptions.Item label={<span className="flex items-center gap-2 text-gray-800"><GithubOutlined /> GitHub</span>}><a href={student.githubProfile} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Profile</a></Descriptions.Item>}
                            {student.PortfolioWebsite && <Descriptions.Item label={<span className="flex items-center gap-2 text-indigo-600"><GlobalOutlined /> Website</span>}><a href={student.PortfolioWebsite} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Website</a></Descriptions.Item>}
                        </Descriptions>
                    )}
                    {student?.Goals && student?.Goals.length > 0 && (
                        <div >
                            <Title level={5} className="mb-2 text-gray-800"><AimOutlined className="text-blue-600 mr-2" /> Current Goals</Title>
                            <List
                                itemLayout="horizontal"
                                dataSource={student?.Goals}
                                renderItem={(goal: any) => (
                                    <List.Item className="bg-blue-50 rounded-lg p-4 mb-3 border border-blue-100 !pl-4">
                                        <List.Item.Meta
                                            title={<span className="font-semibold text-gray-800">{goal.title}</span>}
                                            description={<span className="text-gray-600 whitespace-pre-line mt-1 block">{goal.description}</span>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    )}

                    {student.readBooks && (
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-4">
                            <Text strong className="text-indigo-800 block mb-1">Reading Habits</Text>
                            <Text className="text-indigo-600">{student.readBooks}</Text>
                        </div>
                    )}
                </div>
            )}
        </Drawer>
    );
};

export default StudentDetailsDrawer;
