import { useState } from 'react';
import { Table, Button, Input, Tag } from 'antd';
import { Eye, BookOpen, ExternalLink, Download as DownloadIcon, Search } from 'lucide-react';
import ResourceDetailsModal from '../../../components/modals/mentor/learning-materials/ResourceDetailsModal';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';
import Spinner from '../../../components/shared/Spinner';
import { imageUrl } from '../../../redux/api/baseApi';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import { useGetCoordinatorResourcesQuery } from '../../../redux/apiSlices/coordinator/resources';

const CoordinatorResources = () => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<any>();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // API CALLS
    const { data: userProfile, isLoading: isProfileLoading } = useGetprofileQuery({});
    const user = userProfile?.data?.data ?? userProfile?.data ?? userProfile;
    console.log(user)
    const {
        data,
        isLoading: materialsLoading,
    } = useGetCoordinatorResourcesQuery(
        {
            targertGroup: user?.userGroup?.map((group: any) => group._id),
            page,
            searchTerm,
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
                            <span className="font-medium text-xs text-gray-400">No File</span>
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
                                <Tag key={group._id} color={color} className="rounded-full px-3 border-none font-medium text-[10px]">
                                    {name}
                                </Tag>
                            );
                        })
                    ) : (
                        'N/A'
                    )}
                </div>
            ),
        },
        {
            title: 'Target Track',
            key: 'targetTrack',
            render: (_: any, record: any) => {
                const trackName = record.targetTrack?.name?.toUpperCase();

                if (!trackName) return <span className="text-gray-500 text-xs">N/A</span>;

                const color =
                    trackName === 'FRONTEND' ? "#f59e0b" :
                        trackName === 'BACKEND' ? "#10b981" :
                            trackName === 'FULLSTACK' ? "#6366f1" :
                                "#8a2be2";

                return (
                    <Tag color={color} className="rounded-full px-3 border-none font-medium text-[10px]">
                        {trackName}
                    </Tag>
                );
            },
        },
        {
            title: 'Date added',
            dataIndex: 'createdAt',
            key: 'dateAdded',
            render: (text: string) => <span className="text-gray-500 text-xs font-medium">{new Date(text).toLocaleDateString()}</span>,
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
                        className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 border-gray-100 bg-gray-50/50 h-9 rounded-lg"
                    >
                        View Details
                    </Button>
                </div>
            ),
        },
    ];

    if (isProfileLoading || (materialsLoading && page === 1)) {
        return <Spinner />;
    }

    return (
        <section className="">
            <div className="flex justify-between items-center mb-6">
                <HeaderTitle title="Coordinator Resources" />
                <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                    className="w-72 h-[42px] rounded-xl border-gray-100 shadow-sm"
                    suffix={<Search size={18} className="text-gray-400" />}
                    allowClear
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <Table
                    dataSource={materialsData}
                    columns={columns}
                    rowKey="_id"
                    pagination={{
                        pageSize: data?.data?.pagination?.limit || 10,
                        current: data?.data?.pagination?.page || 1,
                        total: data?.data?.pagination?.total || 0,
                        onChange: (page) => {
                            setPage(page);
                        },
                        showSizeChanger: false,
                        className: "px-6 py-4 border-t border-gray-50"
                    }}
                    className="custom-table"
                    loading={materialsLoading}
                />
            </div>

            <ResourceDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                resource={selectedResource}
            />
        </section>
    );
};

export default CoordinatorResources;
