import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Avatar,
  Tag,
  Space,
  Typography,
  Rate,
  Badge,
  Empty,
  Dropdown,
  Select,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { InternshipRecord } from '../../../../types/internship.types';
import { getImageUrl } from '../../../../utils/getImageUrl';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { InternshipStatsRow } from './InternshipStatsRow';

const { Title, Text } = Typography;

interface InternshipListPageProps {
  records: InternshipRecord[];
  isAdmin: boolean;
  loading: boolean;
  onCreateNew: () => void;
  onEdit: (record: InternshipRecord) => void;
  onView: (record: InternshipRecord) => void;
  onDelete: (id: string) => Promise<void>;
  setSearch: (value: string) => void;
  search: string;
  setPage: (page: number) => void;
  stats?: {
    totalProfiles: number;
    interestedInInternship: number;
    dutchResidency: number;
    graduatedStudents: number
    averageScore: number;
    distribution?: {
      low: number;
      medium: number;
      good: number;
      excellent: number;
    };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  setSortBy: (value: string | undefined) => void;
  setSortOrder: (value: 'asc' | 'desc' | undefined) => void;
}

export const InternshipListPage: React.FC<InternshipListPageProps> = ({
  records,
  isAdmin,
  loading,
  onCreateNew,
  onEdit,
  onView,
  onDelete,
  stats,
  setSearch,
  search,
  pagination,
  setPage,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}) => {

  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<InternshipRecord | null>(null);

  const handleDeleteClick = (record: InternshipRecord) => {
    setRecordToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    const id = recordToDelete.id || recordToDelete._id || '';
    setDeleteLoadingId(id);
    try {
      await onDelete(id);
      setDeleteModalVisible(false);
      setRecordToDelete(null);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setRecordToDelete(null);
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
      title: 'CV',
      key: 'cv',
      width: 110,
      render: (_, r) => {
        const cvPath = r.cv || r.cvFileUrl;
        return cvPath ? (
          <Button
            type="link"
            icon={<FilePdfOutlined />}
            href={getImageUrl(cvPath)}
            target="_blank"
            download
            style={{ padding: 0 }}
          >
            Download
          </Button>
        ) : (
          <Text type="secondary">—</Text>
        );
      },
    },
    {
      title: 'Rating',
      dataIndex: 'performanceRating',
      key: 'performanceRating',
      width: 140,
      sorter: true,
      sortOrder: sortBy === 'performanceRating' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : undefined,
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
      sorter: true,
      sortOrder: sortBy === 'overallScore' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : undefined,
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
      width: 90,
      fixed: 'right',
      align: 'center',
      render: (_, r) => {
        const items: MenuProps['items'] = [
          {
            key: 'view',
            icon: <EyeOutlined style={{ fontSize: 14 }} />,
            label: 'View Profile',
            onClick: () => onView(r),
          },
          ...(r.cv || r.cvFileUrl
            ? [
              {
                key: 'download',
                icon: <DownloadOutlined style={{ fontSize: 14 }} />,
                label: (
                  <a
                    href={getImageUrl(r.cv || r.cvFileUrl || '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    Download CV
                  </a>
                ),
              },
            ]
            : []),
          ...(isAdmin
            ? [
              { type: 'divider' as const },
              {
                key: 'edit',
                icon: <EditOutlined style={{ fontSize: 14 }} />,
                label: 'Edit Profile',
                onClick: () => onEdit(r),
              },
              {
                key: 'delete',
                icon: <DeleteOutlined style={{ fontSize: 14 }} />,
                label: deleteLoadingId === (r.id || r._id) ? 'Deleting…' : 'Delete Profile',
                danger: true,
                onClick: () => handleDeleteClick(r),
              },
            ]
            : []),
        ];

        return (
          <Dropdown
            menu={{
              items,
              style: {
                minWidth: 180,
                borderRadius: 10,
                padding: '6px 0',
                boxShadow: '0 6px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
              },
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined style={{ fontSize: 18, fontWeight: 700 }} />}
              size="small"
              style={{
                borderRadius: 8,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            />
          </Dropdown>
        );
      },
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
      <InternshipStatsRow records={records} stats={stats} />

      {/* Table Card */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        {/* Toolbar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            placeholder="Search by name, email, city, field of study…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 380, borderRadius: 8, height: 40 }}
            allowClear
          />
          <Select
            placeholder="Sort by"
            style={{ width: 220, height: 40 }}
            allowClear
            value={sortBy && sortOrder ? `${sortBy}_${sortOrder}` : undefined}
            onChange={(value) => {
              if (value) {
                const [field, order] = value.split('_');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              } else {
                setSortBy(undefined);
                setSortOrder(undefined);
              }
            }}
            options={[
              { value: 'overallScore_desc', label: 'Overall Score (Highest)' },
              { value: 'overallScore_asc', label: 'Overall Score (Lowest)' },
              { value: 'performanceRating_desc', label: 'Overall Rating (Highest)' },
              { value: 'performanceRating_asc', label: 'Overall Rating (Lowest)' },
            ]}
          />
          <Text type="secondary" style={{ alignSelf: 'center', marginLeft: 'auto', fontSize: 13 }}>
            Showing {records.length} {records.length === 1 ? 'profile' : 'profiles'}
          </Text>
        </div>

        <Table
          columns={columns}
          dataSource={records}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: pagination?.limit,
            total: pagination?.total,
            current: pagination?.page,
            showTotal: (total) => `Total ${total} profiles`,
            onChange: (page) => setPage(page),
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
          onChange={(sorter: any) => {
            if (sorter && sorter.field && sorter.order) {
              setSortBy(sorter.field);
              setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
            } else {
              setSortBy(undefined);
              setSortOrder(undefined);
            }
          }}
          onRow={(r) => ({
            style: { cursor: 'pointer' },
            onDoubleClick: () => onView(r),
          })}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <DeleteConfirmationModal
          open={deleteModalVisible}
          recordName={recordToDelete.studentName}
          recordEmail={recordToDelete.email}
          recordAvatar={recordToDelete.studentAvatar}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          loading={deleteLoadingId === (recordToDelete.id || recordToDelete._id)}
        />
      )}
    </div>
  );
};
