import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Modal } from 'antd';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import {
    useCreateMentorWoopsMutation,
    useGetMentorWoopsQuery,
    useUpdateMentorWoopsMutation,
    useDeleteMentorWoopsMutation
} from '../../../redux/apiSlices/mentor/mentorWoops';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';
import Spinner from '../../../components/shared/Spinner';
import WoopList from './components/WoopList';
import WoopFormView from './components/WoopFormView';
import WoopDetailsModal from './components/WoopDetailsModal';
import WoopTips from './components/WoopTips';

const Woops = () => {
    const { data: profileRes, isLoading: profileLoading } = useGetprofileQuery({});
    const [createWoops,] = useCreateMentorWoopsMutation();
    const [updateWoops,] = useUpdateMentorWoopsMutation();
    const [deleteWoops, { isLoading: isDeleting }] = useDeleteMentorWoopsMutation();

    const { data: woopsRes, isLoading: woopsLoading, refetch } = useGetMentorWoopsQuery(profileRes?.data?._id, { skip: !profileRes?.data?._id });

    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [editingWoop, setEditingWoop] = useState<any | null>(null);
    const [viewingWoop, setViewingWoop] = useState<any | null>(null);
    const [showTips, setShowTips] = useState<boolean>(true);

    // Effect to set initial view
    useEffect(() => {
        if (woopsRes?.data && woopsRes.data.length > 0) {
            setViewMode('list');
            setShowTips(false);
        } else if (woopsRes?.data?.length === 0) {
            setViewMode('form');
            setShowTips(true);
        }
    }, [woopsRes]);

    const handleSubmit = async (formData: any, isEditing: boolean) => {
        try {
            let res;
            if (isEditing && editingWoop) {
                res = await updateWoops({ id: editingWoop._id, data: formData }).unwrap();
            } else {
                res = await createWoops(formData).unwrap();
            }

            if (res?.success) {
                toast.success(res.message || `WOOP ${isEditing ? 'updated' : 'created'} successfully!`);
            } else {
                toast.success(`WOOP ${isEditing ? 'updated' : 'created'} successfully!`);
            }

            setViewMode('list');
            setEditingWoop(null);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} WOOP`);
            throw error; // Let form view know it failed
        }
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this WOOP?',
            icon: <FiAlertCircle className="text-red-500 mt-1 mr-2" />,
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            centered: true,
            onOk: async () => {
                try {
                    await deleteWoops(id).unwrap();
                    toast.success('WOOP deleted successfully!');
                    refetch();
                } catch (error: any) {
                    toast.error(error?.data?.message || 'Failed to delete WOOP');
                }
            }
        });
    };

    const handleCreateNew = () => {
        setEditingWoop(null);
        setShowTips(true);
        setViewMode('form');
    };

    const handleEdit = (woop: any) => {
        setEditingWoop(woop);
        setShowTips(false);
        setViewMode('form');
    };

    if (profileLoading || woopsLoading) {
        return <Spinner />;
    }

    return (
        <div className="w-full">
            {viewMode === 'list' ? (
                <WoopList
                    woops={woopsRes?.data || []}
                    onCreateNew={handleCreateNew}
                    onView={setViewingWoop}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                />
            ) : showTips && !editingWoop ? (
                <div className="mx-auto pb-10 max-w-4xl">
                    <button
                        onClick={() => setViewMode('list')}
                        className="mb-6 text-gray-500 hover:text-[#7C3AED] font-medium flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit"
                    >
                        <FiArrowLeft className="text-lg" />
                        Back to My WOOPs
                    </button>
                    <WoopTips onReset={() => setShowTips(false)} />
                </div>
            ) : (
                <WoopFormView
                    initialWoop={editingWoop}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setViewMode('list');
                        setEditingWoop(null);
                    }}
                />
            )}

            <WoopDetailsModal
                visible={!!viewingWoop}
                woop={viewingWoop}
                onClose={() => setViewingWoop(null)}
                onEdit={(woop) => {
                    setViewingWoop(null);
                    handleEdit(woop);
                }}
            />
        </div>
    );
};

export default Woops;
