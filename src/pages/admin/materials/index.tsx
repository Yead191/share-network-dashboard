import { useState } from 'react';
import { Table, Button, Input, Modal, message } from 'antd';
import { Search, Filter, Plus, Eye, Edit, Trash2, FileText, BookOpen } from 'lucide-react';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import AddLearningMaterialModal from '../../../components/modals/admin/AddLearningMaterialModal';
import LearningMaterialDetailsModal from '../../../components/modals/admin/LearningMaterialDetailsModal';
import { toast } from 'sonner';
import { useGetMaterialsQuery } from '../../../redux/apiSlices/admin/adminMaterialsApi';
import { useDeleteMaterialsMutation } from '../../../redux/apiSlices/mentor/learningApi';
import moment from 'moment';
import FileViewerButton from '../../../components/shared/FileViewButton';

const AdminLearningMaterials = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    // API CALLS
    const { data: materialApi, refetch } = useGetMaterialsQuery({ page: page, limit: 10, searchTerm: searchTerm });
    const [deleteMaterials] = useDeleteMaterialsMutation();

    const materialsData = materialApi?.data?.resources?.map((item: any) => ({
        _id: item?._id,
        key: item?._id,
        title: item?.title,
        description: item?.description,
        type: item?.type,
        url: item?.contentUrl,
        targetAudience: item?.targeteAudience,
        target: item?.targertGroup,
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
                        <p className="text-xs text-gray-400">{record.description}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'TYPE',
            key: 'type',
            render: (_: any, record: any) => (
                <div>
                    {record.type === 'PDF' ? (
                        <a
                            href={record.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-50 w-8 h-8 rounded flex items-center justify-center text-green-500 shadow-sm border border-green-100"
                        >
                            <FileText size={18} />
                        </a>
                    ) : (
                        <a
                            href={record.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 text-xs flex items-center gap-1.5 hover:text-blue-500 transition-colors"
                        >
                            {record.url}
                        </a>
                    )}
                </div>
            ),
        },
        {
            title: 'FILE',
            key: 'file',
            render: (_: any, record: any) => (
                <div>
                    {record.file ? (
                        <FileViewerButton fileUrl={record.file} fileName={record.title} />
                    ) : (
                        <span className="font-medium text-gray-700">No File</span>
                    )}
                </div>
            ),
        },
        {
            title: 'TARGET',
            dataIndex: 'target',
            key: 'target',
            render: (tags: { _id: string; name: string }) => (
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] rounded-full border border-gray-200 uppercase tracking-tight font-medium">
                        {tags?.name}
                    </span>
                </div>
            ),
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
                    <Button
                        icon={<Filter className="w-4 h-4" />}
                        className="h-10 px-6 border-gray-200 text-gray-600 font-semibold flex items-center gap-2 rounded-lg shadow-sm"
                    >
                        Filter
                    </Button>
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
                        total: materialApi?.data?.total,
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
