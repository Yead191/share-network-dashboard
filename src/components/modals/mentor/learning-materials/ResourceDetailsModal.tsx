import { Modal, Tag, Button } from 'antd';
import { X, Calendar, User, Users, FileText, Link as LinkIcon, Download } from 'lucide-react';
import { imageUrl } from '../../../../redux/api/baseApi';
import moment from 'moment';

const ResourceDetailsModal = ({ open, onCancel, resource }: any) => {
    if (!resource) return null;

    const downloadUrl = resource.pdf ? `${imageUrl}${resource.pdf?.replace('/uploads', '')}` : null;

    return (
        <Modal
            title={null}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            closeIcon={null}
            centered
            className="premium-modal"
            styles={{
                content: {
                    padding: 0,
                    borderRadius: '24px',
                    overflow: 'hidden',
                },
            }}
        >
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white">
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <Tag className="bg-white/20 border-white/30 text-white font-semibold px-3 py-0.5 rounded-full uppercase text-[10px] tracking-wider">
                            {resource.type || 'Resource'}
                        </Tag>
                        <Tag className="bg-green-400/20 border-green-400/30 text-green-300 font-semibold px-3 py-0.5 rounded-full uppercase text-[10px] tracking-wider">
                            Mentor Resource
                        </Tag>
                    </div>
                    <h2 className="text-3xl font-bold leading-tight">{resource.title}</h2>
                    <div className="flex flex-wrap gap-6 text-blue-100 text-sm mt-2">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="opacity-70" />
                            <span>Added on {moment(resource.createdAt).format('MMM DD, YYYY')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={16} className="opacity-70" />
                            <span>{resource.targeteAudience || 'All Audiences'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-8 py-8 space-y-8">
                {/* Description */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">About this Material</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {resource.description ||
                            'Access this educational resource to support your teaching and student guidance. This material belongs to the ' +
                                (resource.targertGroup?.name || 'assigned') +
                                ' group.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Audience & Group */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Users size={16} />
                                Target Group
                            </h3>
                            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-700 font-medium">
                                {resource.targertGroup?.name || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Created By */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <User size={16} />
                            Author / Creator
                        </h3>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-700 font-medium">
                            {resource.createdBy?.firstName
                                ? `${resource.createdBy.firstName} ${resource.createdBy.lastName}`
                                : 'ADMIN'}
                        </div>
                    </div>
                </div>

                {/* Resources / Links */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Access Materials</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {resource.contentUrl && (
                            <Button
                                type="primary"
                                href={resource.contentUrl}
                                target="_blank"
                                icon={<LinkIcon size={18} />}
                                className="h-14 flex-1 flex items-center justify-center gap-3 rounded-2xl bg-blue-600 hover:!bg-blue-700 border-none shadow-lg shadow-blue-200 font-bold text-base transition-all hover:-translate-y-0.5"
                            >
                                Open Resource Link
                            </Button>
                        )}
                        {downloadUrl && (
                            <Button
                                href={downloadUrl}
                                download
                                target="_blank"
                                icon={<Download size={18} />}
                                className="h-14 flex-1 flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 hover:!bg-emerald-600 text-white border-none shadow-lg shadow-emerald-200 font-bold text-base transition-all hover:-translate-y-0.5"
                            >
                                Download Content
                            </Button>
                        )}
                        {!resource.contentUrl && !downloadUrl && (
                            <div className="w-full py-4 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <FileText size={24} className="mx-auto mb-2 opacity-30" />
                                No direct assets linked to this resource
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 flex justify-end">
                <Button
                    onClick={onCancel}
                    className="h-11 px-8 rounded-xl border-gray-200 text-gray-600 font-bold hover:bg-white transition-all shadow-sm"
                >
                    Done Viewing
                </Button>
            </div>
        </Modal>
    );
};

export default ResourceDetailsModal;
