import React from 'react';
import { Typography, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { InternshipRecord } from '../../../../types/internship.types';

const { Text } = Typography;

interface InternshipStatsRowProps {
  records: InternshipRecord[];
  stats?: {
    totalProfiles: number;
    interestedInInternship: number;
    dutchResidency: number;
    averageScore: number;
    distribution?: {
      low: number;
      medium: number;
      good: number;
      excellent: number;
    };
  };
}

export const InternshipStatsRow: React.FC<InternshipStatsRowProps> = ({
  records,
  stats,
}) => {
  const total = stats?.totalProfiles ?? records.length;
  const interested = stats?.interestedInInternship ?? records.filter(r => r.interestedInInternship).length;
  const residency = stats?.dutchResidency ?? records.filter(r => r.hasDutchResidency).length;
  const avgScore = stats?.averageScore ?? (
    records.filter((r) => r.overallScore != null).length > 0
      ? Number((
        records
          .filter((r) => r.overallScore != null)
          .reduce((a, b) => a + (b.overallScore ?? 0), 0) /
        records.filter((r) => r.overallScore != null).length
      ).toFixed(1))
      : 0
  );

  const interestedPercent = total > 0 ? Math.round((interested / total) * 100) : 0;
  const residencyPercent = total > 0 ? Math.round((residency / total) * 100) : 0;

  // Default distribution if undefined
  const dist = stats?.distribution ?? {
    low: records.filter(r => (r.overallScore ?? 0) <= 5).length,
    medium: records.filter(r => (r.overallScore ?? 0) > 5 && (r.overallScore ?? 0) <= 7).length,
    good: records.filter(r => (r.overallScore ?? 0) > 7 && (r.overallScore ?? 0) <= 8.5).length,
    excellent: records.filter(r => (r.overallScore ?? 0) > 8.5).length,
  };

  const distTotal = dist.excellent + dist.good + dist.medium + dist.low;
  const eW = distTotal > 0 ? (dist.excellent / distTotal) * 100 : 0;
  const gW = distTotal > 0 ? (dist.good / distTotal) * 100 : 0;
  const mW = distTotal > 0 ? (dist.medium / distTotal) * 100 : 0;
  const lW = distTotal > 0 ? (dist.low / distTotal) * 100 : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
      
      {/* Total Profiles Card */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '20px 24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Profiles</Text>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59, 130, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserOutlined style={{ color: '#3b82f6', fontSize: 16 }} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#1f2937', lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>Registered candidate profiles</div>
        </div>
      </div>

      {/* Interested Card */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '20px 24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interested in Intern</Text>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139, 92, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#8b5cf6', fontSize: 16, fontWeight: 'bold' }}>✓</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#1f2937', lineHeight: 1 }}>{interested}</div>
            <Tag color="purple" style={{ borderRadius: 6, margin: 0, fontWeight: 600 }}>{interestedPercent}%</Tag>
          </div>
          <div style={{ width: '100%', height: 6, background: '#f3f4f6', borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
            <div style={{ width: `${interestedPercent}%`, height: '100%', background: '#8b5cf6', borderRadius: 3, transition: 'width 0.6s ease' }} />
          </div>
        </div>
      </div>

      {/* Dutch Residency Card */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '20px 24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dutch Residency</Text>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34, 197, 94, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#22c55e', fontSize: 16, fontWeight: 'bold' }}>⌂</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#1f2937', lineHeight: 1 }}>{residency}</div>
            <Tag color="success" style={{ borderRadius: 6, margin: 0, fontWeight: 600 }}>{residencyPercent}%</Tag>
          </div>
          <div style={{ width: '100%', height: 6, background: '#f3f4f6', borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
            <div style={{ width: `${residencyPercent}%`, height: '100%', background: '#22c55e', borderRadius: 3, transition: 'width 0.6s ease' }} />
          </div>
        </div>
      </div>

      {/* Average Score & Distribution Card */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '20px 24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minWidth: 260
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Overall Score</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fef3c7', padding: '2px 8px', borderRadius: 20 }}>
            <span style={{ color: '#d97706', fontSize: 12, fontWeight: 700 }}>★</span>
            <span style={{ color: '#d97706', fontSize: 12, fontWeight: 800 }}>{avgScore > 0 ? avgScore.toFixed(1) : '—'}</span>
          </div>
        </div>

        {/* Mini distribution bar chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#6b7280' }}>
            <span>Score Distribution</span>
            <span style={{ fontWeight: 600, color: '#374151' }}>
              E:{dist.excellent} G:{dist.good} M:{dist.medium} L:{dist.low}
            </span>
          </div>
          {/* Horizontal Segmented Bar */}
          <div style={{ width: '100%', height: 10, background: '#f3f4f6', borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
            <div title={`Excellent: ${dist.excellent}`} style={{ width: `${eW}%`, height: '100%', background: '#10b981', transition: 'width 0.4s' }} />
            <div title={`Good: ${dist.good}`} style={{ width: `${gW}%`, height: '100%', background: '#3b82f6', transition: 'width 0.4s' }} />
            <div title={`Medium: ${dist.medium}`} style={{ width: `${mW}%`, height: '100%', background: '#f59e0b', transition: 'width 0.4s' }} />
            <div title={`Low: ${dist.low}`} style={{ width: `${lW}%`, height: '100%', background: '#ef4444', transition: 'width 0.4s' }} />
          </div>
          
          {/* Legend indicator */}
          <div style={{ display: 'flex', gap: 10, fontSize: 9, color: '#9ca3af', marginTop: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Excellent
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} /> Good
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} /> Mid
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} /> Low
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
