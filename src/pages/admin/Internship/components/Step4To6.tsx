import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Rate,
  Radio,
  Select,
  Divider,
  Typography,
  Alert,
} from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

const RATING_LABELS = ['Very weak', 'Below average', 'Average', 'Strong', 'Excellent'];

// ─── Step 4: Evaluation ───────────────────────────────────────────────────────
export const Step4Evaluation: React.FC = () => {
  return (
    <div>
      <Alert
        message="Admin Only Section"
        description="This evaluation data is visible only to Admins and will not be shown to the student."
        type="warning"
        showIcon
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      <Divider orientation="left" style={{ color: '#6b7280', fontSize: 13 }}>Evaluation</Divider>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Form.Item
          label="Overall Score (out of 10)"
          name="overallScore"
          extra={<Text type="secondary" style={{ fontSize: 12 }}>Enter a score from 1 to 10</Text>}
        >
          <InputNumber
            min={1}
            max={10}
            step={0.5}
            placeholder="e.g. 7.5"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Performance Rating" name="performanceRating">
          <Rate
            count={5}
            style={{ fontSize: 28, color: '#f59e0b' }}
            character={({ index }: { index?: number }) => (
              <span style={{ fontSize: 28 }}>⭐</span>
            )}
          />
          <Form.Item noStyle shouldUpdate={(p, c) => p.performanceRating !== c.performanceRating}>
            {({ getFieldValue }) => {
              const r = getFieldValue('performanceRating');
              return r ? (
                <Text style={{ display: 'block', marginTop: 4, color: '#6b7280', fontSize: 13 }}>
                  {r} – {RATING_LABELS[r - 1]}
                </Text>
              ) : null;
            }}
          </Form.Item>
        </Form.Item>
      </div>

      <Form.Item label="Strengths" name="strengths">
        <TextArea
          rows={3}
          placeholder="What does this candidate do particularly well?"
          size="large"
          showCount
          maxLength={300}
        />
      </Form.Item>

      <Form.Item label="Areas for Improvement" name="areasForImprovement">
        <TextArea
          rows={3}
          placeholder="What should this candidate work on?"
          size="large"
          showCount
          maxLength={300}
        />
      </Form.Item>
    </div>
  );
};

// ─── Step 5: Residency Status ─────────────────────────────────────────────────
export const Step5Residency: React.FC = () => {
  return (
    <div>
      <Divider orientation="left" style={{ color: '#6b7280', fontSize: 13 }}>Residency Status</Divider>

      <Form.Item
        label="Does the candidate have Dutch residency status?"
        name="hasDutchResidency"
        rules={[{ required: true, message: 'Please select an option' }]}
      >
        <Radio.Group size="large">
          <Radio.Button value={true}>✅ Yes</Radio.Button>
          <Radio.Button value={false}>❌ No</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Work Authorization Status" name="workAuthStatus">
        <Select size="large" placeholder="Select work authorization (optional)" allowClear>
          <Select.Option value="fully_allowed">✅ Fully allowed to work</Select.Option>
          <Select.Option value="limited">⚠️ Limited work permit</Select.Option>
          <Select.Option value="not_allowed">🚫 Not allowed to work yet</Select.Option>
        </Select>
      </Form.Item>

      <Divider orientation="left" style={{ color: '#6b7280', fontSize: 13 }}>Asylum Status</Divider>

      <Form.Item
        label="Is the candidate an asylum seeker?"
        name="isAsylumSeeker"
        rules={[{ required: true, message: 'Please select an option' }]}
      >
        <Radio.Group size="large">
          <Radio.Button value={true}>Yes</Radio.Button>
          <Radio.Button value={false}>No</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prev, cur) => prev.isAsylumSeeker !== cur.isAsylumSeeker}
      >
        {({ getFieldValue }) =>
          getFieldValue('isAsylumSeeker') === false ? (
            <Form.Item
              label="If No, please explain background"
              name="asylumBackground"
            >
              <TextArea
                rows={3}
                placeholder="Briefly describe the candidate's background or immigration context…"
                size="large"
              />
            </Form.Item>
          ) : null
        }
      </Form.Item>
    </div>
  );
};
