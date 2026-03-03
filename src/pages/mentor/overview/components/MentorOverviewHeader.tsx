import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { useProfileQuery } from '../../../../redux/apiSlices/authSlice';

const MentorOverviewHeader = () => {
    const { data: userData } = useProfileQuery({});
    const user = userData?.data;
    return (
        <div className="bg-white p-6 rounded-xl flex justify-between items-start mb-6">
            <div className="max-w-3xl">
                <h1 className="text-2xl font-bold mb-2">
                    Hi {user?.firstName} {user?.lastName} !
                </h1>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Thanks for being a mentor! Your guidance and expertise make a real difference in shaping the next
                    generation of young professionals. Together, we're building a stronger, more connected learning
                    community.
                </p>
                <Link to="/mentor/profile">
                    <Button type="primary" className="bg-primary px-5 h-12 rounded-lg flex items-center">
                        Upgrade Profile
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center">
                        <span className="text-xl">🎯</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorOverviewHeader;
