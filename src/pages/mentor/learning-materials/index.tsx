import { useState } from 'react';
import { Table, Button, Input, Tag } from 'antd';
import { Eye, BookOpen, ExternalLink, Download as DownloadIcon, Search } from 'lucide-react';
import AddResourceModal from '../../../components/modals/mentor/learning-materials/AddResourceModal';
import ResourceDetailsModal from '../../../components/modals/mentor/learning-materials/ResourceDetailsModal';
import RemoveResourceModal from '../../../components/modals/mentor/learning-materials/RemoveResourceModal';
import { useGetLearningMaterialsQuery } from '../../../redux/apiSlices/mentor/learningApi';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';
import Spinner from '../../../components/shared/Spinner';
import { imageUrl } from '../../../redux/api/baseApi';

const LearningMaterials = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    // API CALLS
    const { data: userProfile, isLoading } = useGetprofileQuery({});

    const user = userProfile?.data?.data ?? userProfile?.data ?? userProfile;
    // console.log(user);
    const {
        data,
        isLoading: materialsLoading,
        refetch,
    } = useGetLearningMaterialsQuery(
        {
            targertGroup: user?.userGroup?.[0]?._id,
            page,
            searchTerm,
            ...(user?.userGroupTrack?._id && {
                targetTrack: user.userGroupTrack._id,
            }),
        },
        {
            skip: !user?.userGroup?.[0]?._id,
        },
    );
    const materialsData = data?.data?.resources || [];

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
            title: 'Content URL',
            key: 'url',
            render: (_: any, record: any) => (
                <div>
                    {record.contentUrl ? (
                        <Button
                            href={record.contentUrl}
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
            title: 'File',
            key: 'pdf',
            render: (_: any, record: any) => {
                const downloadUrl = record.pdf ? `${imageUrl}${record.pdf?.replace('/uploads', '')}` : null;
                return (
                    <div>
                        {downloadUrl ? (
                            <Button
                                href={downloadUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                icon={<DownloadIcon size={14} />}
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
            title: 'Target Group',
            key: 'targertGroup',
            render: (_: any, record: any) => (
                <div className="flex gap-1 flex-wrap">
                    {record.targertGroup?.length ? (
                        record.targertGroup.map((group: any) => {
                            const name = group.name?.toUpperCase();

                            const color =
                                name === 'BEGINNERS' ? "#ff6347" :
                                    name === 'EXPEDITION' ? "#32cd32" :
                                        name === 'SKILL PATH' ? "#1e90ff" :
                                            "#d3d3d3";

                            return (
                                <Tag key={group._id} color={color}>
                                    {name}
                                </Tag>
                            );
                        })
                    ) : (
                        'N/A'
                    )}
                </div>
            ),
        }, {
            title: 'Target Track',
            key: 'targetTrack',
            render: (_: any, record: any) => {
                const trackName = record.targetTrack?.name?.toUpperCase();

                if (!trackName) return <span className="text-gray-500">N/A</span>;

                const color =
                    trackName === 'FRONTEND' ? "#f59e0b" :
                        trackName === 'BACKEND' ? "#10b981" :
                            trackName === 'FULLSTACK' ? "#6366f1" :
                                "#8a2be2";

                return (
                    <Tag color={color}>
                        {trackName}
                    </Tag>
                );
            },
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
                </div>
            ),
        },
    ];

    if (isLoading || materialsLoading) {
        return <Spinner />;
    }
    return (
        <section className="">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mentor Resources</h1>
                    <p className="text-gray-500 mt-1">Access curriculum guides, roadmaps, and templates.</p>
                </div>
                <Input
                    placeholder="Search materials"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 h-[40px]"
                    suffix={<Search size={16} className="text-gray-400" />}
                    allowClear
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <Table
                    dataSource={materialsData}
                    columns={columns}
                    rowKey="_id"
                    pagination={{
                        pageSize: data?.pagination?.limit,
                        current: data?.pagination?.page,
                        total: data?.pagination?.total,
                        onChange: (page) => {
                            setPage(page);
                        },
                    }}
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
