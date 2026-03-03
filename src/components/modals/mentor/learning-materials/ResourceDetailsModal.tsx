import { Modal, Button } from 'antd';

const ResourceDetailsModal = ({ open, onCancel, resource }: any) => {
    // console.log(resource);
    return (
        <Modal
            title={<span className="text-xl font-bold">Resources Details</span>}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={600}
            centered
            className="rounded-2xl"
        >
            <div className="mt-6 border border-gray-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 border-b border-gray-100">
                    <div className="bg-gray-50/50 p-4 font-semibold text-gray-500 text-sm">Resource Title</div>
                    <div className="p-4 text-gray-700 text-sm">{resource?.title || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-100">
                    <div className="bg-gray-50/50 p-4 font-semibold text-gray-500 text-sm">Type</div>
                    <div className="p-4 text-gray-700 text-sm">{resource?.type || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-100">
                    <div className="bg-gray-50/50 p-4 font-semibold text-gray-500 text-sm">Category / Group</div>
                    <div className="p-4 text-gray-700 text-sm">{resource?.targertGroup?.name || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-100">
                    <div className="bg-gray-50/50 p-4 font-semibold text-gray-500 text-sm">Target Audience</div>
                    <div className="p-4 text-gray-700 text-sm">{resource?.targeteAudience || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-100">
                    <div className="bg-gray-50/50 p-4 font-semibold text-gray-500 text-sm">Created By</div>
                    <div className="p-4 text-gray-700 text-sm">
                        {resource?.createdBy?.firstName} {resource?.createdBy?.lastName}
                    </div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-100">
                    <div className="bg-gray-50/50 p-4 font-semibold text-gray-500 text-sm">Created At</div>
                    <div className="p-4 text-gray-700 text-sm">
                        {resource?.createdAt ? new Date(resource.createdAt).toLocaleString() : 'N/A'}
                    </div>
                </div>
                <div className="grid grid-cols-2">
                    <div className="bg-gray-50/50 p-4 font-semibold text-gray-500 text-sm">Resource URL</div>
                    <div className="p-4">
                        {resource?.contentUrl ? (
                            <a
                                href={resource.contentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm font-medium"
                            >
                                View Resource
                            </a>
                        ) : (
                            <span className="text-gray-400">N/A</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <Button onClick={onCancel} className="h-10 px-8 rounded-lg font-semibold text-gray-600 border-gray-200">
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default ResourceDetailsModal;
