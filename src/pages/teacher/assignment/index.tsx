import { useState } from 'react';
import { Button, Input, ConfigProvider, Select } from 'antd';
import { SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';

// Modular Components
import CreateAssignmentModal from './components/CreateAssignmentModal';
import AssignmentDetailsModal from './components/AssignmentDetailsModal';
import SubmissionReviewModal from './components/SubmissionReviewModal';
import AssignmentTable from './components/AssignmentTable';
import SubmissionTable from './components/SubmissionTable';

import {
    useCreateAssignmentMutation,
    useDeleteAssignmentMutation,
    useGetAllSubmissionOfAssignmentQuery,
    useGetAssignmentQuery,
    useGiveMarksOfSubmissionMutation,
    useUpdateAssignmentMutation,
} from '../../../redux/apiSlices/teacher/assignmentSlice';
import { useGetUserGroupsQuery } from '../../../redux/apiSlices/teacher/resourceSlice';
import { toast } from 'sonner';
import HeaderTitle from '../../../components/shared/HeaderTitle';

function Assignment() {
    const [page, setPage] = useState(1);
    const [createAssignment] = useCreateAssignmentMutation();
    const [updateAssignment] = useUpdateAssignmentMutation();
    const [deleteAssignment] = useDeleteAssignmentMutation();
    const [activeTab, setActiveTab] = useState<'assignment' | 'submission'>('assignment');
    const [searchText, setSearchText] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
    const {
        data: assignmentData,
        isLoading,
        isFetching,
        refetch,
    } = useGetAssignmentQuery({ page: page, limit: 10, searchTerm: searchText, userGroup: selectedGroup });
    const { data: submissionData } = useGetAllSubmissionOfAssignmentQuery({ page: 1, limit: 10 });
    const { data: userGroups } = useGetUserGroupsQuery({ page: 1, limit: 100 });
    const [reviewSubmission] = useGiveMarksOfSubmissionMutation();
    const [file, setFile] = useState<any | null>(null);

    // Modal States
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Selection States
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

    // --- Derived State (Search/Filter Logic) ---

    const newData = assignmentData?.data?.map((item) => {
        return {
            key: item._id,
            title: item.title,
            targets: item.userGroup,
            description: item.description,
            dueDate: item.dueDate,
            status: item.status,
            published: item.published,
            points: item.totalPoint,
            type: item.userGroupTrack,
            attachment: item.attachment,
        };
    });

    const modifiedData = submissionData?.data?.data?.map((item) => {
        return {
            key: item._id,
            avatar: item.studentId.profile,
            name: item.studentId.name,
            email: item.studentId.email,
            assignment: item.assignmentId,
            submissionDate: item.createdAt,
            attachment: item.fileAssignment,
            grade: item.marks,
            review: item.feedback,
        };
    });

    // --- Logic Handlers ---

    const handleCreateEditFinish = async (values: any) => {
        const formData = new FormData();

        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('dueDate', values.dueDate);
        formData.append('totalPoint', values.totalPoint);
        formData.append('published', values.published);
        formData.append('status', values.status);

        if (values.userGroup) {
            if (Array.isArray(values.userGroup)) {
                values.userGroup.forEach((groupId: string) => {
                    formData.append('userGroup[]', groupId);
                });
            } else {
                formData.append('userGroup[]', values.userGroup);
            }
        }

        if (values.userGroupTrack) {
            formData.append('userGroupTrack', values.userGroupTrack);
        }

        if (values.attachmentType === 'file') {
            if (file) {
                formData.append('attachment', file);
            }
        } else if (values.attachmentType === 'url' && values.attachmentUrl) {
            formData.append('attachment', values.attachmentUrl);
        }

        if (modalMode === 'edit') {
            toast.promise(updateAssignment({ id: selectedAssignment?.key, data: formData }).unwrap(), {
                loading: 'Updating assignment...',
                success: (res: any) => {
                    refetch();
                    if (!res.error) {
                        setIsCreateModalOpen(false);
                    }
                    return res.message;
                },
                error: (err: any) => {
                    return err.data.message;
                },
            });
        } else {
            toast.promise(createAssignment(formData).unwrap(), {
                loading: 'Creating assignment...',
                success: (res: any) => {
                    if (!res.error) {
                        setIsCreateModalOpen(false);
                    }
                    refetch();
                    return res.message;
                },
                error: (err: any) => {
                    return err.data.message;
                },
            });
        }
    };

    const handleChangeStatus = async (key: string, status: string) => {
        const { error }: any = await updateAssignment({
            id: key,
            data: { published: status === 'Active' ? true : false },
        });
        if (!error) {
            toast.success('Assignment updated successfully');
            return;
        }
        toast.error(error?.data?.message || 'Failed to update assignment');
    };

    const handleDelete = async (key: string) => {
        const { error }: any = await deleteAssignment({ id: key });
        if (!error) {
            toast.success('Assignment deleted successfully');
            return;
        }
        toast.error(error?.data?.message || 'Failed to delete assignment');
    };

    const handleReviewFinish = (key: string, grade: string, review: string) => {
        console.log(review);

        const { error }: any = reviewSubmission({ id: key, data: { marks: grade, feedback: review } });
        if (!error) {
            toast.success('Review submitted successfully');
            setIsReviewModalOpen(false);
            return;
        }
        toast.error(error?.data?.message || 'Failed to submit review');
    };

    return (
        <div className=" min-h-screen">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <HeaderTitle title="Assignment" />

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        prefix={<SearchOutlined className="text-gray-400" />}
                        placeholder={activeTab === 'assignment' ? 'Search assignment' : 'Search student'}
                        className="w-full md:w-64 h-10 rounded-lg bg-white border-gray-100 shadow-sm"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Select
                        placeholder="Filter by Group"
                        className="w-full md:w-48 h-10 rounded-lg"
                        allowClear
                        onChange={setSelectedGroup}
                        suffixIcon={<FilterOutlined className="text-gray-400" />}
                    >
                        {userGroups?.data?.map((group: any) => (
                            <Select.Option key={group._id} value={group._id}>
                                {group.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="h-10 px-5 rounded-lg bg-[#21C35D] hover:bg-[#1da950] border-none font-bold flex items-center gap-2"
                        onClick={() => {
                            setModalMode('create');
                            setSelectedAssignment(null);
                            setIsCreateModalOpen(true);
                        }}
                    >
                        Create Assignment
                    </Button>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => {
                        setActiveTab('assignment');
                        setSearchText('');
                    }}
                    className={`h-10 px-6 rounded-lg font-bold transition-all ${
                        activeTab === 'assignment'
                            ? 'bg-[#3182CE] text-white shadow-lg shadow-[#3182CE]/20'
                            : 'bg-white text-gray-500 border border-gray-100'
                    }`}
                >
                    All Assignment
                </button>
                <button
                    onClick={() => {
                        setActiveTab('submission');
                        setSearchText('');
                    }}
                    className={`h-10 px-6 rounded-lg font-bold transition-all ${
                        activeTab === 'submission'
                            ? 'bg-[#3182CE] text-white shadow-lg shadow-[#3182CE]/20'
                            : 'bg-white text-gray-500 border border-gray-100'
                    }`}
                >
                    Submission
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                headerBg: '#ffffff',
                                headerColor: '#000000',
                                headerSplitColor: 'transparent',
                                headerBorderRadius: 0,
                            },
                        },
                    }}
                >
                    {activeTab === 'assignment' ? (
                        <AssignmentTable
                            data={newData || []}
                            onView={(record) => {
                                setSelectedAssignment(record);
                                setIsDetailsModalOpen(true);
                            }}
                            onEdit={(record) => {
                                setModalMode('edit');
                                setSelectedAssignment(record);
                                setIsCreateModalOpen(true);
                            }}
                            onDelete={handleDelete}
                            isLoading={isLoading || isFetching}
                            pagination={assignmentData?.pagination!}
                            setPage={setPage}
                            handleChangeStatus={handleChangeStatus}
                        />
                    ) : (
                        <SubmissionTable
                            data={modifiedData || []}
                            onView={(record) => {
                                setSelectedSubmission(record);
                                setIsReviewModalOpen(true);
                            }}
                        />
                    )}
                </ConfigProvider>
            </div>

            {/* --- Modals --- */}

            <CreateAssignmentModal
                open={isCreateModalOpen}
                mode={modalMode}
                initialValues={selectedAssignment}
                onCancel={() => setIsCreateModalOpen(false)}
                onFinish={handleCreateEditFinish}
                setFile={setFile}
            />

            <AssignmentDetailsModal
                open={isDetailsModalOpen}
                assignment={selectedAssignment}
                onCancel={() => setIsDetailsModalOpen(false)}
            />

            <SubmissionReviewModal
                open={isReviewModalOpen}
                submission={selectedSubmission}
                onCancel={() => setIsReviewModalOpen(false)}
                onReview={handleReviewFinish}
            />
        </div>
    );
}

export default Assignment;
