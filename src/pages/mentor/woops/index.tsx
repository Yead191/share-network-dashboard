import { useState, useEffect } from 'react';
import { Modal, Tooltip } from 'antd';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiAlertCircle } from 'react-icons/fi';
import WoopStepper from './components/WoopStepper';
import WoopForm from './components/WoopForm';
import WoopTips from './components/WoopTips';
import { stepsData } from '../../../constants/mentor-data';
import {
    useCreateMentorWoopsMutation,
    useGetMentorWoopsQuery,
    useUpdateMentorWoopsMutation,
    useDeleteMentorWoopsMutation
} from '../../../redux/apiSlices/mentor/mentorWoops';
import { toast } from 'sonner';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';
import Spinner from '../../../components/shared/Spinner';
import { getImageUrl } from '../../../utils/getImageUrl';

const Woops = () => {
    const { data: profileRes, isLoading: profileLoading } = useGetprofileQuery({});
    const [createWoops, { isLoading: isCreating }] = useCreateMentorWoopsMutation();
    const [updateWoops, { isLoading: isUpdating }] = useUpdateMentorWoopsMutation();
    const [deleteWoops, { isLoading: isDeleting }] = useDeleteMentorWoopsMutation();

    const { data: woopsRes, isLoading: woopsLoading, refetch } = useGetMentorWoopsQuery(profileRes?.data?._id, { skip: !profileRes?.data?._id })

    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [editingWoopId, setEditingWoopId] = useState<string | null>(null);
    const [viewingWoop, setViewingWoop] = useState<any | null>(null);

    const [currentStep, setCurrentStep] = useState(1);
    const [showTips, setShowTips] = useState(true);

    const defaultFormData = {
        wish: { detail: '' },
        outcome: { detail: '' },
        obstacle: { detail: '' },
        plan: { detail: '' },
    };

    const [formData, setFormData] = useState(defaultFormData);

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

    const stepKeys: Record<number, 'wish' | 'outcome' | 'obstacle' | 'plan'> = {
        1: 'wish',
        2: 'outcome',
        3: 'obstacle',
        4: 'plan',
    };

    const handleDetailChange = (detail: string) => {
        const key = stepKeys[currentStep];
        setFormData((prev) => ({
            ...prev,
            [key]: { detail },
        }));
    };

    const handleNext = async () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            try {
                let res;
                if (editingWoopId) {
                    res = await updateWoops({ id: editingWoopId, data: formData }).unwrap();
                } else {
                    res = await createWoops(formData).unwrap();
                }

                if (res?.success) {
                    toast.success(res.message || `WOOP ${editingWoopId ? 'updated' : 'created'} successfully!`);
                } else {
                    toast.success(`WOOP ${editingWoopId ? 'updated' : 'created'} successfully!`);
                }

                setFormData(defaultFormData);
                setCurrentStep(1);
                setEditingWoopId(null);
                setViewMode('list');
                refetch();
            } catch (error: any) {
                toast.error(error?.data?.message || `Failed to ${editingWoopId ? 'update' : 'create'} WOOP`);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleReset = () => {
        setCurrentStep(1);
        setShowTips(false);
    };

    const handleCreateNew = () => {
        setFormData(defaultFormData);
        setEditingWoopId(null);
        setCurrentStep(1);
        setShowTips(true);
        setViewMode('form');
    };

    const handleEdit = (woop: any) => {
        setFormData({
            wish: { detail: woop.wish?.detail || '' },
            outcome: { detail: woop.outcome?.detail || '' },
            obstacle: { detail: woop.obstacle?.detail || '' },
            plan: { detail: woop.plan?.detail || '' },
        });
        setEditingWoopId(woop._id);
        setCurrentStep(1);
        setShowTips(false);
        setViewMode('form');
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

    if (profileLoading || woopsLoading) {
        return <Spinner />
    }

    // List View
    if (viewMode === 'list') {
        const woopsList = woopsRes?.data || [];

        return (
            <div className="mx-auto pb-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">My WOOPs</h2>
                        <p className="text-gray-500">Manage and track your goals with the WOOP method.</p>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="bg-[#7C3AED] hover:bg-[#6d28d9] transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-md shadow-purple-500/30"
                    >
                        <FiPlus className="text-lg" />
                        Create New WOOP
                    </button>
                </div>

                {woopsList.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                            <FiPlus className="text-[#7C3AED] text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No WOOPs found</h3>
                        <p className="text-gray-500 mb-6">Create your first WOOP to start achieving your goals.</p>
                        <button
                            onClick={handleCreateNew}
                            className="bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#6d28d9] transition-colors"
                        >
                            Get Started
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {woopsList?.map((woop: any) => (
                            <div key={woop._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                                {/* Decorative top border */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7C3AED] to-purple-300"></div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex -space-x-3">
                                        <Tooltip title={`${woop?.mentorId?.firstName || ''} ${woop?.mentorId?.lastName || ''} (Mentor)`} placement="top">
                                            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm relative z-10 hover:z-30 transition-transform hover:scale-110 cursor-pointer">
                                                <img
                                                    src={getImageUrl(woop?.mentorId?.profile) || 'https://ui-avatars.com/api/?name=Mentor&background=random'}
                                                    alt="Mentor"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Mentor&background=random' }}
                                                />
                                            </div>
                                        </Tooltip>
                                        <Tooltip title={`${woop?.studentId?.firstName || ''} ${woop?.studentId?.lastName || ''} (Student)`} placement="top">
                                            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm relative z-20 hover:z-30 transition-transform hover:scale-110 cursor-pointer">
                                                <img
                                                    src={getImageUrl(woop?.studentId?.profile) || 'https://ui-avatars.com/api/?name=Student&background=random'}
                                                    alt="Student"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Student&background=random' }}
                                                />
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setViewingWoop(woop)}
                                            className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                            title="View Details"
                                        >
                                            <FiEye />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(woop)}
                                            className="w-8 h-8 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center hover:bg-purple-100 transition-colors"
                                            title="Edit WOOP"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(woop._id)}
                                            className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                                            title="Delete WOOP"
                                            disabled={isDeleting}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-grow">
                                    <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100/50">
                                        <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">Wish</span>
                                        <p className="text-gray-700 text-sm line-clamp-2">{woop.wish?.detail || 'Not specified'}</p>
                                    </div>
                                    <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">Outcome</span>
                                        <p className="text-gray-700 text-sm line-clamp-2">{woop.outcome?.detail || 'Not specified'}</p>
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-400">WOOP Card</span>
                                    <button
                                        onClick={() => setViewingWoop(woop)}
                                        className="text-sm font-semibold text-[#7C3AED] hover:text-purple-800 transition-colors flex items-center gap-1"
                                    >
                                        View Details <span aria-hidden="true">&rarr;</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* View Details Modal */}
                <Modal
                    title={<div className="text-xl font-bold text-gray-800 border-b pb-3">WOOP Details</div>}
                    open={!!viewingWoop}
                    onCancel={() => setViewingWoop(null)}
                    footer={
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                            <button
                                onClick={() => {
                                    handleEdit(viewingWoop);
                                    setViewingWoop(null);
                                }}
                                className="px-5 py-2.5 bg-purple-50 text-[#7C3AED] hover:bg-purple-100 font-semibold rounded-xl transition-colors flex items-center gap-2"
                            >
                                <FiEdit2 /> Edit
                            </button>
                            <button
                                onClick={() => setViewingWoop(null)}
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    }
                    centered
                    width={700}
                    className="premium-modal"
                    closeIcon={<span className="text-gray-400 hover:text-gray-600 text-xl">&times;</span>}
                >
                    {viewingWoop && (
                        <div className="py-2 space-y-6">
                            <div className="flex items-center gap-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={getImageUrl(viewingWoop?.mentorId?.profile) || 'https://ui-avatars.com/api/?name=Mentor&background=random'}
                                        alt="Mentor"
                                        className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Mentor&background=random' }}
                                    />
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mentor</p>
                                        <p className="text-gray-800 font-bold text-lg">{viewingWoop.mentorId?.firstName} {viewingWoop.mentorId?.lastName}</p>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-gray-200"></div>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={getImageUrl(viewingWoop.studentId?.profile) || 'https://ui-avatars.com/api/?name=Student&background=random'}
                                        alt="Student"
                                        className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Student&background=random' }}
                                    />
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Student</p>
                                        <p className="text-gray-800 font-bold text-lg">{viewingWoop.studentId?.firstName} {viewingWoop.studentId?.lastName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="text-purple-800 font-bold flex items-center gap-2 mb-3 pb-2 border-b border-purple-100">
                                        <span className="w-8 h-8 rounded-lg bg-purple-200 flex items-center justify-center text-sm shadow-sm">W</span>
                                        Wish
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed text-[15px]">{viewingWoop.wish?.detail || 'Not specified'}</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="text-blue-800 font-bold flex items-center gap-2 mb-3 pb-2 border-b border-blue-100">
                                        <span className="w-8 h-8 rounded-lg bg-blue-200 flex items-center justify-center text-sm shadow-sm">O</span>
                                        Outcome
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed text-[15px]">{viewingWoop.outcome?.detail || 'Not specified'}</p>
                                </div>
                                <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="text-orange-800 font-bold flex items-center gap-2 mb-3 pb-2 border-b border-orange-100">
                                        <span className="w-8 h-8 rounded-lg bg-orange-200 flex items-center justify-center text-sm shadow-sm">O</span>
                                        Obstacle
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed text-[15px]">{viewingWoop.obstacle?.detail || 'Not specified'}</p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="text-emerald-800 font-bold flex items-center gap-2 mb-3 pb-2 border-b border-emerald-100">
                                        <span className="w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center text-sm shadow-sm">P</span>
                                        Plan
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed text-[15px]">{viewingWoop.plan?.detail || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        );
    }

    // Form View (Create/Edit)
    if (showTips && !editingWoopId) {
        return (
            <div className="mx-auto pb-10">
                <button
                    onClick={() => setViewMode('list')}
                    className="mb-6 text-gray-500 hover:text-[#7C3AED] font-medium flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit"
                >
                    &larr; Back to My WOOPs
                </button>
                <WoopTips onReset={handleReset} />
            </div>
        );
    }

    const currentStepData = stepsData[currentStep];
    const currentStepKey = stepKeys[currentStep];
    const isLoadingSubmit = isCreating || isUpdating;

    return (
        <div className="mx-auto pb-10 max-w-4xl">
            <button
                onClick={() => {
                    setViewMode('list');
                    setEditingWoopId(null);
                }}
                className="mb-6 text-gray-500 hover:text-[#7C3AED] font-medium flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit"
            >
                &larr; Back to My WOOPs
            </button>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {editingWoopId ? 'Edit WOOP' : 'Create WOOP'}
                    </h2>
                    <p className="text-gray-500 text-sm flex items-center gap-2 font-medium">
                        <span className={currentStep >= 1 ? "text-[#7C3AED]" : ""}>• Wish</span>
                        <span className={currentStep >= 2 ? "text-[#7C3AED]" : ""}>• Outcome</span>
                        <span className={currentStep >= 3 ? "text-[#7C3AED]" : ""}>• Obstacle</span>
                        <span className={currentStep >= 4 ? "text-[#7C3AED]" : ""}>• Plan</span>
                    </p>
                </div>
            </div>

            {/* Stepper */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <WoopStepper currentStep={currentStep} />
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <WoopForm
                    stepData={currentStepData}
                    detailValue={formData[currentStepKey].detail}
                    onDetailChange={handleDetailChange}
                />
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between items-center">
                <div>
                    <button
                        onClick={() => {
                            setViewMode('list');
                            setEditingWoopId(null);
                        }}
                        className="px-6 py-2.5 text-red-500 hover:bg-red-50 font-semibold rounded-xl transition-colors border border-transparent hover:border-red-100"
                    >
                        Cancel
                    </button>
                </div>
                <div className="flex gap-3">
                    {currentStep > 1 && (
                        <button
                            onClick={handleBack}
                            disabled={isLoadingSubmit}
                            className="px-8 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 border border-gray-200"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={isLoadingSubmit}
                        className="px-10 py-3 text-white font-bold rounded-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg disabled:opacity-50 flex items-center gap-2"
                        style={{ backgroundColor: currentStepData.color, boxShadow: `0 4px 14px 0 ${currentStepData.color}40` }}
                    >
                        {currentStep === 4 ? (isLoadingSubmit ? 'Saving...' : 'Save Woop') : 'Next Step'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Woops;
