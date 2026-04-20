import React from "react";
import {
    Modal,
    Avatar,
    Tag,
    Tabs,
    Card,
    Badge,
    Descriptions,
    Progress,
    Rate,
    Empty,
    Typography,
    Divider,
    Space,
    Tooltip,
    Button,
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    GlobalOutlined,
    CalendarOutlined,
    BookOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    EnvironmentOutlined,
    GithubOutlined,
    LinkedinOutlined,
    DesktopOutlined,
    ClockCircleOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { getImageUrl } from "../../../../utils/getImageUrl";

const { Title, Text, Paragraph } = Typography;

const StudentCard: React.FC<{ student: any }> = ({ student }) => {
    const avgRating =
        student.review?.length > 0
            ? student.review.reduce((sum: any, r: any) => sum + (r.rating || 0), 0) /
            student.review.length
            : null;

    const avgCompletion =
        student.review?.length > 0
            ? student.review.reduce((sum: any, r: any) => sum + (r.courseCompletion || 0), 0) /
            student.review.length
            : null;

    return (
        <Card
            style={{ marginBottom: 24, borderRadius: 16, border: "1px solid #f0f0f0", overflow: "hidden" }}
            className="student-item-card"
        >
            {/* Student header */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <Avatar
                    src={getImageUrl(student?.profile) || 'https://res.cloudinary.com/ddqovbzxy/image/upload/v1736572642/avatar_ziy9mp.jpg'}
                    size={64}
                    icon={<UserOutlined />}
                    style={{ flexShrink: 0, border: "2px solid #e6f4ff" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Title level={5} style={{ margin: 0 }}>
                            {student.firstName} {student.lastName}
                        </Title>
                    </div>
                    <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 4 }}>
                        <MailOutlined style={{ marginRight: 6 }} />
                        {student.email}
                    </Text>
                    <Space size={4}>
                        <Tag color="green" style={{ fontSize: 10, borderRadius: 4 }}>{student.userGroup?.[0]?.name || 'N/A'}</Tag>
                        <Tag color="purple" style={{ fontSize: 10, borderRadius: 4 }}>{student.userGroupTrack?.name || 'N/A'}</Tag>
                    </Space>
                </div>
                {avgRating !== null && (
                    <div style={{ textAlign: "center", background: "#f9f9f9", padding: "8px 12px", borderRadius: 8 }}>
                        <Rate disabled defaultValue={avgRating} allowHalf style={{ fontSize: 12 }} />
                        <Text strong style={{ fontSize: 14, display: "block", color: "#1677ff" }}>
                            {avgRating.toFixed(1)} <span style={{ fontSize: 10, color: "#8c8c8c" }}>/ 5</span>
                        </Text>
                    </div>
                )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Left Column: Personal & Contact */}
                <div>
                    <Descriptions title={<Text strong style={{ fontSize: 12 }}>Personal & Contact</Text>} column={1} size="small" colon={false}>
                        <Descriptions.Item label={<PhoneOutlined />}>{student.contactNumber || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label={<UserOutlined />}>{student.gender || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label={<EnvironmentOutlined />}>{student.address || 'N/A'}</Descriptions.Item>
                    </Descriptions>

                    {/* Socials & Portfolios */}
                    {(student.linkedInProfile || student.githubProfile || student.PortfolioWebsite) && (
                        <div style={{ marginTop: 12 }}>
                            <Text strong style={{ fontSize: 11, color: "#8c8c8c", display: "block", marginBottom: 8 }}>Socials & Portfolios</Text>
                            <Space>
                                {student.linkedInProfile && (
                                    <Tooltip title="LinkedIn">
                                        <a href={student.linkedInProfile} target="_blank" rel="noreferrer">
                                            <Avatar size="small" icon={<LinkedinOutlined />} style={{ background: "#0077b5" }} />
                                        </a>
                                    </Tooltip>
                                )}
                                {student.githubProfile && (
                                    <Tooltip title="GitHub">
                                        <a href={student.githubProfile} target="_blank" rel="noreferrer">
                                            <Avatar size="small" icon={<GithubOutlined />} style={{ background: "#333" }} />
                                        </a>
                                    </Tooltip>
                                )}
                                {student.PortfolioWebsite && (
                                    <Tooltip title="Portfolio">
                                        <a href={student.PortfolioWebsite} target="_blank" rel="noreferrer">
                                            <Avatar size="small" icon={<GlobalOutlined />} style={{ background: "#1677ff" }} />
                                        </a>
                                    </Tooltip>
                                )}
                            </Space>
                        </div>
                    )}
                </div>

                {/* Right Column: Progress & Motivation */}
                <div>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <Text strong style={{ fontSize: 11 }}>Course Completion</Text>
                            <Text strong style={{ fontSize: 11, color: "#52c41a" }}>{avgCompletion || 0}%</Text>
                        </div>
                        <Progress percent={avgCompletion || 0} size="small" strokeColor={{ from: "#1677ff", to: "#52c41a" }} showInfo={false} />
                    </div>

                    <Descriptions title={<Text strong style={{ fontSize: 12 }}>Academic Info</Text>} column={1} size="small" colon={false}>
                        <Descriptions.Item label={<BookOutlined />}>{student.highestEducation || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label={<ClockCircleOutlined />}>{student.aviliableHours || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label={<DesktopOutlined />}>{student.havealaptop ? 'Has Laptop' : 'No Laptop'}</Descriptions.Item>
                    </Descriptions>
                </div>
            </div>

            {/* Note & Directions */}
            {(student.note || student.careerDirections?.length > 0) && (
                <div style={{ marginTop: 16, padding: "12px", background: "#f5f5f5", borderRadius: 8 }}>
                    {student.careerDirections?.length > 0 && (
                        <div style={{ marginBottom: 8 }}>
                            <Text strong style={{ fontSize: 11, marginBottom: 4, display: "block" }}>Career Directions:</Text>
                            <Space wrap size={4}>
                                {student.careerDirections.map((dir: string) => (
                                    <Tag key={dir} color="blue" bordered={false} style={{ fontSize: 10 }}>{dir}</Tag>
                                ))}
                            </Space>
                        </div>
                    )}
                    {student.note && (
                        <div>
                            <Text strong style={{ fontSize: 11, marginBottom: 4, display: "block" }}>Note:</Text>
                            <Text style={{ fontSize: 12, color: "#595959" }}>{student.note}</Text>
                        </div>
                    )}
                </div>
            )}

            {/* Onboarding */}
            {student.Onboarding && (
                <>
                    <Divider style={{ margin: "16px 0" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <EditOutlined style={{ color: "#13c2c2" }} />
                        <Text strong style={{ fontSize: 14 }}>Onboarding Insights</Text>
                    </div>
                    <Descriptions column={1} size="small" bordered style={{ background: "#fafafa" }}>
                        <Descriptions.Item label={<Text strong style={{ fontSize: 11 }}>Computer Comfort</Text>}>
                            {student.Onboarding.computer_comfort}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ fontSize: 11 }}>Curious Interests</Text>}>
                            {student.Onboarding.curious_activities}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Text strong style={{ fontSize: 11 }}>Learning Challenges</Text>}>
                            {student.Onboarding.hardest_to_learn}
                        </Descriptions.Item>
                    </Descriptions>
                </>
            )}
        </Card>
    );
};


const MentorDetailsModal: React.FC<any> = ({
    mentor,
    open,
    onClose,
}) => {
    if (!mentor) return null;

    const tabItems = [
        {
            key: "overview",
            label: "Overview",
            children: (
                <div style={{}}>
                    {/* Profile header */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 28 }}>
                        <Avatar
                            src={mentor.profile?.startsWith("http") || mentor.profile?.startsWith("/") ? mentor.profile : undefined}
                            icon={<UserOutlined />}
                            size={100}
                            style={{ border: "4px solid #e6f4ff", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                                <Title level={3} style={{ margin: 0 }}>
                                    {mentor.firstName} {mentor.lastName}
                                </Title>
                                {mentor?.verified && (
                                    <Tooltip title="Verified Mentor">
                                        <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 18 }} />
                                    </Tooltip>
                                )}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                <Tag color={mentor.status === "ACTIVE" ? "success" : "error"} style={{ borderRadius: 6, fontWeight: 600 }}>
                                    {mentor?.status}
                                </Tag>
                            </div>

                            <Paragraph style={{ color: "#595959", fontSize: 14, marginBottom: 16 }}>
                                {mentor.about || "Professional Mentor dedicated to student growth."}
                            </Paragraph>

                            <Space size={12}>
                                {mentor?.linkedInProfile && (
                                    <a href={mentor.linkedInProfile} target="_blank" rel="noreferrer">
                                        <Button shape="circle" icon={<LinkedinOutlined />} style={{ background: "#0077b5", color: "white", border: "none" }} />
                                    </a>
                                )}
                                {mentor?.githubProfile && (
                                    <a href={mentor.githubProfile} target="_blank" rel="noreferrer">
                                        <Button shape="circle" icon={<GithubOutlined />} style={{ background: "#333", color: "white", border: "none" }} />
                                    </a>
                                )}
                                {mentor?.PortfolioWebsite && (
                                    <a href={mentor.PortfolioWebsite} target="_blank" rel="noreferrer">
                                        <Button shape="circle" icon={<GlobalOutlined />} style={{ background: "#1677ff", color: "white", border: "none" }} />
                                    </a>
                                )}
                            </Space>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                        {/* Personal & Contact */}
                        <Card size="small" title={<Text strong>Personal & Contact</Text>} bordered={false} style={{ background: "#f9f9f9", borderRadius: 12 }}>
                            <Descriptions column={1} size="small" colon={false}>
                                <Descriptions.Item label={<MailOutlined style={{ color: "#1677ff" }} />}>{mentor.email}</Descriptions.Item>
                                <Descriptions.Item label={<PhoneOutlined style={{ color: "#1677ff" }} />}>{mentor.contactNumber || mentor.mobileNumber || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label={<UserOutlined style={{ color: "#1677ff" }} />}>{mentor.gender || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label={<EnvironmentOutlined style={{ color: "#1677ff" }} />}>{mentor.address || mentor.location || 'N/A'}</Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Professional Info */}
                        <Card size="small" title={<Text strong>Professional Info</Text>} bordered={false} style={{ background: "#f9f9f9", borderRadius: 12 }}>
                            <Descriptions column={1} size="small" colon={false}>
                                <Descriptions.Item label={<BookOutlined style={{ color: "#1677ff" }} />}>{mentor.highestEducation || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label={<ClockCircleOutlined style={{ color: "#1677ff" }} />}>{mentor.aviliableHours || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label={<DesktopOutlined style={{ color: "#1677ff" }} />}>{mentor.havealaptop ? 'Has Laptop' : 'No Laptop'}</Descriptions.Item>
                                <Descriptions.Item label={<CalendarOutlined style={{ color: "#1677ff" }} />}>Joined: {mentor.createdAt ? new Date(mentor.createdAt).toLocaleDateString() : 'N/A'}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </div>

                    {/* Groups & Track */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                        <div>
                            <Text strong style={{ display: "block", marginBottom: 12, fontSize: 13 }}>Assigned Groups</Text>
                            <Space wrap>
                                {mentor?.userGroup?.length > 0 ? (
                                    mentor?.userGroup?.map((group: any) => (
                                        <Tooltip key={group?._id} title={group.description}>
                                            <Tag color="blue" style={{ borderRadius: 6, padding: "4px 12px", border: "none", background: "#e6f4ff", color: "#1168e1" }}>
                                                {group?.name}
                                            </Tag>
                                        </Tooltip>
                                    ))
                                ) : (
                                    <Text type="secondary">None</Text>
                                )}
                            </Space>
                        </div>
                        <div>
                            <Text strong style={{ display: "block", marginBottom: 12, fontSize: 13 }}>Assigned Track</Text>
                            {mentor.userGroupTrack ? (
                                <Tag color="purple" style={{ borderRadius: 6, padding: "4px 12px", border: "none", background: "#f9f0ff", color: "#60219c" }}>
                                    {mentor?.userGroupTrack?.name}
                                </Tag>
                            ) : (
                                <Text type="secondary">Not assigned</Text>
                            )}
                        </div>
                    </div>

                    {/* Mentor Notes */}
                    {mentor?.note && (
                        <div style={{ marginBottom: 28 }}>
                            <Text strong style={{ display: "block", marginBottom: 8, fontSize: 13 }}>Administrative Notes</Text>
                            <div style={{ background: "#fffbe6", border: "1px solid #ffe58f", padding: "12px 16px", borderRadius: 8 }}>
                                <Text style={{ color: "#856404", fontSize: 13 }}>{mentor.note}</Text>
                            </div>
                        </div>
                    )}

                </div>
            ),
        },
        {
            key: "students",
            label: (
                <span>
                    <TeamOutlined style={{ marginRight: 6 }} />
                    Students
                    <Badge
                        count={mentor.assignedStudents?.length || 0}
                        style={{ marginLeft: 6, backgroundColor: "#1677ff" }}
                    />
                </span>
            ),
            children:
                !mentor?.assignedStudents || mentor?.assignedStudents.length === 0 ? (
                    <Empty description="No students assigned yet" style={{ padding: "60px 0" }} />
                ) : (
                    <div >
                        {mentor?.assignedStudents?.map((student: any) => (
                            <StudentCard key={student._id} student={student} />
                        ))}
                    </div>
                ),
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            title={
                <Space style={{ padding: "4px 0" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1677ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <UserOutlined style={{ color: "white" }} />
                    </div>
                    <Text strong style={{ fontSize: 18 }}>Mentor Profile Information</Text>
                </Space>
            }
            styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }}
            destroyOnClose
            centered
            className="mentor-profile-modal"
        >
            <style>
                {`
                    .mentor-profile-modal .ant-tabs-nav::before { border: none !important; }
                    .mentor-profile-modal .ant-tabs-tab { padding: 12px 0; margin-right: 32px !important; }
                    .mentor-profile-modal .ant-tabs-tab-btn { font-size: 15px; font-weight: 500; }
                    .mentor-profile-modal .ant-descriptions-title { margin-bottom: 12px; }
                    .student-item-card { transition: all 0.3s; }
                    .student-item-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06) !important; }
                `}
            </style>
            <Tabs defaultActiveKey="overview" items={tabItems} />
        </Modal>
    );
};

export default MentorDetailsModal;