import React from 'react';
import { StepContent } from '../../../../constants/mentor-data';

interface WoopFormProps {
    stepData: StepContent;
    detailValue: string;
    onDetailChange: (value: string) => void;
}

const WoopForm: React.FC<WoopFormProps> = ({ stepData, detailValue, onDetailChange }) => {
    return (
        <div className="mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">{stepData.subtitle}</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-gray-500 font-semibold mb-3">{stepData.fieldLabel1}</label>
                    <textarea
                        rows={6}
                        placeholder={`Describe your ${stepData.title?.toLowerCase() || 'plan'} in a few words ...\n${stepData.placeholderExample}`}
                        className="w-full p-4 rounded-lg bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                        value={detailValue}
                        onChange={(e) => onDetailChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default WoopForm;
