import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tag, Typography, Avatar, Spin, Button, Row, Col, Table, Divider } from 'antd';
import { UserOutlined, ArrowLeftOutlined, EditOutlined, MailOutlined, PhoneOutlined, LinkedinOutlined, GithubOutlined, EyeOutlined } from '@ant-design/icons';
import HeaderTitle from '../../../../components/shared/HeaderTitle';
import CoordinatorEditMentorModal from '../../../../components/modals/mentor-coordinator/CoordinatorEditMentorModal';
import StudentDetailsDrawer from '../../../../components/modals/mentor-coordinator/StudentDetailsDrawer';
import ReportDetailsModal from '../../../../components/modals/mentor/ReportDetailsModal';
import { imageUrl } from '../../../../redux/api/baseApi';
import moment from 'moment';
import { useGetprofileByIdQuery } from '../../../../redux/apiSlices/students/overview.slice';
import { useGetWeeklyReportsQuery } from '../../../../redux/apiSlices/mentor/weeklyReportApi';

const { Title, Text, Paragraph } = Typography;

const MentorDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [reportPage, setReportPage] = useState(1);

    // Student Details Drawer State
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isStudentDrawerOpen, setIsStudentDrawerOpen] = useState(false);

    // Report Details Modal State
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [isReportDetailsModalOpen, setIsReportDetailsModalOpen] = useState(false);

    // APIs
    const { data: profileRes, isLoading: isProfileLoading, refetch } = useGetprofileByIdQuery(id, { skip: !id });


    const mentor = profileRes?.data;

    const students = mentor?.assignedStudents || [];
    const { data: reportsRes, isLoading: isReportsLoading } = useGetWeeklyReportsQuery({
        page: reportPage,
        limit: 10,
        searchTerm: '',
        id: students[0]?._id
    }, { skip: !students?.length });
    const reports = reportsRes?.data?.reports || [];
    const reportPagination = reportsRes?.data?.pagination;
    // console.log("reports::", reports)

    const reportColumns = [
        {
            title: 'Week Period',
            key: 'weekPeriod',
            render: (_: any, record: any) => (
                <span className="text-gray-600">
                    {moment(record.startDate).format('MMM D')} - {moment(record.endDate).format('MMM D, YYYY')}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Submitted' ? 'success' : status === 'Pending' ? 'warning' : 'default'}>
                    {status || 'Submitted'}
                </Tag>
            ),
        },
        {
            title: 'Submitted At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => <span className="text-gray-500">{moment(date).format('MMMM D, YYYY h:mm A')}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => {
                        setSelectedReport(record);
                        setIsReportDetailsModalOpen(true);
                    }}
                    type="text"
                    className="flex items-center justify-center text-gray-500 hover:text-blue-600 h-8 w-8 rounded-full hover:bg-gray-100"
                />
            ),
        }
    ];

    if (isProfileLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="text-center mt-10">
                <Title level={4}>Mentor not found</Title>
                <Button onClick={() => navigate('/mentor-coordinator/mentors')}>Back to Mentors</Button>
            </div>
        );
    }

    const openStudentDrawer = (student: any) => {
        setSelectedStudent(student);
        setIsStudentDrawerOpen(true);
    };

    return (
        <div className="container space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        className="rounded-full shadow-sm hover:shadow transition-all border-gray-200"
                    />
                    <HeaderTitle title="Mentor Profile" />
                </div>
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-primary hover:bg-primary/80 rounded-lg shadow-sm"
                >
                    Edit Information
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {/* Left Column - Mentor Info */}
                <Col xs={24} lg={8}>
                    <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden" bodyStyle={{ padding: 0 }}>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex flex-col items-center justify-center text-center">
                            <Avatar
                                src={mentor.profile ? `${imageUrl}${mentor.profile}` : undefined}
                                icon={!mentor.profile && <UserOutlined />}
                                size={120}
                                className="border-4 border-white shadow-md mb-4"
                            />
                            <Title level={4} className="m-0 text-gray-800">
                                {mentor.firstName} {mentor.lastName}
                            </Title>
                            <Text className="text-gray-500 font-medium">{mentor.jobTitle || 'Professional Mentor'}</Text>
                            {mentor.company && (
                                <Text className="text-blue-600 font-medium text-sm bg-white px-3 py-1 rounded-full mt-2 shadow-sm border border-blue-100">
                                    {mentor.company}
                                </Text>
                            )}
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                                        <MailOutlined />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 font-medium">Email</div>
                                        <div className="text-sm font-medium text-gray-700">{mentor.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                                        <PhoneOutlined />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 font-medium">Phone</div>
                                        <div className="text-sm font-medium text-gray-700">{mentor.mobileNumber || 'N/A'}</div>
                                    </div>
                                </div>
                                {(mentor.linkedInProfile || mentor.githubProfile) && (
                                    <>
                                        <Divider style={{ margin: '12px 0' }} />
                                        <div className="flex gap-3">
                                            {mentor.linkedInProfile && (
                                                <Button type="link" href={mentor.linkedInProfile} target="_blank" icon={<LinkedinOutlined />} className="p-0 text-gray-500 hover:text-blue-600">LinkedIn</Button>
                                            )}
                                            {mentor.githubProfile && (
                                                <Button type="link" href={mentor.githubProfile} target="_blank" icon={<GithubOutlined />} className="p-0 text-gray-500 hover:text-gray-900">GitHub</Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 border-t border-gray-100">
                            <div className="mb-4">
                                <Text className="text-xs text-gray-500 uppercase tracking-wider font-semibold">User Group & Track</Text>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {mentor.userGroup?.map((group: any) => (
                                    <Tag key={group._id} color="blue" className="rounded-full px-3 py-1 border-0 font-medium m-0">
                                        {group.name}
                                    </Tag>
                                ))}
                                {mentor.userGroupTrack && (
                                    <Tag color="purple" className="rounded-full px-3 py-1 border-0 font-medium m-0">
                                        {mentor.userGroupTrack.name}
                                    </Tag>
                                )}
                            </div>

                            <div className="mt-6 flex justify-between items-center">
                                <Text className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Account Status</Text>
                                <Tag color={mentor.status === 'ACTIVE' ? 'success' : 'error'} className="rounded-full border-0 px-3 font-semibold">
                                    {mentor.status}
                                </Tag>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Right Column - Tabs/Content */}
                <Col xs={24} lg={16}>
                    <div className="space-y-6">
                        {/* About Section */}
                        {mentor.about && (
                            <Card title={<span className="text-lg font-semibold text-gray-800">About Mentor</span>} className="rounded-2xl border-gray-100 shadow-sm">
                                <Paragraph className="text-gray-600 text-base leading-relaxed m-0">
                                    {mentor.about}
                                </Paragraph>
                            </Card>
                        )}

                        {/* Assigned Students */}
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-gray-800">Assigned Students</span>
                                    <Tag className="rounded-full bg-blue-50 text-blue-600 border-0 font-bold">{students.length}</Tag>
                                </div>
                            }
                            className="rounded-2xl border-gray-100 shadow-sm"
                        >
                            {students.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {students.map((student: any) => (
                                        <div
                                            key={student._id}
                                            onClick={() => openStudentDrawer(student)}
                                            className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-300"
                                        >
                                            <Avatar
                                                src={student.profile ? `${imageUrl}${student.profile}` : undefined}
                                                icon={!student.profile && <UserOutlined />}
                                                size={48}
                                                className="border-2 border-blue-50 flex-shrink-0"
                                            />
                                            <div className="overflow-hidden">
                                                <Text className="text-base font-semibold text-gray-800 block truncate">
                                                    {student.firstName} {student.lastName}
                                                </Text>
                                                <Text className="text-xs text-gray-500 block truncate mb-2">
                                                    {student.email}
                                                </Text>
                                                {student?.userGroup && (
                                                    <Tag className="rounded-full border-gray-200 text-gray-600 text-xs">
                                                        {student?.userGroup?.map((g: any) => g.name).join(', ') || 'N/A'}
                                                    </Tag>
                                                )}
                                                {student?.userGroupTrack?.name && (
                                                    <Tag className="rounded-full border-gray-200 text-gray-600 text-xs">
                                                        {student?.userGroupTrack?.name || 'N/A'}
                                                    </Tag>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <Text className="text-gray-400">No students currently assigned to this mentor.</Text>
                                </div>
                            )}
                        </Card>

                        {/* Weekly Reports Table */}
                        <Card
                            title={<span className="text-lg font-semibold text-gray-800">Weekly Reports</span>}
                            className="rounded-2xl border-gray-100 shadow-sm"
                            styles={{ body: { padding: 0 } }}
                        >
                            <Table
                                columns={reportColumns}
                                dataSource={reports}
                                rowKey="_id"
                                loading={isReportsLoading}
                                pagination={{
                                    current: reportPage,
                                    pageSize: 10,
                                    total: reportPagination?.total || 0,
                                    onChange: (page) => setReportPage(page),
                                }}
                                className="w-full"
                            />
                        </Card>
                    </div>
                </Col>
            </Row>

            <CoordinatorEditMentorModal
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                mentor={mentor}
                refetch={refetch}
            />

            <StudentDetailsDrawer
                open={isStudentDrawerOpen}
                onClose={() => setIsStudentDrawerOpen(false)}
                student={selectedStudent}
            />

            <ReportDetailsModal
                open={isReportDetailsModalOpen}
                onCancel={() => setIsReportDetailsModalOpen(false)}
                data={selectedReport}
            />
        </div>
    );
};

export default MentorDetailsPage;
