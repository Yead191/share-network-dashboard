import React from 'react';
import {
  Drawer,
  Avatar,
  Tag,
  Typography,
  Divider,
  Rate,
  Space,
  Button,
  Descriptions,
  Alert,
  Badge,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  LinkOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FilePdfOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type { InternshipRecord } from '../types/internship.types';

const { Title, Text, Link } = Typography;

const RATING_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Very weak', color: '#ef4444' },
  2: { label: 'Below average', color: '#f97316' },
  3: { label: 'Average', color: '#eab308' },
  4: { label: 'Strong', color: '#22c55e' },
  5: { label: 'Excellent', color: '#6366f1' },
};

const WORK_AUTH_LABELS: Record<string, { label: string; color: string }> = {
  fully_allowed: { label: 'Fully allowed to work', color: 'green' },
  limited: { label: 'Limited work permit', color: 'orange' },
  not_allowed: { label: 'Not allowed to work yet', color: 'red' },
};

interface InternshipDetailDrawerProps {
  record: InternshipRecord | null;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  isAdmin: boolean;
}

export const InternshipDetailDrawer: React.FC<InternshipDetailDrawerProps> = ({
  record,
  open,
  onClose,
  onEdit,
  isAdmin,
}) => {
  if (!record) return null;

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Divider orientation="left" style={{ color: '#6b7280', fontSize: 13, marginTop: 24 }}>
      {children}
    </Divider>
  );

  const Info: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
    <div style={{ marginBottom: 12 }}>
      <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{label}</Text>
      <Text style={{ fontSize: 14 }}>{value ?? <Text type="secondary">—</Text>}</Text>
    </div>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={640}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar src={record.studentAvatar} icon={<UserOutlined />} size={38} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{record.studentName}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>Internship Profile</Text>
          </div>
        </div>
      }
      extra={
        isAdmin && onEdit ? (
          <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
            Edit Profile
          </Button>
        ) : null
      }
      styles={{ body: { padding: '12px 24px 32px' } }}
    >
      {/* Privacy badges */}
      <Space wrap style={{ marginBottom: 8 }}>
        {record.consentToShare
          ? <Badge status="success" text={<Text style={{ fontSize: 12 }}>Profile sharing: Consented</Text>} />
          : <Badge status="error" text={<Text style={{ fontSize: 12 }}>Profile sharing: Not consented</Text>} />}
        {record.doNotShareContact && <Tag color="orange" style={{ fontSize: 11 }}>No contact sharing</Tag>}
        {record.doNotSharePhoto && <Tag color="orange" style={{ fontSize: 11 }}>No photo sharing</Tag>}
        {record.anonymousOnly && <Tag color="red" style={{ fontSize: 11 }}>Anonymous only</Tag>}
      </Space>

      {/* 1. Personal */}
      <SectionTitle>👤 Personal Information</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Info label="Full Name" value={record.fullName} />
        <Info label="Date of Birth" value={record.dateOfBirth} />
        <Info
          label="Phone Number"
          value={
            record.phoneNumber ? (
              <Space><PhoneOutlined />{record.phoneNumber}</Space>
            ) : undefined
          }
        />
        <Info
          label="Email"
          value={
            record.email ? (
              <Space><MailOutlined /><Link href={`mailto:${record.email}`}>{record.email}</Link></Space>
            ) : undefined
          }
        />
        <Info
          label="Location"
          value={
            record.currentCity ? (
              <Space><EnvironmentOutlined />{record.currentCity}</Space>
            ) : undefined
          }
        />
      </div>

      {record.cvFileUrl && (
        <Button
          icon={<FilePdfOutlined />}
          href={record.cvFileUrl}
          target="_blank"
          style={{ marginBottom: 8 }}
        >
          View CV: {record.cvFileName}
        </Button>
      )}

      <Space wrap style={{ marginTop: 4 }}>
        {record.linkedIn && (
          <Button icon={<LinkOutlined />} size="small" href={record.linkedIn} target="_blank">
            LinkedIn
          </Button>
        )}
        {record.portfolio && (
          <Button icon={<LinkOutlined />} size="small" href={record.portfolio} target="_blank">
            Portfolio
          </Button>
        )}
      </Space>

      {/* 2. Education */}
      <SectionTitle>📚 Education</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Info label="Field of Study" value={record.studyDirection} />
        <Info label="Institution" value={record.institution} />
        <Info
          label="Current Status"
          value={
            <Tag color={record.currentStatus === 'graduated' ? 'green' : 'blue'}>
              {record.currentStatus === 'studying' ? '📚 Studying'
                : record.currentStatus === 'graduated' ? '🎓 Graduated'
                : `✏️ ${record.currentStatusOther ?? 'Other'}`}
            </Tag>
          }
        />
        {record.expectedGraduation && (
          <Info label="Expected Graduation" value={record.expectedGraduation} />
        )}
      </div>

      {/* 3. Skills */}
      <SectionTitle>💡 Skills & Experience</SectionTitle>
      <div style={{ marginBottom: 12 }}>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>Key Skills</Text>
        <Space wrap>
          {record.keySkills?.map((s) => <Tag key={s} color="blue">{s}</Tag>)}
        </Space>
      </div>
      <div style={{ marginBottom: 12 }}>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>Languages</Text>
        <Space wrap>
          {record.languages?.map((l, i) => (
            <Tag key={i} color="cyan">{l.language} — {l.level}</Tag>
          ))}
        </Space>
      </div>
      {record.workExperience && <Info label="Work Experience" value={record.workExperience} />}
      {record.certifications && <Info label="Certifications" value={record.certifications} />}

      {/* 4. Evaluation — Admin only */}
      {isAdmin && (
        <>
          <SectionTitle>⭐ Evaluation (Admin Only)</SectionTitle>
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 10,
            padding: '16px 20px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px', marginBottom: 12 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Overall Score</Text>
                <Title level={4} style={{ margin: 0, color: '#d97706' }}>
                  {record.overallScore != null ? `${record.overallScore} / 10` : '—'}
                </Title>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Performance Rating
                </Text>
                {record.performanceRating ? (
                  <>
                    <Rate value={record.performanceRating} disabled count={5} style={{ fontSize: 18 }} />
                    <Text
                      style={{
                        display: 'block',
                        fontSize: 12,
                        color: RATING_LABELS[record.performanceRating]?.color,
                        marginTop: 2,
                      }}
                    >
                      {RATING_LABELS[record.performanceRating]?.label}
                    </Text>
                  </>
                ) : <Text type="secondary">—</Text>}
              </div>
            </div>
            {record.strengths && <Info label="Strengths" value={record.strengths} />}
            {record.areasForImprovement && <Info label="Areas for Improvement" value={record.areasForImprovement} />}
          </div>
        </>
      )}

      {/* 5 & 6. Residency & Asylum */}
      <SectionTitle>🏠 Residency & Status</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Info
          label="Dutch Residency"
          value={<Tag color={record.hasDutchResidency ? 'green' : 'red'}>
            {record.hasDutchResidency ? 'Yes' : 'No'}
          </Tag>}
        />
        {record.workAuthStatus && (
          <Info
            label="Work Authorization"
            value={
              <Tag color={WORK_AUTH_LABELS[record.workAuthStatus]?.color}>
                {WORK_AUTH_LABELS[record.workAuthStatus]?.label}
              </Tag>
            }
          />
        )}
        <Info
          label="Asylum Seeker"
          value={<Tag color={record.isAsylumSeeker ? 'orange' : 'default'}>
            {record.isAsylumSeeker ? 'Yes' : 'No'}
          </Tag>}
        />
        {record.asylumBackground && <Info label="Background" value={record.asylumBackground} />}
      </div>

      {/* 7. Preferences */}
      <SectionTitle>🎯 Internship Preferences</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Info
          label="Interested in Internship"
          value={<Tag color={record.interestedInInternship ? 'green' : 'red'}>
            {record.interestedInInternship ? 'Yes' : 'No'}
          </Tag>}
        />
        <Info
          label="Interested in Full-time"
          value={<Tag color={record.interestedInFullTime ? 'green' : 'default'}>
            {record.interestedInFullTime ? 'Yes' : 'No'}
          </Tag>}
        />
        <Info
          label="Preferred Fields"
          value={
            <Space wrap>
              {record.preferredFields?.map((f) => <Tag key={f} color="purple">{f}</Tag>)}
            </Space>
          }
        />
        <Info label="Preferred Location" value={record.preferredLocation} />
        <Info label="Available From" value={record.availabilityStartDate} />
        <Info
          label="Hours per Week"
          value={record.availabilityHoursPerWeek ? `${record.availabilityHoursPerWeek} hrs/wk` : undefined}
        />
      </div>

      {/* 9. Notes — Admin only */}
      {isAdmin && record.additionalNotes && (
        <>
          <SectionTitle>📝 Admin Notes</SectionTitle>
          <Alert
            message={record.additionalNotes}
            type="warning"
            style={{ borderRadius: 8 }}
          />
        </>
      )}

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Created: {new Date(record.createdAt).toLocaleDateString()} ·
          Last updated: {new Date(record.updatedAt).toLocaleDateString()}
        </Text>
      </div>
    </Drawer>
  );
};
