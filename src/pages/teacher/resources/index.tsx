import { useState } from 'react';
import { Table, Button, Input, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, FilterOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { HiOutlineDocumentText } from 'react-icons/hi';
import HeaderTitle from '../../../components/shared/HeaderTitle';

import ResourceDetailsModal from '../../../components/modals/teacher/ResourceDetailsModal';
import CreateResourceModal from '../../../components/modals/teacher/CreateResourceModal';
import { useCreateResourseMutation, useDeleteResourseMutation, useGetResourcesQuery, useUpdateResourseMutation } from '../../../redux/apiSlices/teacher/resourceSlice';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

export interface ResourceItem {
    key: string;
    title: string;
    description: string;
    type: string;
    targets: string[];
    uploadDate: string;
    targetAudience: string;
    status: string;
    contentUrl?: string;
    materialType?: string;
}

const Resources = () => {
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
    const {data: resources, isLoading, isFetching,refetch}= useGetResourcesQuery({page: page, limit: 10, searchTerm: searchText});
    const [createResourse] = useCreateResourseMutation();
    const [updateResource] = useUpdateResourseMutation();
    const [deleteResource] = useDeleteResourseMutation();
    
    const newData = resources?.data?.resources?.map((item)=>{
        return {
            key: item._id,
            title: item.title,
            type: item.type,
            targets: item?.targertGroup?.name? [item?.targertGroup?.name]: [],
            targetAudience: item.targeteAudience,
            uploadDate: item.createdAt,
            status: item.markAsAssigned ? 'Active' : 'Inactive',
            contentUrl: item.contentUrl,
            materialType: item.type,
            targertGroup: item.targertGroup?._id
        }
    })
    const handleView = (record: ResourceItem) => {
        setSelectedResource(record);
        setIsDetailsModalOpen(true);
    };

    const handleEdit = (record: ResourceItem) => {
        setSelectedResource(record);
        setIsCreateModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedResource(null);
        setIsCreateModalOpen(true);
    };

    const handleDelete = async (key: string) => {
    
        
        await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { error }: any = await deleteResource({id: key});
                if (!error) {
                    toast.success('Resource deleted successfully');
                    refetch()
                    return;
                }
                toast.error(error?.data?.message || 'Failed to delete resource');
            }
        });
    };

    const handleSave = async (values: any) => {
        if (selectedResource) {
            const { error, data }: any = await updateResource({
                id: selectedResource.key,
                data: {
                    ...values,
                },
            });

            if (!error) {
                setIsCreateModalOpen(false);
                toast.success(data?.message || 'Resource updated successfully');
                refetch()
                return;
            }
            toast.error(error?.data?.message || 'Failed to update resource');
        } else {
            
            const { error, data }: any = await createResourse({
                ...values,
                markAsAssigned: true
            });
            if (!error) {
                setIsCreateModalOpen(false);
                toast.success(data?.message || 'Resource created successfully');
                refetch()
                return;
            }
            toast.error(error?.data?.message || 'Failed to create resource');
        }
    };

    const columns: ColumnsType<any> = [
        {
            title: 'TITLE',
            dataIndex: 'title',
            key: 'title',
            render: (text) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                        <HiOutlineDocumentText size={20} className="text-gray-400" />
                    </div>
                    <span className="font-semibold text-gray-800">{text}</span>
                </div>
            ),
        },
        {
            title: 'TYPE',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag className="bg-red-50 text-red-500 border-none rounded px-3 py-1 text-xs font-semibold">{type}</Tag>
            ),
        },
        {
            title: 'TARGET',
            dataIndex: 'targets',
            key: 'targets',
            render: (targets: string[]) => (
                <div className="flex flex-col gap-1">
                    {targets.map((target, idx) => (
                        <Tag
                            key={idx}
                            className="bg-green-50 text-green-600 border-none rounded-full px-3 py-1 text-xs font-medium w-fit"
                        >
                            {target}
                        </Tag>
                    ))}
                </div>
            ),
        },
        {
            title: 'UPLOAD DATE',
            dataIndex: 'uploadDate',
            key: 'uploadDate',
            render: (date) => <span className="text-gray-600">{new Date(date).toLocaleDateString('en-GB')}</span>,
        },
        // {
        //     title: 'STATUS',
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: (status) => (
        //         <Select
        //             defaultValue={status}
        //             style={{ width: 100 }}
        //             className="rounded-lg"
        //             options={[
        //                 { value: 'Active', label: <span className="text-green-600 font-medium">Active</span> },
        //                 { value: 'Inactive', label: <span className="text-red-600 font-medium">Inactive</span> },
        //             ]}
        //         />
        //     ),
        // },
        {
            title: 'ACTION',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record)}
                        className="flex items-center gap-1 border-gray-200 text-gray-600 hover:text-blue-600"
                    >
                        View
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        className="flex items-center gap-1 border-gray-200 text-gray-600 hover:text-green-600"
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record.key)}
                        className="flex items-center gap-1 border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="">
            <div className="flex justify-between items-center mb-6">
                <HeaderTitle title="Resources" />
                <div className="flex gap-3">
                    <Input
                        placeholder="Search student"
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="w-72 h-[42px] rounded-lg border-gray-200"
                        onChange={(e)=>setSearchText(e.target.value)}
                    />
                    <Button
                        icon={<FilterOutlined />}
                        className="h-[42px] px-6 rounded-lg border-gray-200 flex items-center gap-2 text-gray-600 font-medium"
                    >
                        Filter
                    </Button>
                    <button
                        onClick={handleAdd}
                        className="h-[42px] bg-[#22C55E] text-white text-sm border-none px-6 rounded-lg font-medium"
                    >
                        + Add Resources
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <Table columns={columns} loading={isLoading || isFetching} dataSource={newData} pagination={{ pageSize: 10,current:page,onChange:(page)=>setPage(page),total:resources?.data?.pagination?.total }} className="" />
            </div>

            <ResourceDetailsModal
                visible={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                resource={selectedResource}
            />

            <CreateResourceModal
                visible={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleSave}
                initialValues={selectedResource}
            />
        </div>
    );
};

export default Resources;
