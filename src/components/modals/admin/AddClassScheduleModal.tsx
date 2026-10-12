import { Modal, Input, Select, DatePicker, TimePicker, Switch, Form, Spin, Upload, Button, Tag, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
    X,
    Upload as UploadIcon,
    Users,
    UserCheck,
    Clock,
    MapPin,
    Video,
    BookOpen,
    FileText,
    Link2,
    File,
    Trash2,
    Check,
} from 'lucide-react';
import { getImageUrl } from '../../../utils/getImageUrl';
import {
    useAddClassScheduleMutation,
    useUpdateClassScheduleMutation,
} from '../../../redux/apiSlices/admin/adminClassScheduleApi';
import { toast } from 'sonner';
import { useGetAllUserGroupsQuery } from '../../../redux/apiSlices/userGroupSlice';
import { useGetAllUserGroupTracksQuery } from '../../../redux/apiSlices/userGroupTrackSlice';
import { useGetStudentsQuery } from '../../../redux/apiSlices/admin/adminStudentApi';

interface AddClassScheduleModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
    selectedSchedule?: any;
}

const AddClassScheduleModal = ({ open, onCancel, refetch, selectedSchedule }: AddClassScheduleModalProps) => {
    const [form] = Form.useForm();
    const [addClass, { isLoading }] = useAddClassScheduleMutation();
    const [editClass, { isLoading: isEditLoading }] = useUpdateClassScheduleMutation();

    const { data: userGroups } = useGetAllUserGroupsQuery(undefined, { skip: !open });
    const { data: userGroupTracks } = useGetAllUserGroupTracksQuery(undefined, { skip: !open });

    const selectedGroup = Form.useWatch('userGroup', form);
    const invitationType = Form.useWatch('invitationType', form);
    const selectedStudents = Form.useWatch('students', form) || [];
    const isVirtual = Form.useWatch('virtualClass', form);

    const { data: studentsApi, isFetching: isStudentsLoading } = useGetStudentsQuery(
        {
            selectedGroup: selectedGroup,
            page: 0,
            limit: 0,
        },
        { skip: !open || (invitationType === 'all' && !selectedSchedule) },
    );

    const students = studentsApi?.data?.data || [];
    const [fileList, setFileList] = useState<any[]>([]);

    useEffect(() => {
        if (open && selectedSchedule) {
            const hasStudents =
                (selectedSchedule?.studentAssigned && selectedSchedule.studentAssigned.length > 0) ||
                (selectedSchedule?.studentId && selectedSchedule.studentId.length > 0);
            const hasGroup = selectedSchedule?.userGroup && selectedSchedule.userGroup.length > 0;
            const isSelective = hasStudents || hasGroup;

            const studentIds = (selectedSchedule?.studentAssigned || selectedSchedule?.studentId || []).map(
                (s: any) => s._id || s,
            );

            form.setFieldsValue({
                invitationType: isSelective ? 'selective' : 'all',
                title: selectedSchedule?.title,
                description: selectedSchedule?.description,
                userGroup: Array.isArray(selectedSchedule?.userGroup)
                    ? selectedSchedule?.userGroup[0]?._id || selectedSchedule?.userGroup[0]
                    : selectedSchedule?.userGroup?._id || selectedSchedule?.userGroup,
                userGroupTrack: selectedSchedule?.userGroupTrack?._id || selectedSchedule?.userGroupTrack,
                students: studentIds,
                date: selectedSchedule?.classDate ? dayjs(selectedSchedule.classDate) : undefined,
                time: selectedSchedule?.classDate ? dayjs(selectedSchedule.classDate) : undefined,
                virtualClass: selectedSchedule?.virtualClass ?? false,
                location: selectedSchedule?.location || '',
                slideUrl: selectedSchedule?.slideUrl || '',
                status: selectedSchedule?.status !== undefined ? selectedSchedule?.status : true,
            });

            if (selectedSchedule?.file) {
                setFileList([
                    {
                        uid: '-1',
                        name: selectedSchedule.file.split('/').pop() || 'Lecture-Material.pdf',
                        status: 'done',
                        url: getImageUrl(selectedSchedule.file),
                    },
                ]);
            } else {
                setFileList([]);
            }
        } else if (open && !selectedSchedule) {
            form.resetFields();
            form.setFieldsValue({
                invitationType: 'selective',
                status: true,
                virtualClass: false,
            });
            setFileList([]);
        }
    }, [open, selectedSchedule, form]);

    const onFinish = async (values: any) => {
        try {
            const { date, time, slideUrl, invitationType, students, userGroup, userGroupTrack } = values;

            let classDate: string | undefined;
            if (date && time) {
                const combined = dayjs(date)
                    .set('hour', dayjs(time).hour())
                    .set('minute', dayjs(time).minute())
                    .set('second', dayjs(time).second());
                classDate = combined.toISOString();
            } else if (date) {
                classDate = dayjs(date).toISOString();
            }

            const formData = new FormData();

            formData.append('title', values.title || '');
            formData.append('description', values.description || '');
            formData.append('location', values.location || (values.virtualClass ? 'Online / Virtual Class' : 'Campus'));
            formData.append('virtualClass', String(values.virtualClass ?? false));
            formData.append('status', String(values.status ?? true));
            formData.append('published', 'true');

            if (classDate) {
                formData.append('classDate', classDate);
            }
            if (slideUrl) {
                formData.append('slideUrl', slideUrl);
            }

            // Target Audience Handling
            if (invitationType === 'all') {
                formData.append('userGroup', '');
                formData.append('studentAssigned', '');
            } else {
                if (userGroup) {
                    formData.append('userGroup', userGroup);
                }
                if (userGroupTrack) {
                    formData.append('userGroupTrack', userGroupTrack);
                }
                if (students && students.length > 0) {
                    students.forEach((studentId: string) => {
                        formData.append('studentAssigned', studentId);
                    });
                }
            }

            // Handle file upload / removal
            const newFile = fileList[0]?.originFileObj;
            if (newFile) {
                formData.append('file', newFile);
            } else if (fileList.length === 0 && selectedSchedule?.file) {
                formData.append('file', 'null');
            }

            const mutation = selectedSchedule?._id
                ? editClass({ id: selectedSchedule._id, data: formData }).unwrap()
                : addClass({ data: formData }).unwrap();

            toast.promise(mutation, {
                loading: selectedSchedule?._id ? 'Updating class schedule...' : 'Scheduling class...',
                success: (res: any) => {
                    if (res?.success) {
                        refetch();
                        form.resetFields();
                        onCancel();
                    }
                    return (
                        res?.message || `Class schedule ${selectedSchedule?._id ? 'updated' : 'created'} successfully`
                    );
                },
                error: (err: any) =>
                    err?.message || `Failed to ${selectedSchedule?._id ? 'update' : 'create'} class schedule`,
            });
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    return (
        <Modal
            title={null}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={780}
            closeIcon={null}
            centered
            className="class-schedule-modal"
            styles={{
                content: {
                    padding: 0,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                },
            }}
        >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-8 py-7 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight text-white">
                                {selectedSchedule?._id ? 'Edit Class Schedule' : 'Schedule New Class'}
                            </h2>
                            <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                {selectedSchedule?._id ? 'Editing' : 'New'}
                            </span>
                        </div>
                        <p className="text-emerald-100 text-xs mt-1">
                            Set date, modality, audience targeting, and attach course materials
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            onCancel();
                            form.resetFields();
                        }}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    requiredMark={false}
                    className="space-y-6"
                    initialValues={{
                        invitationType: 'selective',
                        status: true,
                        virtualClass: false,
                    }}
                >
                    {/* General Information Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
                            <BookOpen size={14} className="text-emerald-500" />
                            General Information
                        </div>

                        <Form.Item
                            name="title"
                            label={<span className="text-sm font-semibold text-gray-700">Class Title</span>}
                            rules={[{ required: true, message: 'Please enter class title' }]}
                            className="mb-3"
                        >
                            <Input
                                placeholder="e.g. Advanced JavaScript & TypeScript Architecture"
                                className="h-11 rounded-xl bg-gray-50/70 border-gray-200 hover:border-emerald-500 focus:border-emerald-500 text-sm transition-all shadow-none"
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={<span className="text-sm font-semibold text-gray-700">Description & Outline</span>}
                            rules={[{ required: true, message: 'Please write class description' }]}
                            className="mb-1"
                        >
                            <Input.TextArea
                                placeholder="Describe topics covered, preparation, and meeting objectives..."
                                className="rounded-xl bg-gray-50/70 border-gray-200 hover:border-emerald-500 focus:border-emerald-500 text-sm py-3 transition-all shadow-none"
                                rows={3}
                            />
                        </Form.Item>
                    </div>

                    {/* Schedule & Timing Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
                            <Clock size={14} className="text-emerald-500" />
                            Timing & Modality
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                name="date"
                                label={<span className="text-xs font-semibold text-gray-700">Class Date</span>}
                                rules={[{ required: true, message: 'Please select class date' }]}
                                className="mb-0"
                            >
                                <DatePicker className="w-full h-11 rounded-xl bg-gray-50/70 border-gray-200 hover:border-emerald-500 focus:border-emerald-500" />
                            </Form.Item>

                            <Form.Item
                                name="time"
                                label={<span className="text-xs font-semibold text-gray-700">Class Time</span>}
                                rules={[{ required: true, message: 'Please select class time' }]}
                                className="mb-0"
                            >
                                <TimePicker
                                    className="w-full h-11 rounded-xl bg-gray-50/70 border-gray-200 hover:border-emerald-500 focus:border-emerald-500"
                                    format="hh:mm A"
                                    use12Hours
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-1">
                            <div className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                            isVirtual ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        <Video size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">Virtual / Online Class</p>
                                        <p className="text-[11px] text-gray-400">Host via Zoom / Google Meet</p>
                                    </div>
                                </div>
                                <Form.Item name="virtualClass" valuePropName="checked" noStyle>
                                    <Switch />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="location"
                                label={<span className="text-xs font-semibold text-gray-700">Location or Meeting Link</span>}
                                className="mb-0"
                            >
                                <Input
                                    prefix={<MapPin size={15} className="text-gray-400 mr-1" />}
                                    placeholder={isVirtual ? 'https://zoom.us/j/... or Online' : 'e.g. Lab 3, West Wing'}
                                    className="h-11 rounded-xl bg-gray-50/70 border-gray-200 hover:border-emerald-500 focus:border-emerald-500 text-sm shadow-none"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    {/* Target Audience Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
                            <Users size={14} className="text-emerald-500" />
                            Target Audience
                        </div>

                        <Form.Item name="invitationType" initialValue="selective" className="mb-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div
                                    onClick={() => form.setFieldValue('invitationType', 'all')}
                                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                        invitationType === 'all'
                                            ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                                            : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                                    invitationType === 'all'
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">All Students</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    Open class for every student
                                                </p>
                                            </div>
                                        </div>
                                        {invitationType === 'all' && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div
                                    onClick={() => form.setFieldValue('invitationType', 'selective')}
                                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                        invitationType === 'selective'
                                            ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                                            : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                                    invitationType === 'selective'
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                <UserCheck size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">
                                                    Specific Groups / Students
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    Group or individual scheduling
                                                </p>
                                            </div>
                                        </div>
                                        {invitationType === 'selective' && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Form.Item>

                        {invitationType === 'selective' && (
                            <div className="p-5 bg-gray-50/70 border border-gray-100 rounded-2xl space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Form.Item
                                        label={
                                            <span className="font-semibold text-gray-700 text-xs">
                                                Filter by Cohort / Group (Optional)
                                            </span>
                                        }
                                        name="userGroup"
                                        className="mb-0"
                                    >
                                        <Select
                                            placeholder="Choose cohort group"
                                            className="custom-select-full rounded-xl !h-11"
                                            allowClear
                                            onChange={(value) => {
                                                form.setFieldValue('students', []);
                                                const skillPathGroup = userGroups?.data?.find(
                                                    (g: any) => g.name === 'Skill Path',
                                                );
                                                if (value !== skillPathGroup?._id) {
                                                    form.setFieldValue('userGroupTrack', null);
                                                }
                                            }}
                                            options={userGroups?.data?.map((group: any) => ({
                                                label: group.name,
                                                value: group._id,
                                            }))}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, currentValues) =>
                                            prevValues.userGroup !== currentValues.userGroup
                                        }
                                    >
                                        {({ getFieldValue }) => {
                                            const selectedGroupId = getFieldValue('userGroup');
                                            const skillPathGroup = userGroups?.data?.find(
                                                (g: any) => g.name === 'Skill Path',
                                            );
                                            const isSkillPathSelected = selectedGroupId === skillPathGroup?._id;
                                            return (
                                                <Form.Item
                                                    label={
                                                        <span className="font-semibold text-gray-700 text-xs">
                                                            Track (Optional)
                                                        </span>
                                                    }
                                                    name="userGroupTrack"
                                                    className="mb-0"
                                                >
                                                    <Select
                                                        allowClear
                                                        placeholder="Select track"
                                                        disabled={!isSkillPathSelected && Boolean(selectedGroupId)}
                                                        className="h-11 custom-select-full rounded-xl"
                                                        options={userGroupTracks?.data?.map((track: any) => ({
                                                            label: track.name,
                                                            value: track._id,
                                                        }))}
                                                    />
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </div>

                                {/* Individual Student Picker */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-700 text-xs flex items-center gap-1.5">
                                            Select Individual Students (Optional)
                                            {selectedStudents.length > 0 && (
                                                <Tag className="m-0 bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full font-bold text-[11px] px-2.5">
                                                    {selectedStudents.length} selected
                                                </Tag>
                                            )}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="link"
                                                size="small"
                                                className="text-xs text-emerald-600 font-semibold p-0 h-auto hover:text-emerald-700"
                                                onClick={() => {
                                                    form.setFieldValue(
                                                        'students',
                                                        students.map((s: any) => s._id),
                                                    );
                                                }}
                                            >
                                                Select All ({students.length})
                                            </Button>
                                            {selectedStudents.length > 0 && (
                                                <>
                                                    <span className="text-gray-300">|</span>
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        danger
                                                        className="text-xs font-semibold p-0 h-auto"
                                                        onClick={() => form.setFieldValue('students', [])}
                                                    >
                                                        Clear
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <Form.Item name="students" className="mb-1">
                                        <Select
                                            mode="multiple"
                                            placeholder="Search and choose individual students..."
                                            className="w-full"
                                            loading={isStudentsLoading}
                                            style={{ height: 'auto', minHeight: '44px' }}
                                            options={students?.map((student: any) => ({
                                                value: student?._id,
                                                label:
                                                    `${student?.firstName || ''} ${student?.lastName || ''}`.trim() ||
                                                    student?.email,
                                                email: student?.email,
                                                group: student?.userGroup?.[0]?.name,
                                            }))}
                                            filterOption={(input, option) =>
                                                String(option?.label ?? '')
                                                    .toLowerCase()
                                                    .includes(input.toLowerCase()) ||
                                                String((option as any)?.email ?? '')
                                                    .toLowerCase()
                                                    .includes(input.toLowerCase())
                                            }
                                            optionRender={(option) => (
                                                <div className="flex items-center justify-between py-1">
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar
                                                            size={26}
                                                            className="bg-emerald-100 text-emerald-700 font-bold text-xs"
                                                        >
                                                            {String(option.data.label || 'S')
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-800 leading-none">
                                                                {option.data.label}
                                                            </p>
                                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                                {option.data.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {option.data.group && (
                                                        <Tag className="m-0 text-[10px] rounded-md border-none bg-gray-100 text-gray-600">
                                                            {option.data.group}
                                                        </Tag>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Materials & Links Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
                            <FileText size={14} className="text-emerald-500" />
                            Lecture Materials & Links
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                name="slideUrl"
                                label={<span className="text-xs font-semibold text-gray-700">Slide / Presentation URL</span>}
                                className="mb-0"
                            >
                                <Input
                                    prefix={<Link2 size={15} className="text-gray-400 mr-1" />}
                                    placeholder="https://slides.google.com/..."
                                    className="h-11 rounded-xl bg-gray-50/70 border-gray-200 hover:border-emerald-500 focus:border-emerald-500 text-sm shadow-none"
                                />
                            </Form.Item>

                            <Form.Item
                                name="status"
                                label={<span className="text-xs font-semibold text-gray-700">Schedule Status</span>}
                                className="mb-0"
                            >
                                <Select className="w-full h-11 rounded-xl">
                                    <Select.Option value={true}>Active (Visible)</Select.Option>
                                    <Select.Option value={false}>Inactive (Draft)</Select.Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <div>
                            <span className="text-xs font-semibold text-gray-700 mb-2 block">
                                Lecture Document / Material (.PDF, .DOCX)
                            </span>
                            <Upload
                                accept=".pdf,.doc,.docx"
                                fileList={fileList}
                                onChange={({ fileList }) => {
                                    setFileList(fileList.slice(-1));
                                }}
                                beforeUpload={(uploadedFile) => {
                                    const isValidType =
                                        uploadedFile.type === 'application/pdf' ||
                                        uploadedFile.type === 'application/msword' ||
                                        uploadedFile.type ===
                                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

                                    if (!isValidType) {
                                        toast.error('Only PDF and DOC/DOCX files are allowed!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    return false;
                                }}
                                maxCount={1}
                                className="w-full"
                            >
                                {fileList.length < 1 && (
                                    <div className="border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/30 rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all w-full">
                                        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <UploadIcon size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-gray-700">
                                                Click to upload class material
                                            </p>
                                            <p className="text-[11px] text-gray-400">
                                                PDF or Word documents up to 25MB
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </Upload>

                            {fileList.length > 0 && (
                                <div className="mt-2 flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <File size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 truncate max-w-xs">
                                                {fileList[0].name}
                                            </p>
                                            <p className="text-[10px] text-gray-400">Document attached</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="text"
                                        danger
                                        size="small"
                                        icon={<Trash2 size={15} />}
                                        onClick={() => setFileList([])}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button
                            onClick={() => {
                                onCancel();
                                form.resetFields();
                            }}
                            className="h-11 px-6 rounded-xl border-gray-200 text-gray-600 font-semibold hover:border-gray-300"
                        >
                            Cancel
                        </Button>
                        <button
                            type="submit"
                            disabled={isLoading || isEditLoading}
                            className="h-11 px-9 rounded-xl font-bold bg-[#22C55E] hover:!bg-[#1ea34d] border-none shadow-lg shadow-emerald-500/20 text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {isLoading || isEditLoading ? (
                                <Spin size="small" />
                            ) : selectedSchedule?._id ? (
                                'Update Class Schedule'
                            ) : (
                                'Confirm & Schedule Class'
                            )}
                        </button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default AddClassScheduleModal;
