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
} from '@ant-design/icons';
import type { InternshipRecord } from '../../../../types/internship.types';

const { Title, Text, Link } = Typography;
import { getImageUrl } from '../../../../utils/getImageUrl';

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

  const SectionTitle: React.FC<{ children: React.ReactNode; icon?: string }> = ({ children, icon }) => (
    <div style={{ marginTop: 32, marginBottom: 20 }}>
      <Title level={5} style={{
        margin: 0,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.5px',
        color: '#0f172a',
        textTransform: 'uppercase'
      }}>
        {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
        {children}
      </Title>
      <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #66D978, transparent)', marginTop: 8 }}></div>
    </div>
  );

  const Info: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
    <div style={{ marginBottom: 16 }}>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', fontWeight: 600, color: '#64748b', marginBottom: 4 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 14, color: '#1e293b', fontWeight: 500 }}>
        {value ?? <Text type="secondary">—</Text>}
      </Text>
    </div>
  );

  const InfoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px 32px',
      marginBottom: 4
    }}>
      {children}
    </div>
  );

  const PremiumCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: '20px 24px',
      marginTop: 12
    }}>
      {children}
    </div>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={700}
      title={null}
      closable={true}
      styles={{
        body: {
          padding: '0',
          background: '#ffffff'
        },
        header: {
          borderBottom: '1px solid #e2e8f0',
          padding: '24px 32px'
        }
      }}
      headerStyle={{
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      {/* Premium Header Section */}
      <div style={{ padding: '0 32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 24,
          paddingBottom: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar
              src={record.studentAvatar}
              icon={<UserOutlined />}
              size={64}
              style={{
                border: '3px solid #d4f8d8',
                boxShadow: '0 4px 12px rgba(102, 217, 120, 0.2)'
              }}
            />
            <div>
              <Title level={3} style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                {record.studentName}
              </Title>
              <Text type="secondary" style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                Internship Profile
              </Text>
            </div>
          </div>
          {isAdmin && onEdit ? (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={onEdit}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #66D978 0%, #4cb85f 100%)',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(102, 217, 120, 0.3)'
              }}
            >
              Edit Profile
            </Button>
          ) : null}
        </div>

        {/* Privacy badges */}
        <div style={{ marginBottom: 24 }}>
          <Space wrap style={{ gap: 8 }}>
            {record.consentToShare
              ? <Badge
                status="success"
                text={<Text style={{ fontSize: 12, fontWeight: 500 }}>Profile sharing: Consented</Text>}
              />
              : <Badge
                status="error"
                text={<Text style={{ fontSize: 12, fontWeight: 500 }}>Profile sharing: Not consented</Text>}
              />}
            {record.doNotShareContact && (
              <Tag color="orange" style={{ fontSize: 12, fontWeight: 500, border: 'none', background: '#fed7aa' }}>
                No contact sharing
              </Tag>
            )}
            {record.doNotSharePhoto && (
              <Tag color="orange" style={{ fontSize: 12, fontWeight: 500, border: 'none', background: '#fed7aa' }}>
                No photo sharing
              </Tag>
            )}
            {record.anonymousOnly && (
              <Tag color="red" style={{ fontSize: 12, fontWeight: 500, border: 'none', background: '#fecaca' }}>
                Anonymous only
              </Tag>
            )}
          </Space>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: '0 32px 32px' }}>
        {/* 1. Personal */}
        <SectionTitle icon="👤">Personal Information</SectionTitle>
        <InfoGrid>
          <Info label="Full Name" value={record.fullName} />
          <Info label="Date of Birth" value={record.dateOfBirth} />
          <Info
            label="Phone Number"
            value={
              record.phoneNumber ? (
                <Space size={6}><PhoneOutlined style={{ color: '#66D978' }} />{record.phoneNumber}</Space>
              ) : undefined
            }
          />
          <Info
            label="Email"
            value={
              record.email ? (
                <Space size={6}><MailOutlined style={{ color: '#66D978' }} /><Link href={`mailto:${record.email}`} style={{ color: '#66D978' }}>{record.email}</Link></Space>
              ) : undefined
            }
          />
          <Info
            label="Location"
            value={
              record.currentCity ? (
                <Space size={6}><EnvironmentOutlined style={{ color: '#66D978' }} />{record.currentCity}</Space>
              ) : undefined
            }
          />
        </InfoGrid>

        {(record.cv || record.cvFileUrl) && (
          <div style={{ marginTop: 16, marginBottom: 12 }}>
            <Button
              icon={<FilePdfOutlined />}
              href={getImageUrl(record.cv || record.cvFileUrl || "")}
              target="_blank"
              download
              style={{
                background: '#f0fdf4',
                color: '#66D978',
                border: '1px solid #bbf7d0',
                fontWeight: 600,
                borderRadius: 8
              }}
            >
              Download CV{record.cvFileName ? `: ${record.cvFileName}` : ''}
            </Button>
          </div>
        )}

        <Space wrap style={{ marginBottom: 12, gap: 8 }}>
          {record.linkedIn && (
            <Button
              icon={<LinkOutlined />}
              size="small"
              href={record.linkedIn}
              target="_blank"
              style={{
                background: '#ecf0f1',
                border: 'none',
                color: '#3b82f6',
                fontWeight: 500,
                borderRadius: 6
              }}
            >
              LinkedIn
            </Button>
          )}
          {record.portfolio && (
            <Button
              icon={<LinkOutlined />}
              size="small"
              href={record.portfolio}
              target="_blank"
              style={{
                background: '#ecf0f1',
                border: 'none',
                color: '#3b82f6',
                fontWeight: 500,
                borderRadius: 6
              }}
            >
              Portfolio
            </Button>
          )}
        </Space>

        {/* 2. Education */}
        <SectionTitle icon="📚">Education</SectionTitle>
        <InfoGrid>
          <Info label="Field of Study" value={record.studyDirection} />
          <Info label="Institution" value={record.institution} />
          <Info
            label="Current Status"
            value={
              <Tag color={record.currentStatus === 'graduated' ? 'green' : 'blue'} style={{ fontWeight: 500, borderRadius: 6 }}>
                {record.currentStatus === 'studying' ? '📚 Studying'
                  : record.currentStatus === 'graduated' ? '🎓 Graduated'
                    : `✏️ ${record.currentStatusOther ?? 'Other'}`}
              </Tag>
            }
          />
          {record.expectedGraduation && (
            <Info label="Expected Graduation" value={record.expectedGraduation} />
          )}
        </InfoGrid>

        {/* 3. Skills */}
        <SectionTitle icon="💡">Skills & Experience</SectionTitle>
        <div style={{ marginBottom: 20 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8, fontWeight: 600, color: '#64748b' }}>
            Key Skills
          </Text>
          <Space wrap style={{ gap: 8 }}>
            {record.keySkills?.map((s: string) => (
              <Tag key={s} color="green" style={{ fontWeight: 500, borderRadius: 6, border: 'none', background: '#dcfce7', color: '#166534' }}>
                {s}
              </Tag>
            ))}
          </Space>
        </div>
        <div style={{ marginBottom: 20 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8, fontWeight: 600, color: '#64748b' }}>
            Languages
          </Text>
          <Space wrap style={{ gap: 8 }}>
            {record.languages?.map((l: { language: string; level: string }, i: number) => (
              <Tag key={i} color="green" style={{ fontWeight: 500, borderRadius: 6, border: 'none', background: '#dcfce7', color: '#166534' }}>
                {l.language} — {l.level}
              </Tag>
            ))}
          </Space>
        </div>
        {record.workExperience && <Info label="Work Experience" value={record.workExperience} />}
        {record.certifications && <Info label="Certifications" value={record.certifications} />}

        {/* 4. Evaluation — Admin only */}
        {isAdmin && (
          <>
            <SectionTitle icon="⭐">Evaluation (Admin Only)</SectionTitle>
            <PremiumCard>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px 32px',
                marginBottom: 16
              }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Overall Score</Text>
                  <div style={{ marginTop: 8 }}>
                    <Title level={3} style={{
                      margin: '0 0 0 0',
                      color: '#66D978',
                      fontSize: 28,
                      fontWeight: 700,
                      display: 'inline'
                    }}>
                      {record.overallScore != null ? `${record.overallScore}` : '—'}
                    </Title>
                    <span style={{ fontSize: 18, color: '#64748b', fontWeight: 500, marginLeft: 4 }}>/10</span>
                  </div>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8, fontWeight: 600, color: '#64748b' }}>
                    Performance Rating
                  </Text>
                  {record.performanceRating ? (
                    <>
                      <Rate value={record.performanceRating} disabled count={5} style={{ fontSize: 20, color: '#66D978' }} />
                      <Text
                        style={{
                          display: 'block',
                          fontSize: 12,
                          color: RATING_LABELS[record.performanceRating]?.color,
                          marginTop: 6,
                          fontWeight: 600
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
            </PremiumCard>
          </>
        )}

        {/* 5 & 6. Residency & Asylum */}
        <SectionTitle icon="🏠">Residency & Status</SectionTitle>
        <InfoGrid>
          <Info
            label="Dutch Residency"
            value={<Tag color={record.hasDutchResidency ? 'green' : 'red'} style={{ fontWeight: 500, borderRadius: 6 }}>
              {record.hasDutchResidency ? 'Yes' : 'No'}
            </Tag>}
          />
          {record.workAuthStatus && (
            <Info
              label="Work Authorization"
              value={
                <Tag color={WORK_AUTH_LABELS[record.workAuthStatus]?.color} style={{ fontWeight: 500, borderRadius: 6 }}>
                  {WORK_AUTH_LABELS[record.workAuthStatus]?.label}
                </Tag>
              }
            />
          )}
          <Info
            label="Asylum Seeker"
            value={<Tag color={record.isAsylumSeeker ? 'orange' : 'default'} style={{ fontWeight: 500, borderRadius: 6 }}>
              {record.isAsylumSeeker ? 'Yes' : 'No'}
            </Tag>}
          />
          {record.asylumBackground && <Info label="Background" value={record.asylumBackground} />}
        </InfoGrid>

        {/* 7. Preferences */}
        <SectionTitle icon="🎯">Internship Preferences</SectionTitle>
        <InfoGrid>
          <Info
            label="Interested in Internship"
            value={<Tag color={record.interestedInInternship ? 'green' : 'red'} style={{ fontWeight: 500, borderRadius: 6 }}>
              {record.interestedInInternship ? 'Yes' : 'No'}
            </Tag>}
          />
          <Info
            label="Interested in Full-time"
            value={<Tag color={record.interestedInFullTime ? 'green' : 'default'} style={{ fontWeight: 500, borderRadius: 6 }}>
              {record.interestedInFullTime ? 'Yes' : 'No'}
            </Tag>}
          />
          <Info
            label="Preferred Fields"
            value={
              <Space wrap style={{ gap: 6 }}>
                {record.preferredFields?.map((f: string) => (
                  <Tag key={f} color="green" style={{ fontWeight: 500, borderRadius: 6, border: 'none', background: '#dcfce7', color: '#166534' }}>
                    {f}
                  </Tag>
                ))}
              </Space>
            }
          />
          <Info label="Preferred Location" value={record.preferredLocation} />
          <Info label="Available From" value={record.availabilityStartDate} />
          <Info
            label="Hours per Week"
            value={record.availabilityHoursPerWeek ? `${record.availabilityHoursPerWeek} hrs/wk` : undefined}
          />
        </InfoGrid>

        {/* 9. Notes — Admin only */}
        {isAdmin && record.additionalNotes && (
          <>
            <SectionTitle icon="📝">Admin Notes</SectionTitle>
            <Alert
              message={record.additionalNotes}
              type="warning"
              style={{
                borderRadius: 12,
                border: '1px solid #fcd34d',
                background: '#fffbeb'
              }}
            />
          </>
        )}

        <Divider style={{ margin: '32px 0 0 0', borderColor: '#e2e8f0' }} />
        <Text type="secondary" style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 16, display: 'block' }}>
          Created: {new Date(record.createdAt).toLocaleDateString()} ·
          Last updated: {new Date(record.updatedAt).toLocaleDateString()}
        </Text>
      </div>
    </Drawer>
  );
};
