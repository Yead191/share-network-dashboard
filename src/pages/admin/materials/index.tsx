import { useState } from 'react';
import { Table, Button, Input, Modal, message, Popover, Select } from 'antd';
import { Search, Filter, Plus, Eye, Edit, Trash2, BookOpen, ExternalLink, Download } from 'lucide-react';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import AddLearningMaterialModal from '../../../components/modals/admin/AddLearningMaterialModal';
import LearningMaterialDetailsModal from '../../../components/modals/admin/LearningMaterialDetailsModal';
import { toast } from 'sonner';
import { useGetMaterialsQuery } from '../../../redux/apiSlices/admin/adminMaterialsApi';
import { useDeleteMaterialsMutation } from '../../../redux/apiSlices/mentor/learningApi';
import moment from 'moment';
import { imageUrl } from '../../../redux/api/baseApi';
import { useGetUserGroupsQuery, useGetUserTracksQuery } from '../../../redux/apiSlices/admin/adminStudentApi';

const AdminLearningMaterials = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAudience, setFilterAudience] = useState<string | undefined>(undefined);
    const [filterGroup, setFilterGroup] = useState<string | undefined>(undefined);
    // API CALLS
    const { data: materialApi, refetch } = useGetMaterialsQuery({
        page: page,
        limit: 10,
        searchTerm: searchTerm,
        targeteAudience: filterAudience,
        targertGroup: filterGroup,
    });
    const { data: userGroupsApi } = useGetUserGroupsQuery({});
    const { data: userTracksApi } = useGetUserTracksQuery({});
    const [deleteMaterials] = useDeleteMaterialsMutation();
    const userGroups = userGroupsApi?.data;
    const userTracks = userTracksApi?.data;

    const materialsData = materialApi?.data?.resources?.map((item: any) => ({
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
                    toast.promise(deleteMaterials({ id }).unwrap(), {
                        loading: 'Deleting material...',
                        success: (res: any) => {
                            if (res?.success) {
                                refetch();
                            }
                            return res?.message || 'material deleted successfully';
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
                const downloadUrl = record.file ? `${imageUrl}${record.file?.replace('/uploads', '')}` : null;
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
                            <span className="font-medium text-gray-700">No File</span>
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
                console.log('targetTrack value:', targetTrack); // 👈 add this
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
                            setSelectedMaterial(record);
                            setIsDetailsModalOpen(true);
                        }}
                    >
                        View
                    </Button>
                    <Button
                        icon={<Edit size={16} />}
                        onClick={() => {
                            setSelectedMaterial(record);
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:!text-green-500 border-none shadow-none bg-[#F9FAFB] px-3 py-1.5 h-auto font-medium"
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDelete(record._id)}
                        className="flex items-center justify-center gap-1.5 text-xs text-red-500 hover:!bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 h-auto font-medium shadow-none"
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];
    // dfsf
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
                    <Popover
                        content={
                            <div className="w-64 space-y-4 p-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Target Audience
                                    </label>
                                    <Select
                                        placeholder="Select Audience"
                                        className="w-full h-10"
                                        value={filterAudience}
                                        onChange={(v) => setFilterAudience(v)}
                                        allowClear
                                        options={[
                                            { value: 'STUDENT', label: 'STUDENT' },
                                            { value: 'MENTOR', label: 'MENTOR' },
                                            { value: 'TEACHER', label: 'TEACHER' },
                                            { value: 'COORDINATOR', label: 'COORDINATOR' },
                                        ]}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Target Group
                                    </label>
                                    <Select
                                        placeholder="Select Group"
                                        className="w-full h-10"
                                        value={filterGroup}
                                        onChange={(v) => setFilterGroup(v)}
                                        allowClear
                                        options={userGroups?.map((group: any) => ({
                                            value: group._id,
                                            label: group.name,
                                        }))}
                                    />
                                </div>
                                <div className="pt-2 flex justify-between gap-3">
                                    <Button
                                        className="flex-1 h-9 rounded-lg text-xs font-medium border-gray-200"
                                        onClick={() => {
                                            setFilterAudience(undefined);
                                            setFilterGroup(undefined);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        }
                        title={
                            <div className="px-2 py-1.5 border-b border-gray-100 mb-2">
                                <span className="font-bold text-gray-800">Filter Materials</span>
                            </div>
                        }
                        trigger="click"
                        placement="bottomRight"
                        overlayClassName="filter-popover"
                    >
                        <Button
                            icon={<Filter className="w-4 h-4" />}
                            className={`h-10 px-6 border-gray-200 text-gray-600 font-semibold flex items-center gap-2 rounded-lg shadow-sm transition-all ${filterAudience || filterGroup ? 'bg-blue-50 border-blue-200 text-blue-600' : ''
                                }`}
                        >
                            Filter
                        </Button>
                    </Popover>
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
                    dataSource={materialsData}
                    pagination={{
                        current: page,
                        pageSize: 10,
                        total: materialApi?.data?.pagination?.total,
                        showSizeChanger: false,
                        onChange: (page) => setPage(page),
                    }}
                    className="materials-table"
                />
            </div>

            <AddLearningMaterialModal
                open={isAddModalOpen}
                onCancel={() => {
                    setIsAddModalOpen(false);
                    setSelectedMaterial(null);
                }}
                selectedMaterial={selectedMaterial}
                refetch={refetch}
                userGroups={userGroups}
                userTracks={userTracks}
            />

            <LearningMaterialDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                data={selectedMaterial}
            />
        </section>
    );
};

export default AdminLearningMaterials;
