// components/WoopFormView.tsx
import React, { useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import WoopStepper from './WoopStepper';
import WoopForm from './WoopForm';
import { useWoopForm } from '../../../../hooks/useWoopForm';
import { stepsData } from '../../../../constants/mentor-data';


type WoopFormViewProps = {
    onSubmit: (formData: any, isEditing: boolean) => Promise<void>;
    onCancel: () => void;
    initialWoop?: any | null; // For edit mode
};

const WoopFormView: React.FC<WoopFormViewProps> = ({
    onSubmit,
    onCancel,
    initialWoop,
}) => {
    const {
        formData,
        currentStep,
        editingWoopId,
        handleDetailChange,
        goNext,
        goBack,
        setEditMode,
        resetForm,
    } = useWoopForm();

    const isEditing = !!editingWoopId || !!initialWoop;
    // const isLoadingSubmit = false; 

    // Set initial data for editing
    useEffect(() => {
        if (initialWoop) {
            setEditMode(initialWoop);
        }
    }, [initialWoop, setEditMode]);

    const currentStepData = stepsData[currentStep];
    const currentStepKey = ['wish', 'outcome', 'obstacle', 'plan'][currentStep - 1] as keyof typeof formData;

    const handleNext = async () => {
        const shouldSubmit = goNext();

        if (shouldSubmit) {
            try {
                await onSubmit(formData, isEditing);
                resetForm();
            } catch (error) {
                // Error handling is done in parent component
                console.error('Submit error:', error);
            }
        }
    };

    const handleBackToList = () => {
        resetForm();
        onCancel();
    };

    return (
        <div className="mx-auto pb-10 max-w-4xl">
            {/* Back Button */}
            <button
                onClick={handleBackToList}
                className="mb-6 text-gray-500 hover:text-[#7C3AED] font-medium flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit"
            >
                <FiArrowLeft className="text-lg" />
                Back to My WOOPs
            </button>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {isEditing ? 'Edit WOOP' : 'Create New WOOP'}
                    </h2>
                    <p className="text-gray-500 text-sm flex items-center gap-2 font-medium">
                        <span className={currentStep >= 1 ? 'text-[#7C3AED]' : ''}>• Wish</span>
                        <span className={currentStep >= 2 ? 'text-[#7C3AED]' : ''}>• Outcome</span>
                        <span className={currentStep >= 3 ? 'text-[#7C3AED]' : ''}>• Obstacle</span>
                        <span className={currentStep >= 4 ? 'text-[#7C3AED]' : ''}>• Plan</span>
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

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between items-center">
                <div>
                    <button
                        onClick={handleBackToList}
                        className="px-6 py-2.5 text-red-500 hover:bg-red-50 font-semibold rounded-xl transition-colors border border-transparent hover:border-red-100"
                    >
                        Cancel
                    </button>
                </div>

                <div className="flex gap-3">
                    {currentStep > 1 && (
                        <button
                            onClick={goBack}
                            className="px-8 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                            Back
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        className="px-10 py-3 text-white font-bold rounded-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg flex items-center gap-2"
                        style={{
                            backgroundColor: currentStepData.color,
                            boxShadow: `0 4px 14px 0 ${currentStepData.color}40`,
                        }}
                    >
                        {currentStep === 4 ? 'Save WOOP' : 'Next Step'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WoopFormView;