import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Switch,
  Tag,
  Avatar,
} from "antd";
import {
  FileText,
  Users,
  UserCheck,
  Calendar,
  Trophy,
  UploadCloud,
  Link2,
  X,
  Check,
  File as FileIcon,
  Trash2,
  Sparkles,
} from "lucide-react";
import dayjs from "dayjs";
import {
  useGetUserGroupsQuery,
  useGetUserGroupsTrackQuery,
} from "../../../../redux/apiSlices/teacher/resourceSlice";
import { useGetStudentsQuery } from "../../../../redux/apiSlices/admin/adminStudentApi";

interface CreateAssignmentModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  setFile: (file: any) => void;
  initialValues?: any;
  mode: "create" | "edit";
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  open,
  onCancel,
  onFinish,
  initialValues,
  mode,
  setFile,
}) => {
  const { data: userGroups } = useGetUserGroupsQuery({ page: 1, limit: 100 });
  const { data: userGroupsTrack } = useGetUserGroupsTrackQuery({
    page: 1,
    limit: 100,
  });
  const [form] = Form.useForm();

  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadedFileSize, setUploadedFileSize] = useState<string>("");

  const selectedGroup = Form.useWatch("userGroup", form);
  const invitationType = Form.useWatch("invitationType", form);
  const selectedStudents = Form.useWatch("students", form) || [];
  const attachmentType = Form.useWatch("attachmentType", form) || "file";

  const { data: studentsApi, isFetching: isStudentsLoading } =
    useGetStudentsQuery(
      {
        selectedGroup: selectedGroup,
        page: 0,
        limit: 0,
      },
      { skip: !open || (invitationType === "all" && !initialValues) },
    );

  const students = studentsApi?.data?.data || [];

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialValues) {
        const isUrl = initialValues.attachment?.startsWith("http");
        const hasStudents =
          initialValues.studentAssigned &&
          initialValues.studentAssigned.length > 0;
        const hasTargets =
          initialValues.targets && initialValues.targets.length > 0;

        form.setFieldsValue({
          ...initialValues,
          dueDate: initialValues.dueDate ? dayjs(initialValues.dueDate) : null,
          invitationType: hasStudents || hasTargets ? "selective" : "all",
          userGroup: Array.isArray(initialValues.targets)
            ? initialValues.targets[0]?._id
            : initialValues.targets?._id || initialValues.targets,
          userGroupTrack: initialValues?.type?._id || initialValues?.type,
          students:
            initialValues.studentAssigned?.map((s: any) => s._id || s) || [],
          totalPoint:
            initialValues.points !== undefined
              ? initialValues.points
              : initialValues.totalPoint || 100,
          published:
            initialValues.published !== undefined
              ? initialValues.published
              : true,
          status: initialValues.status || "PENDING",
          attachmentType: isUrl ? "url" : "file",
          attachmentUrl: isUrl ? initialValues.attachment : undefined,
        });

        if (initialValues.attachment && !isUrl) {
          const name =
            initialValues.attachment.split("/").pop() || "Existing attachment";
          setUploadedFileName(name);
          setUploadedFileSize("Attached file");
        } else {
          setUploadedFileName("");
          setUploadedFileSize("");
        }
      } else {
        form.resetFields();
        form.setFieldsValue({
          invitationType: "selective",
          published: true,
          status: "PENDING",
          totalPoint: 100,
          attachmentType: "file",
        });
        setUploadedFileName("");
        setUploadedFileSize("");
        setFile(null);
      }
    }
  }, [open, mode, initialValues, form, setFile]);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const skillPathGroup = userGroups?.data?.find(
          (g: any) => g.name === "Skill Path",
        );
        const isSkillPathSelected = values.userGroup === skillPathGroup?._id;

        onFinish({
          ...values,
          userGroup: values.invitationType === "all" ? null : values.userGroup,
          userGroupTrack:
            isSkillPathSelected && values.invitationType !== "all"
              ? values.userGroupTrack
              : null,
          studentAssigned:
            values.invitationType === "all" ? [] : values.students || [],
          dueDate: values.dueDate
            ? values.dueDate.format("YYYY-MM-DD HH:mm")
            : null,
          id:
            mode === "edit"
              ? initialValues.key || initialValues._id
              : undefined,
        });
        onCancel();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={780}
      centered
      closeIcon={null}
      className="assignment-modal"
      styles={{
        content: {
          padding: 0,
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      {/* Modal Header */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-8 py-7 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {mode === "edit"
                    ? "Edit Assignment"
                    : "Create New Assignment"}
                </h2>
                <span className="bg-white/20 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {mode === "edit" ? "Editing" : "New"}
                </span>
              </div>
              <p className="text-emerald-100 text-xs mt-1">
                Configure assignment details, audience targeting, and submission
                guidelines
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
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
          autoComplete="off"
          requiredMark={false}
          className="space-y-6"
        >
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
              <FileText size={14} className="text-emerald-500" />
              General Information
            </div>

            <Form.Item
              label={
                <span className="font-semibold text-gray-700 text-sm">
                  Assignment Title
                </span>
              }
              name="title"
              rules={[
                { required: true, message: "Please enter assignment title" },
              ]}
              className="mb-3"
            >
              <Input
                placeholder="e.g. Data Structures & Algorithms Assignment 1"
                className="h-11 rounded-xl bg-gray-50/70 border-gray-200 hover:border-emerald-500 focus:border-emerald-500 text-sm transition-all shadow-none"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-semibold text-gray-700 text-sm">
                  Description & Instructions
                </span>
              }
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please enter assignment instructions",
                },
              ]}
              className="mb-3"
            >
              <Input.TextArea
                placeholder="Describe the objectives, deliverables, and submission instructions..."
                rows={4}
                className="rounded-xl bg-gray-50/70 border-gray-200 hover:border-emerald-500 focus:border-emerald-500 text-sm py-3 transition-all shadow-none"
              />
            </Form.Item>
          </div>

          {/* Target Audience Section (Cards) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
              <Users size={14} className="text-emerald-500" />
              Target Audience
            </div>

            <Form.Item
              name="invitationType"
              initialValue="selective"
              className="mb-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div
                  onClick={() => form.setFieldValue("invitationType", "all")}
                  className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    invitationType === "all"
                      ? "border-emerald-500 bg-emerald-50/40 shadow-sm"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          invitationType === "all"
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">
                          All Students
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Assign to every student
                        </p>
                      </div>
                    </div>
                    {invitationType === "all" && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>

                <div
                  onClick={() =>
                    form.setFieldValue("invitationType", "selective")
                  }
                  className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    invitationType === "selective"
                      ? "border-emerald-500 bg-emerald-50/40 shadow-sm"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          invitationType === "selective"
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <UserCheck size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">
                          Specific Groups / Students
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Target by group or individuals
                        </p>
                      </div>
                    </div>
                    {invitationType === "selective" && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Form.Item>

            {invitationType === "selective" && (
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
                        form.setFieldValue("students", []);
                        const skillPathGroup = userGroups?.data?.find(
                          (g: any) => g.name === "Skill Path",
                        );
                        if (value !== skillPathGroup?._id) {
                          form.setFieldValue("userGroupTrack", null);
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
                      const selectedGroupId = getFieldValue("userGroup");
                      const skillPathGroup = userGroups?.data?.find(
                        (g: any) => g.name === "Skill Path",
                      );
                      const isSkillPathSelected =
                        selectedGroupId === skillPathGroup?._id;
                      return (
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700 text-xs">
                              Track (Skill Path Only)
                            </span>
                          }
                          name="userGroupTrack"
                          className="mb-0"
                        >
                          <Select
                            allowClear
                            placeholder="Select track"
                            disabled={!isSkillPathSelected}
                            className="h-11 custom-select-full rounded-xl"
                            options={userGroupsTrack?.data?.map(
                              (track: any) => ({
                                label: track.name,
                                value: track._id,
                              }),
                            )}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </div>

                {/* Student Picker */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700 text-xs">
                      Select Individual Students (Optional)
                      {selectedStudents.length > 0 && (
                        <Tag className="ml-2 bg-purple-50 text-purple-700 border-purple-200 rounded-full font-bold text-[11px] px-2.5">
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
                            "students",
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
                            onClick={() => form.setFieldValue("students", [])}
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
                      placeholder="Search and choose students..."
                      className="w-full"
                      loading={isStudentsLoading}
                      style={{ height: "auto", minHeight: "44px" }}
                      options={students?.map((student: any) => ({
                        value: student?._id,
                        label:
                          `${student?.firstName || ""} ${student?.lastName || ""}`.trim() ||
                          student?.email,
                        email: student?.email,
                        group: student?.userGroup?.[0]?.name,
                      }))}
                      filterOption={(input, option) =>
                        String(option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase()) ||
                        String((option as any)?.email ?? "")
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
                              {String(option.data.label || "S")
                                .charAt(0)
                                .toUpperCase()}
                            </Avatar>
                            <div>
                              <p className="text-xs font-semibold text-gray-800 leading-tight">
                                {option.data.label}
                              </p>
                              <p className="text-[11px] text-gray-400 leading-tight">
                                {(option.data as any).email}
                              </p>
                            </div>
                          </div>
                          {(option.data as any).group && (
                            <Tag className="text-[10px] bg-gray-50 text-gray-500 border-gray-100 rounded-full px-2">
                              {(option.data as any).group}
                            </Tag>
                          )}
                        </div>
                      )}
                    />
                  </Form.Item>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Tip: If no students are selected, the assignment will be
                    assigned to all students in the chosen cohort group.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Deadline & Points */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
              <Calendar size={14} className="text-emerald-500" />
              Schedule & Grading
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 text-sm">
                    Due Date & Time
                  </span>
                }
                name="dueDate"
                rules={[
                  { required: true, message: "Please select a due date" },
                ]}
                className="mb-0"
              >
                <DatePicker
                  placeholder="YYYY-MM-DD HH:mm"
                  className="w-full h-11 rounded-xl bg-gray-50/70 border-gray-200 hover:border-emerald-500 focus:border-emerald-500 text-sm"
                  format="YYYY-MM-DD HH:mm"
                  showTime={{ format: "HH:mm" }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 text-sm">
                    Total Points
                  </span>
                }
                name="totalPoint"
                initialValue={100}
                rules={[
                  { required: true, message: "Please enter total points" },
                ]}
                className="mb-0"
              >
                <Input
                  type="number"
                  placeholder="100"
                  prefix={
                    <Trophy size={16} className="text-amber-500 mr-1.5" />
                  }
                  className="h-11 rounded-xl bg-gray-50/70 border-gray-200 hover:border-emerald-500 focus:border-emerald-500 text-sm font-semibold"
                />
              </Form.Item>
            </div>
          </div>

          {/* Resources / Attachments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <UploadCloud size={14} className="text-emerald-500" />
                Resource / Attachment
              </div>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => form.setFieldValue("attachmentType", "file")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    attachmentType === "file"
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => form.setFieldValue("attachmentType", "url")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    attachmentType === "url"
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Web / Resource URL
                </button>
              </div>
            </div>

            <Form.Item name="attachmentType" initialValue="file" hidden>
              <Input />
            </Form.Item>

            {attachmentType === "file" ? (
              uploadedFileName ? (
                <div className="flex items-center justify-between p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                      <FileIcon size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">
                        {uploadedFileName}
                      </p>
                      <p className="text-xs text-emerald-600 font-medium mt-0.5">
                        {uploadedFileSize || "File selected"}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 size={16} />}
                    className="hover:bg-red-50 rounded-xl"
                    onClick={() => {
                      setUploadedFileName("");
                      setUploadedFileSize("");
                      setFile(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Form.Item name="attachment" className="mb-0">
                  <Upload.Dragger
                    maxCount={1}
                    beforeUpload={() => false}
                    showUploadList={false}
                    onChange={(info) => {
                      if (info.file.status === "removed") {
                        setFile(null);
                        setUploadedFileName("");
                        setUploadedFileSize("");
                      } else if (info.fileList.length > 0) {
                        const rawFile =
                          info.fileList[0].originFileObj ||
                          info.file.originFileObj ||
                          info.file;
                        setFile(rawFile);
                        setUploadedFileName(info.file.name);
                        setUploadedFileSize(
                          formatFileSize(info.file.size || 0),
                        );
                      }
                    }}
                    className="rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/50 py-6 transition-all"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">
                        Click to upload or drag & drop files
                      </p>
                      <p className="text-xs text-gray-400">
                        Supports PDF, DOCX, ZIP, or images (max 50MB)
                      </p>
                    </div>
                  </Upload.Dragger>
                </Form.Item>
              )
            ) : (
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 text-xs">
                    External Link / Document URL
                  </span>
                }
                name="attachmentUrl"
                rules={[{ type: "url", message: "Please enter a valid URL" }]}
                className="mb-0"
              >
                <Input
                  prefix={<Link2 size={16} className="text-gray-400 mr-1.5" />}
                  placeholder="https://docs.google.com/document/d/..."
                  className="h-11 rounded-xl bg-gray-50/70 border-gray-200 hover:border-emerald-500 focus:border-emerald-500 text-sm"
                />
              </Form.Item>
            )}
          </div>

          {/* Visibility & Status Settings */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Form.Item
                name="published"
                valuePropName="checked"
                initialValue={true}
                className="mb-0"
              >
                <Switch className="bg-gray-300" />
              </Form.Item>
              <div>
                <p className="text-xs font-bold text-gray-800">
                  Publish to Students
                </p>
                <p className="text-[11px] text-gray-400">
                  Make assignment visible immediately
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-600">Status:</span>
              <Form.Item name="status" initialValue="PENDING" className="mb-0">
                <Select
                  className="w-36 rounded-xl"
                  options={[
                    { value: "PENDING", label: "Pending" },
                    { value: "IN_PROGRESS", label: "In Progress" },
                    { value: "COMPLETED", label: "Completed" },
                  ]}
                />
              </Form.Item>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              className="h-11 px-7 rounded-xl font-bold text-gray-600 border-gray-200 hover:bg-gray-50"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="h-11 px-9 rounded-xl font-bold bg-[#22C55E] hover:!bg-[#1ea34d] border-none shadow-lg shadow-emerald-500/20 text-white flex items-center gap-2"
              onClick={handleSubmit}
            >
              {mode === "edit" ? "Update Assignment" : "Create Assignment"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateAssignmentModal;
