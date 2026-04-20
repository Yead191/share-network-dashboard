import { BookOpen, ExternalLink, Download as DownloadIcon, Search, Eye } from 'lucide-react';
import { useGetStudentResourcesQuery } from '../../../redux/apiSlices/students/resources.slice';
import { imageUrl } from '../../../redux/api/baseApi';
import Spinner from '../../../components/shared/Spinner';
import { useState } from 'react';
import { Input, Table, Button, Select, Tag } from 'antd';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';
import ResourceDetailsModal from '../../../components/modals/mentor/learning-materials/ResourceDetailsModal';

export default function StudentResources() {
    const { data: profile, isLoading: isProfileLoading } = useGetprofileQuery({})
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [type, setType] = useState('ALL');
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState();
    // console.log(profile)

    const { data, isLoading, isFetching } = useGetStudentResourcesQuery({
        page, limit: 10,
        searchTerm,
        type,
        targertGroup: profile?.data?.userGroup?.[0]?._id,
        ...(profile?.data?.userGroupTrack?._id && {
            targetTrack: profile?.data?.userGroupTrack?._id,
        }),
    },
        {
            skip: !profile?.data?.userGroup?.[0]?._id
        }
    );

    const resources = data?.data?.resources || [];
    const pagination = data?.data?.pagination;

    const columns = [
        {
            title: 'Material',
            key: 'material',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-sm">
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
            title: 'Type',
            key: 'type',
            dataIndex: 'type',
            render: (text: string) => (
                <Tag color={text === 'LECTURE' ? 'purple' : text === 'SLIDES' ? 'orange' : 'cyan'}>
                    {text || 'MATERIAL'}
                </Tag>
            )
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
                            <span className="font-medium text-gray-400 text-xs">No File</span>
                        )}
                    </div>
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
                        className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 border-gray-100 bg-gray-50/30"
                    >
                        View
                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading && !isFetching || isProfileLoading) {
        return <Spinner />;
    }

    return (
        <section className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Student Resources</h1>
                    <p className="text-gray-500 mt-1 text-sm">Access your learning materials, lectures, and slides.</p>
                </div>
                <div className="flex items-center gap-3">
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
                    <Input
                        placeholder="Search materials..."
                        prefix={<Search size={18} className="text-gray-400 mr-2" />}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // reset to first page on search
                        }}
                        className="max-w-md w-full h-[40px] rounded-xl"
                        allowClear
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <Table
                    dataSource={resources}
                    columns={columns}
                    rowKey="_id"
                    loading={isFetching}
                    pagination={{
                        pageSize: pagination?.limit,
                        current: pagination?.page || page,
                        total: pagination?.total,
                        onChange: (page) => {
                            setPage(page);
                        },
                    }}
                    className="custom-table"
                />
            </div>

            <ResourceDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                resource={selectedResource}
            />
        </section>
    );
}
