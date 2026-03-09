import { BookOpen, Clock, Download, ExternalLink, FileText } from 'lucide-react';
import { useGetStudentResourcesQuery } from '../../../redux/apiSlices/students/resources.slice';
import { imageUrl } from '../../../redux/api/baseApi';
import Spinner from '../../../components/shared/Spinner';
import { useState } from 'react';
import { Pagination } from 'antd';

export default function StudentResources() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useGetStudentResourcesQuery({ page, limit: 10 });

    const resources = data?.data?.resources || [];
    const pagination = data?.data?.pagination;
    if (isLoading) {
        return <Spinner />;
    }

    return (
        <section className="space-y-6 animate-fadeIn">
            <div className="space-y-4 ">
                {resources.length > 0 ? (
                    <div className="divide-y divide-gray-50 flex flex-col gap-4">
                        {resources?.map((resource: any) => (
                            <div
                                key={resource._id}
                                className="xl:p-4 hover:bg-white/90 transition-colors group bg-white rounded-2xl"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className="mt-1 p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-colors xl:flex h-fit hidden ">
                                            <FileText size={24} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                                    {resource.title}
                                                </h4>
                                                {/* <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                                    {resource.type}
                                                </span> */}
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                                {resource.description}
                                            </p>
                                            <div className="flex flex-col xl:flex-row xl:items-center justify-start  gap-4 pt-2">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                    <Clock size={12} />
                                                    {new Date(resource.createdAt).toLocaleDateString()}
                                                </div>
                                                {resource.createdBy && (
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                        By {resource.createdBy.firstName} {resource.createdBy.lastName}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 shrink-0">
                                        {resource.contentUrl && (
                                            <a
                                                href={resource.contentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
                                            >
                                                <ExternalLink size={16} /> View
                                            </a>
                                        )}
                                        {resource.pdf && (
                                            <a
                                                href={`${imageUrl}${resource.pdf}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
                                            >
                                                <Download size={16} /> Download
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                        <div className="p-4 bg-gray-50 rounded-full text-gray-300 mb-4">
                            <BookOpen size={48} />
                        </div>
                        <h4 className="text-gray-900 font-bold mb-1">No resources found</h4>
                        <p className="text-sm text-gray-500 max-w-[200px]">
                            Check back later for new learning materials.
                        </p>
                    </div>
                )}
                {/* Pagination */}
                <div className="flex justify-end pt-6">
                    <Pagination
                        current={pagination?.page || page}
                        total={pagination?.total}
                        pageSize={pagination?.limit}
                        onChange={(page) => setPage(page)}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        </section>
    );
}
