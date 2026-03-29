import { useState } from 'react';
import { Table, Button, Input, Select, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, FilterOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IoTimeOutline, IoLocationOutline } from 'react-icons/io5';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import ClassDetailsModal from '../../../components/modals/teacher/ClassDetailsModal';
import CreateClassModal from '../../../components/modals/teacher/CreateClassModal';
import {
    useAddClassTeacherMutation,
    useDeleteClassTeacherMutation,
    useGetTeacherClassesQuery,
    useUpdateClassTeacherMutation,
} from '../../../redux/apiSlices/teacher/homeSlice';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useGetUserGroupsQuery } from '../../../redux/apiSlices/teacher/resourceSlice';

export interface ClassScheduleItem {
    key: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    targets: string[];
    status: string;
}

export interface ClassData {
    title: string;
    description: string;
    date: any; // important ✅
    location: string;
    virtualClass: boolean;
}

const ClassSchedule = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
    const { data, isLoading, isFetching } = useGetTeacherClassesQuery({
        page: page,
        limit: 10,
        searchTerm: searchTerm,
        userGroup: selectedGroup
    });
    const [addClassTeacher, { isLoading: isAddingClass }] = useAddClassTeacherMutation();
    const [updateClassTeacher, { isLoading: isUpdatingClass }] = useUpdateClassTeacherMutation();
    const [deleteClassTeacher] = useDeleteClassTeacherMutation();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassScheduleItem | null>(null);
    const { data: userGroups } = useGetUserGroupsQuery({ page: 1, limit: 100 });
    const modifiedData: ClassScheduleItem[] =
        data?.data.map((item) => ({
            key: item._id,
            title: item.title,
            description: item.description,
            date: item.classDate,
            status: item.published ? 'Active' : 'Inactive',
            time: item.classDate,
            location: item.location,
            targets: item.userGroup?.map((group) => group?.name) || [],
        })) || [];

    const handleView = (record: ClassScheduleItem) => {
        setSelectedClass(record);
        setIsDetailsModalOpen(true);
    };

    const handleEdit = (record: ClassScheduleItem) => {
        setSelectedClass(record);
        setIsCreateModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedClass(null);
        setIsCreateModalOpen(true);
    };

    const handleDelete = async (record: ClassScheduleItem) => {
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
                const { error }: any = await deleteClassTeacher(record.key);
                if (!error) {
                    toast.success('Class deleted successfully');
                    return;
                }
                toast.error(error?.data?.message || 'Failed to delete class');
            }
        });
    };

    const handleStatusChange = (value: string, record: ClassScheduleItem) => {
        if (value == 'Active') {
            updateClassTeacher({
                id: record.key,
                data: {
                    published: true,
                },
            });
        } else {
            updateClassTeacher({
                id: record.key,
                data: {
                    published: false,
                },
            });
        }
    };

    const handleSave = async (values: ClassData) => {
        if (selectedClass) {
            const { error, data }: any = await updateClassTeacher({
                id: selectedClass.key,
                data: {
                    ...values,
                    classDate: values?.date?.toISOString(),
                },
            });

            if (!error) {
                setIsCreateModalOpen(false);
                toast.success(data?.message || 'Class updated successfully');
                return;
            }
            toast.error(error?.data?.message || 'Failed to update class');
        } else {
            const { error }: any = await addClassTeacher({
                title: values.title,
                description: values.description,
                classDate: values.date.toISOString(),
                location: values.location,
                virtualClass: values.virtualClass,
                published: true,
            });

            if (!error) {
                setIsCreateModalOpen(false);
                toast.success('Class added successfully');
                return;
            }

            toast.error(error?.data?.message || 'Failed to add class');
        }
    };

    const columns: ColumnsType<ClassScheduleItem> = [
        {
            title: 'CLASS',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                        <IoTimeOutline size={20} className="text-gray-400" />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800">{text}</div>
                        <div className="text-xs text-gray-400 truncate w-40">{record.description}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'DATE & TIME',
            key: 'dateTime',
            render: (_, record) => (
                <div className="text-gray-600">
                    <div className="font-medium">{new Date(record.date).toDateString()}</div>
                    <div className="text-xs">{new Date(record.time).toLocaleTimeString()}</div>
                </div>
            ),
        },
        {
            title: 'LOCATION',
            dataIndex: 'location',
            key: 'location',
            render: (text) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <IoLocationOutline size={16} className="text-gray-400" />
                    <span className="text-sm">{text}</span>
                </div>
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
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    defaultValue={status}
                    style={{ width: 100 }}
                    onChange={(value) => handleStatusChange(value, record)}
                    bordered={true}
                    className="rounded-lg status-select"
                    options={[
                        { value: 'Active', label: <span className="text-green-600 font-medium">Active</span> },
                        { value: 'Inactive', label: <span className="text-red-600 font-medium">Inactive</span> },
                    ]}
                />
            ),
        },
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
                        className="flex items-center gap-1 border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                        onClick={() => handleDelete(record)}
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
                <HeaderTitle title="Class Schedule Management" />
                <div className="flex gap-3">
                    <Input
                        placeholder="Search student"
                        prefix={<SearchOutlined className="text-gray-400" />}
                        onChange={(v) => setSearchTerm(v.target.value)}
                        className="w-72 h-[42px] rounded-lg border-gray-200"
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
                    <button
                        onClick={handleAdd}
                        className="h-[42px] bg-[#22C55E] text-white text-sm border-none px-6 rounded-lg font-medium"
                    >
                        + Add Class Schedule
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <Table
                    loading={isLoading || isFetching}
                    columns={columns}
                    dataSource={modifiedData}
                    pagination={{
                        pageSize: 10,
                        current: page,
                        onChange: (page) => setPage(page),
                        total: data?.pagination.total,
                    }}
                    className=""
                />
            </div>

            <ClassDetailsModal
                visible={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                classData={selectedClass}
            />

            <CreateClassModal
                visible={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleSave}
                initialValues={selectedClass}
                isLoading={isAddingClass || isUpdatingClass}
            />
        </div>
    );
};

export default ClassSchedule;
