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
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    GithubOutlined,
    LinkedinOutlined,
    LaptopOutlined,
    BookOutlined,
    StarOutlined,
    CheckCircleOutlined,
    TeamOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

// ─── Career tag colors ───────────────────────────────────────────────────────
const CAREER_COLORS: Record<string, string> = {
    "App development": "blue",
    "Web Development": "cyan",
    "AI (Artificial Intelligence)": "purple",
    Cybersecurity: "red",
};

// ─── Student card ─────────────────────────────────────────────────────────────
const StudentCard: React.FC<{ student: any }> = ({ student }) => {
    const avgRating =
        student.review.length > 0
            ? student.review.reduce((sum: any, r: any) => sum + r.rating, 0) /
            student.review.length
            : null;

    const avgCompletion =
        student.review.length > 0
            ? student.review.reduce((sum: any, r: any) => sum + r.courseCompletion, 0) /
            student.review.length
            : null;

    return (
        <Card
            style={{ marginBottom: 16, borderRadius: 12, border: "1px solid #f0f0f0" }}
            styles={{ body: { padding: "16px 20px" } }}
        >
            {/* Student header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <Avatar
                    src={student.profile}
                    size={48}
                    icon={<UserOutlined />}
                    style={{ flexShrink: 0, border: "2px solid #e6f4ff" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ fontSize: 15, display: "block" }}>
                        {student.firstName} {student.lastName}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        <MailOutlined style={{ marginRight: 4 }} />
                        {student.email}
                    </Text>
                </div>
                {avgRating !== null && (
                    <div style={{ textAlign: "center" }}>
                        <Rate disabled defaultValue={avgRating} allowHalf style={{ fontSize: 13 }} />
                        <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                            {avgRating.toFixed(1)} / 5
                        </Text>
                    </div>
                )}
            </div>

            {/* Course completion */}
            {avgCompletion !== null && (
                <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <Text style={{ fontSize: 12 }}>Course Completion</Text>
                        <Text strong style={{ fontSize: 12 }}>
                            {avgCompletion}%
                        </Text>
                    </div>
                    <Progress
                        percent={avgCompletion}
                        size="small"
                        strokeColor={{ from: "#108ee9", to: "#87d068" }}
                        showInfo={false}
                    />
                </div>
            )}

            {/* Goals */}
            {student.Goals.length > 0 && (
                <>
                    <Divider style={{ margin: "10px 0" }} />
                    <Text strong style={{ fontSize: 12, color: "#595959", display: "block", marginBottom: 8 }}>
                        <BookOutlined style={{ marginRight: 6, color: "#1677ff" }} />
                        Goals ({student.Goals.length})
                    </Text>
                    <Space direction="vertical" size={6} style={{ width: "100%" }}>
                        {student?.Goals?.map((goal: any) => (
                            <div
                                key={goal._id}
                                style={{
                                    background: "#f8f9ff",
                                    borderRadius: 8,
                                    padding: "8px 12px",
                                    borderLeft: "3px solid #1677ff",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 12 }} />
                                    <Text strong style={{ fontSize: 13 }}>
                                        {goal.title}
                                    </Text>
                                </div>
                                <Paragraph
                                    style={{ marginBottom: 0, marginTop: 4, fontSize: 12, color: "#595959" }}
                                    ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                                >
                                    {goal.description}
                                </Paragraph>
                            </div>
                        ))}
                    </Space>
                </>
            )}

            {/* Onboarding */}
            {student.Onboarding && (
                <>
                    <Divider style={{ margin: "10px 0" }} />
                    <Text strong style={{ fontSize: 12, color: "#595959", display: "block", marginBottom: 8 }}>
                        Onboarding Info
                    </Text>
                    <Descriptions size="small" column={1} >
                        <Descriptions.Item label="Computer Comfort">
                            {student.Onboarding.computer_comfort}
                        </Descriptions.Item>
                        <Descriptions.Item label="Curious About">
                            {student.Onboarding.curious_activities}
                        </Descriptions.Item>
                        <Descriptions.Item label="Hardest to Learn">
                            {student.Onboarding.hardest_to_learn}
                        </Descriptions.Item>
                    </Descriptions>
                </>
            )}
        </Card>
    );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

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
                <div>
                    {/* Profile header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 20,
                            padding: "20px 0 16px",
                        }}
                    >
                        <Avatar
                            src={mentor.profile?.startsWith("http") ? mentor.profile : undefined}
                            icon={<UserOutlined />}
                            size={80}
                            style={{ border: "3px solid #e6f4ff", flexShrink: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                            <Title level={4} style={{ marginBottom: 2 }}>
                                {mentor.firstName} {mentor.lastName}
                            </Title>
                            {mentor.professionalTitle && (
                                <Tag color="blue" style={{ marginBottom: 8 }}>
                                    {mentor.professionalTitle}
                                </Tag>
                            )}
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    <MailOutlined style={{ marginRight: 6 }} />
                                    {mentor.email}
                                </Text>
                                {mentor.havealaptop !== undefined && (
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        <LaptopOutlined style={{ marginRight: 6 }} />
                                        {mentor.havealaptop ? "Has a Laptop" : "No Laptop"}
                                    </Text>
                                )}
                            </div>
                        </div>
                    </div>

                    <Divider style={{ margin: "0 0 16px" }} />

                    {/* Links */}
                    {(mentor.githubProfile || mentor.linkedInProfile) && (
                        <Space style={{ marginBottom: 16 }}>
                            {mentor.githubProfile && (
                                <a href={mentor.githubProfile} target="_blank" rel="noreferrer">
                                    <Tag icon={<GithubOutlined />} color="default">
                                        GitHub
                                    </Tag>
                                </a>
                            )}
                            {mentor.linkedInProfile && (
                                <a href={mentor.linkedInProfile} target="_blank" rel="noreferrer">
                                    <Tag icon={<LinkedinOutlined />} color="blue">
                                        LinkedIn
                                    </Tag>
                                </a>
                            )}
                        </Space>
                    )}

                    {/* Career directions */}
                    {mentor.careerDirections.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <Text strong style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
                                Career Directions
                            </Text>
                            <Space wrap>
                                {mentor.careerDirections.map((dir: any) => (
                                    <Tag key={dir} color={CAREER_COLORS[dir] ?? "geekblue"}>
                                        {dir}
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                    )}

                    {/* Stats */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 12,
                            marginTop: 8,
                        }}
                    >
                        {[
                            {
                                label: "Students",
                                value: mentor.assignedStudents.length,
                                color: "#1677ff",
                                icon: <TeamOutlined />,
                            },
                            {
                                label: "Career Tracks",
                                value: mentor.careerDirections.length,
                                color: "#52c41a",
                                icon: <StarOutlined />,
                            },
                            {
                                label: "Groups",
                                value: mentor.userGroup.length,
                                color: "#fa8c16",
                                icon: <BookOutlined />,
                            },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                style={{
                                    background: "#fafafa",
                                    borderRadius: 10,
                                    padding: "14px 16px",
                                    textAlign: "center",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                <div style={{ color: stat.color, fontSize: 20, marginBottom: 4 }}>
                                    {stat.icon}
                                </div>
                                <Title level={3} style={{ marginBottom: 2, color: stat.color }}>
                                    {stat.value}
                                </Title>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {stat.label}
                                </Text>
                            </div>
                        ))}
                    </div>
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
                        count={mentor.assignedStudents.length}
                        style={{ marginLeft: 6, backgroundColor: "#1677ff" }}
                    />
                </span>
            ),
            children:
                mentor.assignedStudents.length === 0 ? (
                    <Empty description="No students assigned yet" style={{ padding: "40px 0" }} />
                ) : (
                    <div style={{ paddingTop: 12 }}>
                        {mentor.assignedStudents.map((student: any) => (
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
            width={600}
            title={
                <Space>
                    <UserOutlined />
                    Mentor Details
                </Space>
            }
            styles={{ body: { maxHeight: "70vh", overflowY: "auto", paddingTop: 0 } }}
            destroyOnClose
        >
            <Tabs defaultActiveKey="overview" items={tabItems} />
        </Modal>
    );
};

export default MentorDetailsModal;