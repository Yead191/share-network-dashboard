import { useState } from 'react';
import { Table, Button } from 'antd';
import { Eye, Trash2, Plus } from 'lucide-react';
import AddResourceModal from '../../../components/modals/mentor/learning-materials/AddResourceModal';
import ResourceDetailsModal from '../../../components/modals/mentor/learning-materials/ResourceDetailsModal';
import RemoveResourceModal from '../../../components/modals/mentor/learning-materials/RemoveResourceModal';
import { useGetLearningMaterialsQuery } from '../../../redux/apiSlices/mentor/learningApi';

const LearningMaterials = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState();
    const { data, refetch } = useGetLearningMaterialsQuery(undefined);
    const materialsData = data?.data?.resources || [];

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span className="font-medium text-gray-500">{text}</span>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (text: string) => <span className="text-gray-500">{text}</span>,
        },
        {
            title: 'Category',
            key: 'category',
            render: (_: any, record: any) => (
                <span className="text-gray-500">{record.targertGroup?.name || 'N/A'}</span>
            ),
        },
        {
            title: 'Date added',
            dataIndex: 'createdAt',
            key: 'dateAdded',
            render: (text: string) => <span className="text-gray-500">{new Date(text).toLocaleDateString()}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                    <Button
                        icon={<Eye size={16} />}
                        onClick={() => {
                            setSelectedResource(record);
                            setIsDetailsModalOpen(true);
                        }}
                        className="flex items-center gap-2 text-gray-400 hover:text-primary border-gray-100 bg-gray-50/30"
                    >
                        View
                    </Button>
                    {/* <Button
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => {
                            setSelectedResource(record);
                            setIsRemoveModalOpen(true);
                        }}
                        className="flex items-center gap-2 border-[#FF4D4F] text-[#FF4D4F] bg-white hover:bg-red-50"
                    >
                        Remove
                    </Button> */}
                </div>
            ),
        },
    ];

    return (
        <section className="">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mentor Resources</h1>
                    <p className="text-gray-500 mt-1">Access curriculum guides, roadmaps, and templates.</p>
                </div>
                {/* <Button
                    type="default"
                    icon={<Plus size={18} className="text-gray-400" />}
                    onClick={() => setIsAddModalOpen(true)}
                    className="h-11 px-4 rounded-xl flex items-center gap-2 text-gray-500 font-medium border-gray-200"
                >
                    Add Resources
                </Button> */}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <Table
                    dataSource={materialsData}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 7, hideOnSinglePage: true }}
                    className="custom-table"
                />
            </div>

            <AddResourceModal open={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)} refetch={refetch} />

            <ResourceDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                resource={selectedResource}
            />

            <RemoveResourceModal
                open={isRemoveModalOpen}
                onCancel={() => setIsRemoveModalOpen(false)}
                onRemove={refetch}
                resource={selectedResource}
            />
        </section>
    );
};

export default LearningMaterials;
