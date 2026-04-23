import { useState } from 'react';
import { Table, Button, Input, Modal, message, Select } from 'antd';
import { Search, Plus, Eye, Edit, Trash2, BookOpen, ExternalLink, Download } from 'lucide-react';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import { toast } from 'sonner';
import { useDeleteResourseMutation, useGetResourcesQuery } from '../../../redux/apiSlices/teacher/resourceSlice';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';
import moment from 'moment';
import { getImageUrl } from '../../../utils/getImageUrl';
import TeacherCreateResourceModal from '../../../components/modals/teacher/TeacherCreateResourceModal';
import TeacherResourceDetailsModal from '../../../components/modals/teacher/TeacherResourceDetailsModal';

const TeacherResources = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<any>(null);
    const [type, setType] = useState('ALL');
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: profile } = useGetprofileQuery({});
    const userGroup = profile?.data?.userGroup?.[0]?._id;
    const userGroupTrack = profile?.data?.userGroupTrack?._id;

    // API CALLS
    const { data: resourcesApi, isLoading, isFetching, refetch } = useGetResourcesQuery({
        page: page,
        limit: 10,
        searchTerm: searchTerm,
        type: type === 'ALL' ? undefined : type,
        targertGroup: userGroup,
        ...(userGroupTrack && { userGroupTrack }),
    });

    const [deleteResource] = useDeleteResourseMutation();

    const resourcesData = resourcesApi?.data?.resources?.map((item: any) => ({
        _id: item?._id,
        key: item?._id,
        title: item?.title,
        description: item?.description,
        type: item?.type,
        url: item?.contentUrl,
        pdf: item?.pdf,
        targetAudience: item?.targeteAudience,
        target: item?.targertGroup,
        targetTrack: item?.targetTrack,
        status: item?.markAsAssigned ? 'Active' : 'Inactive',
        date: moment(item?.createdAt).format('YYYY-MM-DD'),
        file: item?.pdf,
    }));

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete Material',
            content: 'Are you sure you want to delete this material?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    toast.promise(deleteResource({ id }).unwrap(), {
                        loading: 'Deleting material...',
                        success: (res: any) => {
                            if (res?.success) {
                                refetch();
                            }
                            return res?.message || 'Material deleted successfully';
                        },
                        error: (err: any) => err?.message || 'Failed to delete material',
                    });
                } catch (error: any) {
                    message.error(error?.data?.message || 'Something went wrong');
                }
            },
        });
    };

    const columns = [
        {
            title: 'Material',
            key: 'material',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shadow-sm">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-[13px]">{record.title}</p>
                        <p className="text-xs text-gray-400">
                            {record.description?.length > 50
                                ? `${record.description.slice(0, 50)}...`
                                : record.description}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'CONTENT URL',
            key: 'url',
            render: (_: any, record: any) => (
                <div>
                    {record.url ? (
                        <Button
                            href={record.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={<ExternalLink size={14} />}
                            className="flex items-center gap-1.5 text-xs text-blue-600 hover:!text-blue-700 border-blue-100 bg-blue-50 px-3 py-1.5 h-auto font-medium shadow-none"
                        >
                            Open URL
                        </Button>
                    ) : (
                        <span className="text-gray-400 text-xs">No URL</span>
                    )}
                </div>
            ),
        },
        {
            title: 'FILE',
            key: 'pdf',
            render: (_: any, record: any) => {
                const downloadUrl = record.file ? getImageUrl(record.file) : null;
                return (
                    <div>
                        {downloadUrl ? (
                            <Button
                                href={downloadUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                icon={<Download size={14} />}
                                className="flex items-center gap-1.5 text-xs text-green-600 hover:!text-green-700 border-green-100 bg-green-50 px-3 py-1.5 h-auto font-medium shadow-none"
                            >
                                Download
                            </Button>
                        ) : (
                            <span className="font-medium text-gray-700 text-xs">No File</span>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'AUDIENCE',
            dataIndex: 'targetAudience',
            key: 'targetAudience',
            render: (text: string) => (
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-500 text-[10px] rounded-full border border-blue-100 uppercase tracking-tight font-medium">
                        {text || 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            title: 'TARGET',
            dataIndex: 'target',
            key: 'target',
            render: (targets: { _id: string; name: string }[]) => (
                <div className="flex gap-2 flex-wrap">
                    {Array.isArray(targets) && targets.length > 0 ? (
                        targets.map((item) => (
                            <span
                                key={item._id}
                                className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] rounded-full border border-gray-200 uppercase tracking-tight font-medium"
                            >
                                {item?.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 text-[10px]">N/A</span>
                    )}
                </div>
            ),
        },
        {
            title: 'TRACK',
            dataIndex: 'targetTrack',
            key: 'targetTrack',
            render: (targetTrack: { _id: string; name: string }) => {
                return (
                    <div className="flex gap-2">
                        {targetTrack?.name ? (
                            <span className="px-3 py-1 bg-purple-50 text-purple-500 text-[10px] rounded-full border border-purple-100 uppercase tracking-tight font-medium">
                                {targetTrack?.name}
                            </span>
                        ) : (
                            <span className="text-gray-400 text-[10px]">N/A</span>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => (
                <div className="flex items-center gap-2 px-3 py-1 border border-green-200 rounded-lg bg-green-50 text-green-600 text-xs font-medium cursor-pointer w-fit">
                    {text}
                </div>
            ),
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-2.5">
                    <Button
                        icon={<Eye size={16} />}
                        className="flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:!text-blue-500 border-none shadow-none bg-[#F9FAFB] px-3 py-1.5 h-auto font-medium"
                        onClick={() => {
                            setSelectedResource(record);
                            setIsDetailsModalOpen(true);
                        }}
                    />
                    <Button
                        icon={<Edit size={16} />}
                        onClick={() => {
                            setSelectedResource(record);
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:!text-green-500 border-none shadow-none bg-[#F9FAFB] px-3 py-1.5 h-auto font-medium"
                    />
                    <Button
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDelete(record._id)}
                        className="flex items-center justify-center gap-1.5 text-xs text-red-500 hover:!bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 h-auto font-medium shadow-none"
                    />
                </div>
            ),
        },
    ];

    return (
        <section className="space-y-6">
            <div className="flex justify-between items-center">
                <HeaderTitle title="Learning Materials" />
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                        <Input
                            placeholder="Search materials"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 pl-10 bg-white border border-gray-200 shadow-sm w-72 rounded-lg"
                        />
                    </div>
                    <Select
                        value={type}
                        onChange={(value) => {
                            setType(value);
                            setPage(1);
                        }}
                        className="w-40 h-[40px]"
                        options={[
                            { value: 'ALL', label: 'All Types' },
                            { value: 'LECTURE', label: 'Lectures' },
                            { value: 'SLIDES', label: 'Slides' },
                            { value: 'MATERIAL', label: 'Materials' },
                        ]}
                    />
                    <Button
                        icon={<Plus className="w-4 h-4" />}
                        className="h-10 px-6 bg-[#22C55E] text-white hover:!bg-[#1ea34d] border-none font-semibold flex items-center gap-2 rounded-lg shadow-sm"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Material
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={resourcesData}
                    loading={isLoading || isFetching}
                    pagination={{
                        current: page,
                        pageSize: 10,
                        total: resourcesApi?.data?.pagination?.total,
                        showSizeChanger: false,
                        onChange: (page) => setPage(page),
                    }}
                    className="materials-table"
                />
            </div>

            <TeacherCreateResourceModal
                open={isAddModalOpen}
                onCancel={() => {
                    setIsAddModalOpen(false);
                    setSelectedResource(null);
                }}
                selectedMaterial={selectedResource}
                refetch={refetch}
                teacherUserGroup={userGroup}
                teacherUserGroupTrack={userGroupTrack}
            />

            <TeacherResourceDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                data={selectedResource}
            />
        </section>
    );
};

export default TeacherResources;
