import React, { useEffect, useState } from 'react';
import {
  Form,
  Steps,
  Button,
  Typography,
  Avatar,
  Tag,
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  BulbOutlined,
  StarOutlined,
  HomeOutlined,
  AimOutlined,
  SafetyOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2Education, Step3Skills } from './Step2And3Education';
import { Step4Evaluation, Step5Residency } from './Step4To6';
import { Step7Preferences, Step8Compliance, Step9Notes } from './Step7To9';
import type { InternshipRecord, InternshipFormValues, StudentFromApi } from '../../../../types/internship.types';
import { toast } from 'sonner';

const { Title, Text } = Typography;

const STEPS = [
  { title: 'Personal', icon: <UserOutlined />, description: 'Basic info & CV' },
  { title: 'Education', icon: <BookOutlined />, description: 'Study & status' },
  { title: 'Skills', icon: <BulbOutlined />, description: 'Skills & experience' },
  { title: 'Evaluation', icon: <StarOutlined />, description: 'Admin scoring' },
  { title: 'Residency', icon: <HomeOutlined />, description: 'Status & asylum' },
  { title: 'Preferences', icon: <AimOutlined />, description: 'Job preferences' },
  { title: 'Compliance', icon: <SafetyOutlined />, description: 'Privacy & consent' },
  { title: 'Notes', icon: <EditOutlined />, description: 'Internal remarks' },
];

interface InternshipFormPageProps {
  mode: 'create' | 'edit';
  initialData?: InternshipRecord;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

export const InternshipFormPage: React.FC<InternshipFormPageProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  submitting,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<StudentFromApi | null>(null);
  const [cvFileList, setCvFileList] = useState<UploadFile[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      const values: Record<string, unknown> = { ...initialData };

      // Convert date strings to dayjs
      if (initialData.dateOfBirth) values.dateOfBirth = dayjs(initialData.dateOfBirth);
      if (initialData.expectedGraduation) {
        values.expectedGraduation = dayjs(initialData.expectedGraduation);
      }
      if (initialData.availabilityStartDate) {
        values.availabilityStartDate = dayjs(initialData.availabilityStartDate);
      }

      form.setFieldsValue(values);

      // If there's a CV filename, show it
      if (initialData.cvFileName && initialData.cvFileUrl) {
        setCvFileList([
          {
            uid: '-1',
            name: initialData.cvFileName,
            status: 'done',
            url: initialData.cvFileUrl,
          },
        ]);
      }
    } else {
      // Defaults for new form
      form.setFieldsValue({
        languages: [{ language: '', level: '' }],
        keySkills: [],
        preferredFields: [],
        hasDutchResidency: false,
        isAsylumSeeker: false,
        interestedInInternship: true,
        interestedInFullTime: false,
        consentToShare: false,
        doNotShareContact: false,
        doNotSharePhoto: false,
        anonymousOnly: false,
      });
    }
  }, [initialData, form]);

  const handleStudentSelect = (student: StudentFromApi) => {
    setSelectedStudent(student);
    form.setFieldsValue({
      fullName: `${student.firstName} ${student.lastName}`,
      email: student.email,
      phoneNumber: student.contactNumber ?? '',
      currentCity: student.address ?? '',
      linkedIn: student.linkedInProfile ?? '',
      portfolio: student.PortfolioWebsite ?? '',
      studyDirection: student.careerDirections?.[0] ?? '',
      keySkills: student.careerDirections ?? [],
    });
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldsByStep: Record<number, string[]> = {
      0: ['fullName', 'phoneNumber', 'email', 'currentCity'],
      1: ['studyDirection', 'institution', 'currentStatus'],
      2: ['keySkills'],
      3: ['overallScore', 'performanceRating'],
      4: ['hasDutchResidency', 'isAsylumSeeker'],
      5: ['interestedInInternship', 'interestedInFullTime'],
      6: ['consentToShare'],
      7: [],
    };

    try {
      await form.validateFields(fieldsByStep[currentStep]);
      return true;
    } catch {
      return false;
    }
  };

  const handleNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleFinish = async () => {
    try {
      await form.validateFields();
      const allValues = form.getFieldsValue(true);

      // Build FormData-compatible object (serialize dates, handle file)
      const cvFile = cvFileList[0]?.originFileObj;

      const formValues: InternshipFormValues = {
        studentId: selectedStudent?._id ?? initialData?.studentId ?? '',
        fullName: allValues.fullName,
        dateOfBirth: allValues.dateOfBirth ? dayjs(allValues.dateOfBirth).format('YYYY-MM-DD') : undefined,
        phoneNumber: allValues.phoneNumber,
        email: allValues.email,
        currentCity: allValues.currentCity,
        cvFileName: cvFile?.name ?? initialData?.cvFileName,
        cvFileUrl: initialData?.cvFileUrl,
        linkedIn: allValues.linkedIn,
        portfolio: allValues.portfolio,

        studyDirection: allValues.studyDirection,
        institution: allValues.institution,
        currentStatus: allValues.currentStatus,
        currentStatusOther: allValues.currentStatusOther,
        expectedGraduation: allValues.expectedGraduation
          ? dayjs(allValues.expectedGraduation).format('YYYY-MM')
          : undefined,

        keySkills: allValues.keySkills ?? [],
        languages: allValues.languages ?? [],
        workExperience: allValues.workExperience,
        certifications: allValues.certifications,

        overallScore: allValues.overallScore,
        performanceRating: allValues.performanceRating,
        strengths: allValues.strengths,
        areasForImprovement: allValues.areasForImprovement,

        hasDutchResidency: allValues.hasDutchResidency ?? false,
        workAuthStatus: allValues.workAuthStatus,

        isAsylumSeeker: allValues.isAsylumSeeker ?? false,
        asylumBackground: allValues.asylumBackground,

        interestedInInternship: allValues.interestedInInternship ?? false,
        interestedInFullTime: allValues.interestedInFullTime ?? false,
        preferredFields: allValues.preferredFields ?? [],
        preferredLocation: allValues.preferredLocation,
        availabilityStartDate: allValues.availabilityStartDate
          ? dayjs(allValues.availabilityStartDate).format('YYYY-MM-DD')
          : undefined,
        availabilityHoursPerWeek: allValues.availabilityHoursPerWeek,

        consentToShare: allValues.consentToShare ?? false,
        doNotShareContact: allValues.doNotShareContact ?? false,
        doNotSharePhoto: allValues.doNotSharePhoto ?? false,
        anonymousOnly: allValues.anonymousOnly ?? false,

        additionalNotes: allValues.additionalNotes,
      };

      // Build actual FormData for when you hook up to the real API
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, val]) => {
        if (val === undefined || val === null) return;
        if (key === 'languages') {
          const langs = val as { language: string; level: string }[];
          langs.forEach((lang, index) => {
            if (lang.language && lang.level) {
              formData.append(`languages[${index}]`, JSON.stringify(lang));
            }
          });
        } else if (Array.isArray(val)) {
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, String(val));
        }
      });
      if (cvFile) formData.append('cv', cvFile);

      const studentName = selectedStudent
        ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
        : formValues.fullName;
      const studentAvatar = selectedStudent?.profile ?? initialData?.studentAvatar;

      formData.append('studentName', studentName);
      if (studentAvatar) formData.append('studentAvatar', studentAvatar);

      // Log formData entries for debugging
      console.log('=== InternshipFormData ===');
      formData.forEach((v, k) => console.log(`${k}:`, v));

      await onSubmit(formData);
    } catch (err) {
      toast.error('Please fill in all required fields before submitting.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1PersonalInfo
            form={form}
            onStudentSelect={handleStudentSelect}
            selectedStudent={selectedStudent}
            cvFileList={cvFileList}
            onCvChange={setCvFileList}
          />
        );
      case 1:
        return <Step2Education form={form} />;
      case 2:
        return <Step3Skills />;
      case 3:
        return <Step4Evaluation />;
      case 4:
        return <Step5Residency />;
      case 5:
        return <Step7Preferences />;
      case 6:
        return <Step8Compliance />;
      case 7:
        return <Step9Notes />;
      default:
        return null;
    }
  };

  return (
    <div >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onCancel}
          type="text"
          size="large"
          style={{ color: '#6b7280' }}
        >
          Back to Internships
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: '#111827' }}>
            {mode === 'create' ? '➕ New Internship Profile' : '✏️ Edit Internship Profile'}
          </Title>
          <Text type="secondary">
            {mode === 'create'
              ? 'Complete all sections to create a candidate profile.'
              : `Editing profile for ${initialData?.studentName}`}
          </Text>
        </div>

        {initialData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar
              src={initialData.studentAvatar}
              icon={<UserOutlined />}
              size={40}
            />
            <div>
              <Text strong style={{ display: 'block' }}>{initialData.studentName}</Text>
              <Tag color="blue">Editing</Tag>
            </div>
          </div>
        )}
      </div>

      {/* Stepper */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '24px 32px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        marginBottom: 28,
        overflowX: 'auto',
      }}>
        <Steps
          current={currentStep}
          items={STEPS.map((s, i) => ({
            title: s.title,
            description: s.description,
            icon: completedSteps.has(i) && i !== currentStep
              ? <CheckOutlined style={{ color: '#22c55e' }} />
              : s.icon,
            status: completedSteps.has(i) && i !== currentStep
              ? 'finish'
              : i === currentStep
                ? 'process'
                : 'wait',
          }))}
          size="small"
          style={{ minWidth: 720 }}
        />
      </div>

      {/* Form Card */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '32px 40px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        marginBottom: 24,
        minHeight: 420,
      }}>
        {/* Step Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 28,
          paddingBottom: 20,
          borderBottom: '1px solid #f3f4f6',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 18,
          }}>
            {STEPS[currentStep].icon}
          </div>
          <div>
            <Title level={5} style={{ margin: 0 }}>
              Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {STEPS[currentStep].description}
            </Text>
          </div>
          <Tag color="blue" style={{ marginLeft: 'auto' }}>
            {currentStep + 1} / {STEPS.length}
          </Tag>
        </div>

        <Form form={form} layout="vertical" size="middle" requiredMark="optional" preserve={true}>
          {renderStep()}
        </Form>
      </div>

      {/* Navigation Buttons */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '16px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Button
          size="large"
          onClick={handlePrev}
          disabled={currentStep === 0}
          icon={<ArrowLeftOutlined />}
        >
          Previous
        </Button>

        <Text type="secondary" style={{ fontSize: 13 }}>
          {completedSteps.size} / {STEPS.length} sections completed
        </Text>

        {currentStep < STEPS.length - 1 ? (
          <Button
            type="primary"
            size="large"
            onClick={handleNext}
          >
            Next Step →
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            onClick={handleFinish}
            loading={submitting}
            icon={submitting ? <LoadingOutlined /> : <CheckOutlined />}
            style={{ background: '#22c55e', borderColor: '#22c55e', minWidth: 160 }}
          >
            {mode === 'create' ? 'Create Profile' : 'Save Changes'}
          </Button>
        )}
      </div>
    </div>
  );
};
