import { useState } from "react";
import {
  Table,
  Input,
  Avatar,
  Tag,
  Button,
  Space,
  Typography,
  Tooltip,
  Card,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../../components/shared/Spinner";
import { useProfileQuery } from "../../../../redux/apiSlices/authSlice";

const { Text } = Typography;

const MentorTable = () => {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useProfileQuery({});

  const navigate = useNavigate();

  const mentors = data?.data?.assignedMentors || [];
  const handleViewDetails = (mentor: any) => {
    navigate(`/mentor-coordinator/mentors/${mentor._id}`);
  };

  const filteredData = mentors?.filter((mentor: any) => {
    const searchLower = searchText.toLowerCase();
    const fullName = `${mentor.firstName} ${mentor.lastName}`.toLowerCase();
    const email = mentor.email?.toLowerCase() || "";
    const group = mentor.userGroup?.map((g: any) => g.name.toLowerCase()).join(" ") || "";
    const track = mentor.userGroupTrack?.name?.toLowerCase() || "";
    const company = mentor.company?.toLowerCase() || "";

    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      group.includes(searchLower) ||
      track.includes(searchLower) ||
      company.includes(searchLower)
    );
  });

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
      title: "Groups",
      dataIndex: "userGroup",
      key: "userGroup",
      width: 180,
      render: (groups: any[]) => (
        <Space wrap size={4}>
          {groups?.map((group) => (
            <Tag key={group._id} color="blue" style={{ borderRadius: 4, fontSize: 11 }}>
              {group.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Track",
      dataIndex: "userGroupTrack",
      key: "userGroupTrack",
      width: 120,
      render: (track: any) => (
        <Tag color="purple" style={{ borderRadius: 4, fontSize: 11 }}>
          {track?.name || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Company Name",
      dataIndex: "company",
      key: "company",
      width: 150,
      render: (company?: string) => company || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag
          color={status === "ACTIVE" ? "success" : "error"}
          style={{ borderRadius: 4, fontSize: 11 }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Students Preview",
      key: "studentsPreview",
      width: 160,
      render: (_, record) =>
        record?.assignedStudents?.length > 0 ? (
          <Avatar.Group max={{ count: 3 }} size={30}>
            {record?.assignedStudents?.map((s: any) => (
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
  if (isLoading) {
    return <Spinner />
  }
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
              {data?.length} of {data?.length} mentors
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
          dataSource={filteredData}
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
    </>
  );
};

export default MentorTable;