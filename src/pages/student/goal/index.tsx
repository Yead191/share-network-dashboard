import { useEffect, useState } from 'react';
import Questionnaire from './components/Questionnaire';
import GoalResults from './components/GoalResults';
import GoalSuccessModal from '../../../components/modals/student/GoalSuccessModal';
import { questionnaireData } from '../../../constants/student-data';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import { useSubmitonboardingMutation } from '../../../redux/apiSlices/students/goalSlice';
import Spinner from '../../../components/shared/Spinner';

type ViewState = 'questionnaire' | 'results';

const Goal = () => {
    const { data: profileData, isLoading, refetch } = useProfileQuery(undefined);
    console.log(profileData);
    const [submitOnboarding] = useSubmitonboardingMutation();

    const [view, setView] = useState<ViewState>('questionnaire');
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
                <GoalResults />
            )}

            {showModal && <GoalSuccessModal onClose={handleCloseModal} isOpen={showModal} />}
        </div>
    );
};

export default Goal;
