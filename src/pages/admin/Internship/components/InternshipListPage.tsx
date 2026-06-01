import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Avatar,
  Tag,
  Space,
  Typography,
  Popconfirm,
  Rate,
  Tooltip,
  Badge,
  Empty,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { InternshipRecord } from '../../../../types/internship.types';

const { Title, Text } = Typography;

interface InternshipListPageProps {
  records: InternshipRecord[];
  isAdmin: boolean;
  loading: boolean;
  onCreateNew: () => void;
  onEdit: (record: InternshipRecord) => void;
  onView: (record: InternshipRecord) => void;
  onDelete: (id: string) => Promise<void>;
}

export const InternshipListPage: React.FC<InternshipListPageProps> = ({
  records,
  isAdmin,
  loading,
  onCreateNew,
  onEdit,
  onView,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.currentCity?.toLowerCase().includes(q) ||
      r.studyDirection?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    setDeleteLoadingId(id);
    await onDelete(id);
    setDeleteLoadingId(null);
    message.success('Internship profile deleted.');
  };

  const columns: ColumnsType<InternshipRecord> = [
    {
      title: 'Candidate',
      key: 'candidate',
      width: 220,
      fixed: 'left',
      render: (_, r) => (
        <Space>
          <Avatar
            src={r.studentAvatar}
            icon={<UserOutlined />}
            size={36}
            style={{ flexShrink: 0 }}
          />
          <div>
            <Text strong style={{ display: 'block', fontSize: 13 }}>{r.studentName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Field of Study',
      dataIndex: 'studyDirection',
      key: 'studyDirection',
      width: 160,
      render: (v) => v ?? <Text type="secondary">—</Text>,
    },
    {
      title: 'Location',
      dataIndex: 'currentCity',
      key: 'currentCity',
      width: 130,
      render: (v) => v ?? <Text type="secondary">—</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'currentStatus',
      key: 'currentStatus',
      width: 120,
      render: (v: string) => {
        const map: Record<string, { color: string; label: string }> = {
          studying: { color: 'blue', label: '📚 Studying' },
          graduated: { color: 'green', label: '🎓 Graduated' },
          other: { color: 'default', label: '✏️ Other' },
        };
        return <Tag color={map[v]?.color}>{map[v]?.label ?? v}</Tag>;
      },
    },
    {
      title: 'Rating',
      dataIndex: 'performanceRating',
      key: 'performanceRating',
      width: 140,
      render: (v) =>
        v ? (
          <Rate value={v} disabled count={5} style={{ fontSize: 13 }} />
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Score',
      dataIndex: 'overallScore',
      key: 'overallScore',
      width: 80,
      align: 'center',
      render: (v) =>
        v != null ? (
          <Tag color={v >= 8 ? 'green' : v >= 6 ? 'blue' : v >= 4 ? 'orange' : 'red'}>
            {v}/10
          </Tag>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Residency',
      dataIndex: 'hasDutchResidency',
      key: 'hasDutchResidency',
      width: 110,
      render: (v: boolean) => (
        <Badge
          status={v ? 'success' : 'error'}
          text={<Text style={{ fontSize: 12 }}>{v ? 'Dutch' : 'No'}</Text>}
        />
      ),
    },
    {
      title: 'Preferences',
      key: 'preferences',
      width: 140,
      render: (_, r) => (
        <Space size={4}>
          {r.interestedInInternship && <Tag color="purple" style={{ fontSize: 11 }}>Internship</Tag>}
          {r.interestedInFullTime && <Tag color="geekblue" style={{ fontSize: 11 }}>Full-time</Tag>}
        </Space>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (v) => <Text style={{ fontSize: 12 }}>{new Date(v).toLocaleDateString()}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      fixed: 'right',
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="View Profile">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onView(r)}
            />
          </Tooltip>

          {isAdmin && (
            <>
              <Tooltip title="Edit">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => onEdit(r)}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Popconfirm
                  title="Delete this internship profile?"
                  description="This action cannot be undone."
                  onConfirm={() => handleDelete(r.id)}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  cancelText="Cancel"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    loading={deleteLoadingId === r.id}
                  />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div >
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <Title level={3} style={{ margin: 0, color: '#111827' }}>
              🎓 Internship Profiles
            </Title>
            <Text type="secondary">
              {isAdmin
                ? 'Manage candidate internship profiles. Only visible to Admins and assigned Coordinators.'
                : 'View candidate internship profiles assigned to you.'}
            </Text>
          </div>

          {isAdmin && (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={onCreateNew}
              style={{ borderRadius: 8 }}
            >
              New Profile
            </Button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Profiles', value: records.length, color: '#3b82f6' },
          {
            label: 'Interested in Internship',
            value: records.filter((r) => r.interestedInInternship).length,
            color: '#8b5cf6',
          },
          {
            label: 'Dutch Residency',
            value: records.filter((r) => r.hasDutchResidency).length,
            color: '#22c55e',
          },
          {
            label: 'Avg Score',
            value:
              records.filter((r) => r.overallScore != null).length > 0
                ? (
                  records
                    .filter((r) => r.overallScore != null)
                    .reduce((a, b) => a + (b.overallScore ?? 0), 0) /
                  records.filter((r) => r.overallScore != null).length
                ).toFixed(1)
                : '—',
            color: '#f59e0b',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '14px 20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              borderLeft: `4px solid ${stat.color}`,
              minWidth: 140,
            }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>{stat.label}</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        {/* Toolbar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 12 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            placeholder="Search by name, email, city, field of study…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 380, borderRadius: 8 }}
            allowClear
          />
          <Text type="secondary" style={{ alignSelf: 'center', marginLeft: 'auto', fontSize: 13 }}>
            {filtered.length} {filtered.length === 1 ? 'profile' : 'profiles'}
          </Text>
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} profiles`,
          }}
          locale={{
            emptyText: (
              <Empty
                description={
                  search
                    ? `No profiles matching "${search}"`
                    : isAdmin
                      ? 'No internship profiles yet. Click "New Profile" to create one.'
                      : 'No internship profiles have been assigned to you yet.'
                }
                style={{ padding: '40px 0' }}
              />
            ),
          }}
          onRow={(r) => ({
            style: { cursor: 'pointer' },
            onDoubleClick: () => onView(r),
          })}
        />
      </div>
    </div>
  );
};
