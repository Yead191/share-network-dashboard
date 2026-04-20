import React, { useState } from "react";
import {
  Table,
  Input,
  Avatar,
  Tag,
  Button,
  Space,
  Typography,
  Badge,
  Tooltip,
  Card,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
  TeamOutlined,
  GithubOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import MentorDetailsModal from "./MentorDetailsModal";

const { Text } = Typography;

const CAREER_COLORS: Record<string, string> = {
  "App development": "blue",
  "Web Development": "cyan",
  "AI (Artificial Intelligence)": "purple",
  Cybersecurity: "red",
};
interface MentorTableProps {
  data: any[];
}

const MentorTable: React.FC<MentorTableProps> = ({ data }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = (mentor: any) => {
    setSelectedMentor(mentor);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMentor(null);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Mentor",
      key: "mentor",
      width: 220,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            src={
              record.profile?.startsWith("http") ? record.profile : undefined
            }
            icon={<UserOutlined />}
            size={40}
            style={{ border: "2px solid #e6f4ff", flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <Text strong style={{ display: "block", fontSize: 14 }}>
              {record.firstName} {record.lastName}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "professionalTitle",
      key: "professionalTitle",
      width: 160,
      render: (title?: string) =>
        title ? (
          <Tag color="blue" style={{ borderRadius: 4 }}>
            {title}
          </Tag>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            —
          </Text>
        ),
    },
    {
      title: "Career Directions",
      dataIndex: "careerDirections",
      key: "careerDirections",
      width: 260,
      render: (directions: string[]) =>
        directions.length > 0 ? (
          <Space wrap size={4}>
            {directions.map((dir) => (
              <Tag
                key={dir}
                color={CAREER_COLORS[dir] ?? "geekblue"}
                style={{ borderRadius: 4, fontSize: 11 }}
              >
                {dir}
              </Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            Not specified
          </Text>
        ),
    },
    {
      title: "Students",
      key: "students",
      width: 110,
      align: "center",
      sorter: (a, b) => a.assignedStudents.length - b.assignedStudents.length,
      render: (_, record) => (
        <Badge
          count={record.assignedStudents.length}
          showZero
          style={{ backgroundColor: record.assignedStudents.length > 0 ? "#1677ff" : "#d9d9d9" }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#f0f5ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <TeamOutlined style={{ color: "#1677ff", fontSize: 16 }} />
          </div>
        </Badge>
      ),
    },
    {
      title: "Students Preview",
      key: "studentsPreview",
      width: 160,
      render: (_, record) =>
        record.assignedStudents.length > 0 ? (
          <Avatar.Group maxCount={3} size={30}>
            {record.assignedStudents.map((s: any) => (
              <Tooltip
                key={s._id}
                title={`${s.firstName} ${s.lastName}`}
                placement="top"
              >
                <Avatar
                  src={s.profile?.startsWith("http") ? s.profile : undefined}
                  icon={<UserOutlined />}
                  size={30}
                  style={{ border: "2px solid #fff", cursor: "pointer" }}
                />
              </Tooltip>
            ))}
          </Avatar.Group>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            No students
          </Text>
        ),
    },
    {
      title: "Links",
      key: "links",
      width: 90,
      align: "center",
      render: (_, record) => (
        <Space size={4}>
          {record.githubProfile && (
            <Tooltip title="GitHub">
              <a href={record.githubProfile} target="_blank" rel="noreferrer">
                <Button
                  type="text"
                  size="small"
                  icon={<GithubOutlined />}
                  style={{ color: "#595959" }}
                />
              </a>
            </Tooltip>
          )}
          {record.linkedInProfile && (
            <Tooltip title="LinkedIn">
              <a href={record.linkedInProfile} target="_blank" rel="noreferrer">
                <Button
                  type="text"
                  size="small"
                  icon={<LinkedinOutlined />}
                  style={{ color: "#1677ff" }}
                />
              </a>
            </Tooltip>
          )}
          {!record.githubProfile && !record.linkedInProfile && (
            <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 110,
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
          style={{ borderRadius: 6 }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card
        style={{ borderRadius: 12 }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Header toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div>
            <Text strong style={{ fontSize: 16 }}>
              Assigned Mentors
            </Text>
            <Text type="secondary" style={{ marginLeft: 8, fontSize: 13 }}>
              {data?.length} of {data.length} mentors
            </Text>
          </div>
          <Input
            placeholder="Search by name, email, career or student..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 320, borderRadius: 8 }}
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} mentors`,
            style: { padding: "12px 20px" },
          }}
          scroll={{ x: 900 }}
          style={{ borderRadius: "0 0 12px 12px", overflow: "hidden" }}
          // rowHoverBg="#fafafa"
          locale={{
            emptyText: searchText
              ? `No mentors found matching "${searchText}"`
              : "No mentors available",
          }}
        />
      </Card>

      {/* Details Modal */}
      <MentorDetailsModal
        mentor={selectedMentor}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default MentorTable;