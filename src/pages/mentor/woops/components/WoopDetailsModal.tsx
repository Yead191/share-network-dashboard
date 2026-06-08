// components/WoopDetailsModal.tsx
import { Modal } from 'antd';
import { FiEdit2 } from 'react-icons/fi';
import { getImageUrl } from '../../../../utils/getImageUrl';

type Props = {
    visible: boolean;
    woop: any | null;
    onClose: () => void;
    onEdit?: (woop: any) => void;
    readOnly?: boolean;
};

const WoopDetailsModal = ({ visible, woop, onClose, onEdit, readOnly }: Props) => {
    if (!woop) return null;

    return (
        <Modal
            title={<div className="text-xl font-bold text-gray-800 border-b pb-3">WOOP Details</div>}
            open={visible}
            onCancel={onClose}
            footer={
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    {!readOnly && onEdit && (
                        <button
                            onClick={() => {
                                onEdit(woop);
                                onClose();
                            }}
                            className="px-5 py-2.5 bg-purple-50 text-[#7C3AED] hover:bg-purple-100 font-semibold rounded-xl flex items-center gap-2"
                        >
                            <FiEdit2 /> Edit
                        </button>
                    )}
                    <button onClick={onClose} className="px-5 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold rounded-xl">
                        Close
                    </button>
                </div>
            }
            centered
            width={700}
            closeIcon={<span className="text-gray-400 hover:text-gray-600 text-xl">×</span>}
        >
            <div className="py-2 space-y-6">
                {/* Participants */}
                <div className="flex items-center gap-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    {/* Mentor */}
                    <div className="flex items-center gap-3">
                        <img src={getImageUrl(woop.mentorId?.profile)} className="w-14 h-14 rounded-full object-cover" alt="Mentor" />
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Mentor</p>
                            <p className="font-bold">{woop.mentorId?.firstName} {woop.mentorId?.lastName}</p>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-gray-200" />

                    {/* Student */}
                    <div className="flex items-center gap-3">
                        <img src={getImageUrl(woop.studentId?.profile)} className="w-14 h-14 rounded-full object-cover" alt="Student" />
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Student</p>
                            <p className="font-bold">{woop.studentId?.firstName} {woop.studentId?.lastName}</p>
                        </div>
                    </div>
                </div>

                {/* WOOP Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { key: 'wish', label: 'Wish', color: 'purple' },
                        { key: 'outcome', label: 'Outcome', color: 'blue' },
                        { key: 'obstacle', label: 'Obstacle', color: 'orange' },
                        { key: 'plan', label: 'Plan', color: 'emerald' },
                    ].map(({ key, label, color }) => (
                        <div key={key} className={`bg-gradient-to-br from-${color}-50 to-white p-5 rounded-xl border border-${color}-100 shadow-sm`}>
                            <h4 className={`text-${color}-800 font-bold flex items-center gap-2 mb-3 pb-2 border-b border-${color}-100`}>
                                <span className={`w-8 h-8 rounded-lg bg-${color}-200 flex items-center justify-center text-sm`}>{label[0]}</span>
                                {label}
                            </h4>
                            <p className="text-gray-700 leading-relaxed text-[15px]">{woop[key]?.detail || 'Not specified'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default WoopDetailsModal;