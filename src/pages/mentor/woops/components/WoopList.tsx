// components/WoopList.tsx
import WoopCard from './WoopCard';
import { FiPlus } from 'react-icons/fi';

type Props = {
    woops: any[];
    onCreateNew?: () => void;
    onView: (woop: any) => void;
    onEdit?: (woop: any) => void;
    onDelete?: (id: string) => void;
    isDeleting?: boolean;
    readOnly?: boolean;
};

const WoopList = ({ woops, onCreateNew, onView, onEdit, onDelete, isDeleting, readOnly }: Props) => {
    return (
        <div className="mx-auto pb-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">My WOOPs</h2>
                    <p className="text-gray-500">Manage and track your goals with the WOOP method.</p>
                </div>
                {!readOnly && onCreateNew && (
                    <button
                        onClick={onCreateNew}
                        className="bg-[#7C3AED] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-md shadow-purple-500/30"
                    >
                        <FiPlus className="text-lg" />
                        Create New WOOP
                    </button>
                )}
            </div>

            {woops.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                        <FiPlus className="text-[#7C3AED] text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No WOOPs found</h3>
                    <p className="text-gray-500 mb-6">Create your first WOOP to start achieving your goals.</p>
                    {!readOnly && onCreateNew && (
                        <button onClick={onCreateNew} className="bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#6d28d9]">
                            Get Started
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {woops.map((woop) => (
                        <WoopCard
                            key={woop._id}
                            woop={woop}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isDeleting={isDeleting}
                            readOnly={readOnly}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WoopList;