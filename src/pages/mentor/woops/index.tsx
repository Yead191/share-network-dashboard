import { useState } from 'react';
import WoopStepper from './components/WoopStepper';
import WoopForm from './components/WoopForm';
import WoopTips from './components/WoopTips';
import { stepsData } from '../../../constants/mentor-data';
import { useCreateMentorWoopsMutation } from '../../../redux/apiSlices/mentor/mentorWoops';
import { toast } from 'sonner';

const Woops = () => {
    const [createWoops, { isLoading }] = useCreateMentorWoopsMutation();
    const [currentStep, setCurrentStep] = useState(1);
    const [showTips, setShowTips] = useState(true);

    const [formData, setFormData] = useState({
        wish: { detail: '' },
        outcome: { detail: '' },
        obstacle: { detail: '' },
        plan: { detail: '' },
    });

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
                const res = await createWoops(formData).unwrap();
                if (res?.success) {
                    toast.success(res.message || 'WOOP created successfully!');
                } else {
                    toast.success('WOOP created successfully!');
                }
                setShowTips(true);
                setCurrentStep(1);
                setFormData({
                    wish: { detail: '' },
                    outcome: { detail: '' },
                    obstacle: { detail: '' },
                    plan: { detail: '' },
                });
            } catch (error: any) {
                toast.error(error?.data?.message || 'Failed to create WOOP');
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

    if (showTips) {
        return <WoopTips onReset={handleReset} />;
    }

    const currentStepData = stepsData[currentStep];
    const currentStepKey = stepKeys[currentStep];

    return (
        <div className=" mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">WOOP Method</h2>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                        <span>• Wish</span>
                        <span>• Outcome</span>
                        <span>• Obstacle</span>
                        <span>• Plan</span>
                    </p>
                </div>
                {/* <button className="bg-[#7C3AED] text-white px-5 py-2 rounded-lg flex items-center gap-2 font-semibold">
                    <FiEdit2 />
                    Edit woops
                </button> */}
            </div>

            {/* Stepper */}
            <WoopStepper currentStep={currentStep} />

            {/* Form Section */}
            <WoopForm
                stepData={currentStepData}
                detailValue={formData[currentStepKey].detail}
                onDetailChange={handleDetailChange}
            />

            {/* Navigation */}
            <div className="mt-12 flex justify-end gap-3">
                {currentStep > 1 && (
                    <button
                        onClick={handleBack}
                        disabled={isLoading}
                        className="px-8 py-3 bg-gray-50 text-gray-500 font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Back
                    </button>
                )}
                <button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="px-10 py-3 text-white font-bold rounded-lg transition-all transform active:scale-95 shadow-md disabled:opacity-50 flex items-center gap-2"
                    style={{ backgroundColor: currentStepData.color }}
                >
                    {currentStep === 4 ? (isLoading ? 'Saving...' : 'Save Woop') : 'Next Step'}
                </button>
            </div>
        </div>
    );
};

export default Woops;
