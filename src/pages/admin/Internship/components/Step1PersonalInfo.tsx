import React, { useEffect, useState, useRef } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  Select,
  Avatar,
  Spin,
  Typography,
  Space,
  Divider,
  Tag,
} from 'antd';
import {
  UserOutlined,
  UploadOutlined,
  SearchOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { StudentFromApi } from '../../../../types/internship.types';
import { useGetStudentsQuery } from '../../../../redux/apiSlices/admin/adminStudentApi';

const { Text } = Typography;

interface Step1Props {
  form: ReturnType<typeof Form.useForm>[0];
  onStudentSelect: (student: StudentFromApi) => void;
  selectedStudent: StudentFromApi | null;
  cvFileList: UploadFile[];
  onCvChange: (files: UploadFile[]) => void;
}

export const Step1PersonalInfo: React.FC<Step1Props> = ({
  form,
  onStudentSelect,
  selectedStudent,
  cvFileList,
  onCvChange,
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(search), 350);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [search]);

  const { data, isFetching } = useGetStudentsQuery({
    searchTerm: debouncedSearch,
    limit: 20,
    page: 1,
  });

  const students: StudentFromApi[] = data?.data?.data ?? [];

  const handleStudentChange = (value: string) => {
    const student = students.find((s) => s._id === value || s.id === value);
    if (student) onStudentSelect(student);
  };

  return (
    <div className="step-section">
      {/* Student Selector */}
      <div
        style={{
          background: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)',
          border: '1px solid #91caff',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 28,
        }}
      >
        <Text strong style={{ display: 'block', marginBottom: 8, color: '#1d4ed8' }}>
          🔗 Import from existing student profile
        </Text>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
          Selecting a student will auto-fill Personal Info, Education and Skills sections. You can still edit everything manually.
        </Text>
        <Select
          showSearch
          allowClear
          style={{ width: '100%' }}
          placeholder="Search student by name or email…"
          filterOption={false}
          onSearch={setSearch}
          onChange={handleStudentChange}
          notFoundContent={isFetching ? <Spin size="small" /> : 'No students found'}
          value={selectedStudent?._id ?? undefined}
          size="large"
          suffixIcon={isFetching ? <Spin size="small" /> : <SearchOutlined />}
          optionLabelProp="label"
        >
          {students.map((s) => (
            <Select.Option
              key={s._id}
              value={s._id}
              label={`${s.firstName} ${s.lastName}`}
            >
              <Space>
                <Avatar src={s.profile} icon={<UserOutlined />} size={28} />
                <span>{s.firstName} {s.lastName}</span>
                <Tag color="blue" style={{ fontSize: 11 }}>{s.email}</Tag>
              </Space>
            </Select.Option>
          ))}
        </Select>

        {selectedStudent && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircleFilled style={{ color: '#22c55e' }} />
            <Text style={{ color: '#15803d', fontSize: 13 }}>
              Profile imported from <strong>{selectedStudent.firstName} {selectedStudent.lastName}</strong>. Fields are editable below.
            </Text>
          </div>
        )}
      </div>

      <Divider orientation="left" style={{ color: '#6b7280', fontSize: 13 }}>Personal Details</Divider>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Full name is required' }]}
        >
          <Input placeholder="e.g. Sara Al-Hassan" size="large" />
        </Form.Item>

        <Form.Item label="Date of Birth" name="dateOfBirth">
          <DatePicker
            style={{ width: '100%' }}
            size="large"
            placeholder="Select date (optional)"
            disabledDate={(d) => d && d > dayjs()}
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: 'Phone number is required' }]}
        >
          <Input placeholder="+31 6 12 34 56 78" size="large" />
        </Form.Item>

        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input placeholder="student@example.com" size="large" />
        </Form.Item>

        <Form.Item
          label="Current City / Location"
          name="currentCity"
          rules={[{ required: true, message: 'Location is required' }]}
        >
          <Input placeholder="e.g. Amsterdam" size="large" />
        </Form.Item>
      </div>

      <Form.Item label="Upload CV" name="cvFile" style={{ marginTop: 4 }}>
        <Upload
          fileList={cvFileList}
          beforeUpload={() => false}
          maxCount={1}
          accept=".pdf,.doc,.docx"
          onChange={({ fileList }) => onCvChange(fileList)}
        >
          <Button icon={<UploadOutlined />} size="large">
            {cvFileList.length ? 'Replace CV' : 'Upload CV (PDF, DOC)'}
          </Button>
        </Upload>
        {form.getFieldValue('cvFileName') && !cvFileList.length && (
          <Text type="secondary" style={{ fontSize: 12, marginTop: 6, display: 'block' }}>
            Existing CV: <strong>{form.getFieldValue('cvFileName')}</strong>
          </Text>
        )}
      </Form.Item>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Form.Item label="LinkedIn Profile" name="linkedIn">
          <Input placeholder="https://linkedin.com/in/…" size="large" />
        </Form.Item>

        <Form.Item label="Portfolio / Website" name="portfolio">
          <Input placeholder="https://yourportfolio.com" size="large" />
        </Form.Item>
      </div>
    </div>
  );
};
