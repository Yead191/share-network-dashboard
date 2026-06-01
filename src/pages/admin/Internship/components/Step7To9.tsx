import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Checkbox,
  DatePicker,
  Divider,
  Typography,
  Alert,
} from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

// ─── Step 7: Internship / Job Preferences ────────────────────────────────────
export const Step7Preferences: React.FC = () => {
  return (
    <div>
      <Divider orientation="left" style={{ color: '#6b7280', fontSize: 13 }}>Internship / Job Preferences</Divider>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Form.Item
          label="Interested in Internship?"
          name="interestedInInternship"
          rules={[{ required: true, message: 'Please select' }]}
        >
          <Radio.Group size="large">
            <Radio.Button value={true}>Yes</Radio.Button>
            <Radio.Button value={false}>No</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Interested in Full-time Role?"
          name="interestedInFullTime"
          rules={[{ required: true, message: 'Please select' }]}
        >
          <Radio.Group size="large">
            <Radio.Button value={true}>Yes</Radio.Button>
            <Radio.Button value={false}>No</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </div>

      <Form.Item
        label="Preferred Field(s)"
        name="preferredFields"
        extra={<Text type="secondary" style={{ fontSize: 12 }}>Select one or more, or type your own</Text>}
      >
        <Select
          mode="tags"
          size="large"
          placeholder="e.g. IT, Finance, Engineering, Healthcare…"
          tokenSeparators={[',']}
          options={[
            { value: 'IT', label: 'IT' },
            { value: 'Finance', label: 'Finance' },
            { value: 'Engineering', label: 'Engineering' },
            { value: 'Healthcare', label: 'Healthcare' },
            { value: 'Marketing', label: 'Marketing' },
            { value: 'Logistics', label: 'Logistics' },
            { value: 'Education', label: 'Education' },
            { value: 'Legal', label: 'Legal' },
          ]}
        />
      </Form.Item>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Form.Item label="Preferred Location" name="preferredLocation">
          <Input placeholder="e.g. Amsterdam, Rotterdam, Remote" size="large" />
        </Form.Item>

        <Form.Item label="Availability — Hours per Week" name="availabilityHoursPerWeek">
          <InputNumber
            min={1}
            max={40}
            placeholder="e.g. 32"
            size="large"
            style={{ width: '100%' }}
            addonAfter="hrs/wk"
          />
        </Form.Item>

        <Form.Item label="Availability — Start Date" name="availabilityStartDate">
          <DatePicker
            style={{ width: '100%' }}
            size="large"
            placeholder="When can they start?"
          />
        </Form.Item>
      </div>
    </div>
  );
};

// ─── Step 8: Compliance & Privacy ────────────────────────────────────────────
export const Step8Compliance: React.FC = () => {
  return (
    <div>
      <Alert
        message="Privacy & Compliance"
        description="These settings control what information can be shared with partner companies. Please review carefully before submitting."
        type="info"
        showIcon
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      <Divider orientation="left" style={{ color: '#6b7280', fontSize: 13 }}>Consent & Visibility</Divider>

      <Form.Item
        label="Consent to share profile with companies?"
        name="consentToShare"
        rules={[{ required: true, message: 'Please select' }]}
        valuePropName="value"
      >
        <Radio.Group size="large">
          <Radio.Button value={true}>✅ Yes — consent given</Radio.Button>
          <Radio.Button value={false}>❌ No — do not share</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Visibility Restrictions" style={{ marginBottom: 0 }}>
        <div style={{
          background: '#fafafa',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <Form.Item name="doNotShareContact" valuePropName="checked" noStyle>
            <Checkbox>
              <Text>🚫 Do <strong>NOT</strong> share personal contact details (phone, email)</Text>
            </Checkbox>
          </Form.Item>
          <Form.Item name="doNotSharePhoto" valuePropName="checked" noStyle>
            <Checkbox>
              <Text>🖼️ Do <strong>NOT</strong> share photo / profile picture</Text>
            </Checkbox>
          </Form.Item>
          <Form.Item name="anonymousOnly" valuePropName="checked" noStyle>
            <Checkbox>
              <Text>👤 Anonymous profile only — do not reveal identity</Text>
            </Checkbox>
          </Form.Item>
        </div>
      </Form.Item>
    </div>
  );
};

// ─── Step 9: Additional Notes ─────────────────────────────────────────────────
export const Step9Notes: React.FC = () => {
  return (
    <div>
      <Alert
        message="Internal Notes — Admin Only"
        description="These notes are for internal admin use and will never be shared externally."
        type="warning"
        showIcon
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      <Divider orientation="left" style={{ color: '#6b7280', fontSize: 13 }}>Additional Notes</Divider>

      <Form.Item name="additionalNotes">
        <TextArea
          rows={8}
          placeholder="Add any internal remarks, observations, or context about this candidate…"
          size="large"
          showCount
          maxLength={1000}
        />
      </Form.Item>
    </div>
  );
};
