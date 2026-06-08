import { useEffect, useState } from 'react';
import Questionnaire from './components/Questionnaire';
import GoalResults from './components/GoalResults';
import GoalSuccessModal from '../../../components/modals/student/GoalSuccessModal';
import { questionnaireData } from '../../../constants/student-data';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import { useSubmitonboardingMutation } from '../../../redux/apiSlices/students/goalSlice';
import { useGetMentorWoopsQuery } from '../../../redux/apiSlices/mentor/mentorWoops';
import Spinner from '../../../components/shared/Spinner';
import WoopList from '../../mentor/woops/components/WoopList';
import WoopDetailsModal from '../../mentor/woops/components/WoopDetailsModal';

type ViewState = 'questionnaire' | 'results';
type TabState = 'goal' | 'woop';

const WoopsTab = ({ profileData }: { profileData: any }) => {
    const { data: woopsRes, isLoading } = useGetMentorWoopsQuery(profileData?.data?._id, { skip: !profileData?.data?._id });
    const [viewingWoop, setViewingWoop] = useState<any | null>(null);

    if (isLoading) return <Spinner />;

    return (
        <div className="mt-2 animate-fadeIn">
            <WoopList 
                woops={woopsRes?.data || []} 
                onView={setViewingWoop} 
                readOnly={true} 
            />
            <WoopDetailsModal 
                visible={!!viewingWoop} 
                woop={viewingWoop} 
                onClose={() => setViewingWoop(null)} 
                readOnly={true} 
            />
        </div>
    );
};

const Goal = () => {
    const { data: profileData, isLoading, refetch } = useProfileQuery(undefined);
    const [submitOnboarding] = useSubmitonboardingMutation();

    const [view, setView] = useState<ViewState>('questionnaire');
    const [activeTab, setActiveTab] = useState<TabState>('goal');
    const [responses, setResponses] = useState<Record<string, string>>({});
    const [showModal, setShowModal] = useState(false);

    const woopGoals = profileData?.data?.woop || [];

    useEffect(() => {
        if (!isLoading) {
            if (woopGoals.length > 0) {
                setView('results');
            } else {
                setView('questionnaire');
            }
        }
    }, [isLoading, woopGoals]);

    const handleResponseChange = (questionId: string, value: string) => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            await submitOnboarding(responses).unwrap();
            await refetch(); // refresh profile
            setShowModal(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setView('results');
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="pb-2 animate-fadeIn">
            {view === 'questionnaire' ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <Questionnaire
                        sections={questionnaireData}
                        responses={responses}
                        onResponseChange={handleResponseChange}
                    />

                    <div className="mt-12 flex justify-start">
                        <button
                            onClick={handleSubmit}
                            className="bg-[#8B5CF6] text-white px-10 py-3 rounded-xl font-semibold hover:bg-[#7C3AED] transition-all"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* Tabs Navigation */}
                    <div className="flex gap-4 border-b border-gray-200 pb-2">
                        <button
                            onClick={() => setActiveTab('goal')}
                            className={`px-6 py-2 font-semibold text-lg transition-all border-b-2 ${
                                activeTab === 'goal'
                                    ? 'border-[#7C3AED] text-[#7C3AED]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Goal Questionnaire
                        </button>
                        <button
                            onClick={() => setActiveTab('woop')}
                            className={`px-6 py-2 font-semibold text-lg transition-all border-b-2 ${
                                activeTab === 'woop'
                                    ? 'border-[#7C3AED] text-[#7C3AED]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            My WOOPs
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-4">
                        {activeTab === 'goal' && <GoalResults />}
                        {activeTab === 'woop' && <WoopsTab profileData={profileData} />}
                    </div>
                </div>
            )}

            {showModal && <GoalSuccessModal onClose={handleCloseModal} isOpen={showModal} />}
        </div>
    );
};

export default Goal;
