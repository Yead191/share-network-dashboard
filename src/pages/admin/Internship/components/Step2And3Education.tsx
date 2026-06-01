import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Divider,
  Button,
  Tag,
  Space,
  Typography,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

// ─── Step 2: Education ───────────────────────────────────────────────────────
export const Step2Education: React.FC<{ form: ReturnType<typeof Form.useForm>[0] }> = ({ form }) => {
  const status = Form.useWatch('currentStatus', form);

  return (
    <div>
      <Divider orientation="left" style={{ color: '#6b7280', fontSize: 13 }}>Education Details</Divider>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Form.Item
          label="Study Direction / Field of Study"
          name="studyDirection"
          rules={[{ required: true, message: 'Field of study is required' }]}
        >
          <Input placeholder="e.g. Software Engineering, Marketing" size="large" />
        </Form.Item>

        <Form.Item
          label="Institution / University"
          name="institution"
          rules={[{ required: true, message: 'Institution is required' }]}
        >
          <Input placeholder="e.g. HvA, TU Delft" size="large" />
        </Form.Item>
      </div>

      <Form.Item
        label="Current Status"
        name="currentStatus"
        rules={[{ required: true, message: 'Please select a status' }]}
      >
        <Select size="large" placeholder="Select status">
          <Select.Option value="studying">📚 Studying</Select.Option>
          <Select.Option value="graduated">🎓 Graduated</Select.Option>
          <Select.Option value="other">✏️ Other</Select.Option>
        </Select>
      </Form.Item>

      {status === 'other' && (
        <Form.Item
          label="Please specify"
          name="currentStatusOther"
          rules={[{ required: true, message: 'Please describe your status' }]}
        >
          <Input placeholder="Describe your current status…" size="large" />
        </Form.Item>
      )}

      {(status === 'studying' || status === 'other') && (
        <Form.Item label="Expected Graduation Date" name="expectedGraduation">
          <DatePicker
            style={{ width: '100%' }}
            size="large"
            picker="month"
            placeholder="Select month & year (optional)"
            format="MMM YYYY"
          />
        </Form.Item>
      )}
    </div>
  );
};

// ─── Step 3: Skills & Experience ─────────────────────────────────────────────
const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'];

export const Step3Skills: React.FC = () => {
  const [skillInput, setSkillInput] = useState('');

  return (
    <div>
      <Divider orientation="left" style={{ color: '#6b7280', fontSize: 13 }}>Skills & Experience</Divider>

      {/* Key Skills — tag-style */}
      <Form.Item
        label="Key Skills"
        name="keySkills"
        rules={[{ required: true, message: 'Add at least one skill' }]}
        extra={<Text type="secondary" style={{ fontSize: 12 }}>e.g. React, Python, Marketing, Logistics</Text>}
      >
        <Select
          mode="tags"
          size="large"
          style={{ width: '100%' }}
          placeholder="Type a skill and press Enter…"
          tokenSeparators={[',']}
          options={[
            { value: 'React', label: 'React' },
            { value: 'TypeScript', label: 'TypeScript' },
            { value: 'Python', label: 'Python' },
            { value: 'Marketing', label: 'Marketing' },
            { value: 'Data Analysis', label: 'Data Analysis' },
            { value: 'Logistics', label: 'Logistics' },
            { value: 'Design', label: 'Design' },
            { value: 'Finance', label: 'Finance' },
          ]}
        />
      </Form.Item>

      {/* Languages */}
      <Form.Item label="Languages Spoken" required>
        <Form.List name="languages">
          {(fields, { add, remove }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {fields.map(({ key, name, ...rest }) => (
                <Space key={key} style={{ display: 'flex', width: '100%' }} align="baseline">
                  <Form.Item
                    {...rest}
                    name={[name, 'language']}
                    rules={[{ required: true, message: 'Language required' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder="Language (e.g. Dutch)" size="large" style={{ width: 220 }} />
                  </Form.Item>
                  <Form.Item
                    {...rest}
                    name={[name, 'level']}
                    rules={[{ required: true, message: 'Level required' }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Select placeholder="Level" size="large" style={{ width: 120 }}>
                      {LANGUAGE_LEVELS.map((l) => (
                        <Select.Option key={l} value={l}>{l}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {fields.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  )}
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={() => add({ language: '', level: '' })}
                icon={<PlusOutlined />}
                style={{ width: 200 }}
              >
                Add Language
              </Button>
            </div>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="Relevant Work Experience" name="workExperience">
        <TextArea
          rows={3}
          placeholder="Brief summary of any relevant work or project experience…"
          size="large"
          showCount
          maxLength={500}
        />
      </Form.Item>

      <Form.Item label="Certifications" name="certifications">
        <TextArea
          rows={2}
          placeholder="e.g. AWS Certified, Google Analytics, ECDL… (optional)"
          size="large"
        />
      </Form.Item>
    </div>
  );
};
