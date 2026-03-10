import React from 'react';

export interface Question {
    id: string;
    question: string;
    type: 'radio' | 'text' | 'checkbox'; // Added checkbox
    options?: string[];
    placeholder?: string;
    subText?: string;
}

export interface Section {
    title: string;
    questions: Question[];
}

interface QuestionnaireProps {
    sections: Section[];
    responses: Record<string, string>;
    onResponseChange: (questionId: string, value: string) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ sections, responses, onResponseChange }) => {
    
    // Helper to handle multiple checkbox values
    const handleCheckboxChange = (questionId: string, option: string) => {
        const currentValues = responses[questionId] ? responses[questionId].split(',') : [];
        let newValues: string[];

        if (currentValues.includes(option)) {
            // Remove if already exists
            newValues = currentValues.filter((v) => v !== option);
        } else {
            // Add if new
            newValues = [...currentValues, option];
        }
        
        onResponseChange(questionId, newValues.join(','));
    };

    return (
        <div className="space-y-10">
            {sections.map((section, sIndex) => (
                <div key={sIndex} className="space-y-6">
                    <h2 className="text-[#8B5CF6] text-lg font-medium uppercase tracking-tight">{section.title}</h2>
                    <div className="space-y-8">
                        {section.questions.map((q, qIndex) => {
                            // Calculate cumulative question number
                            let previousQuestionsCount = 0;
                            for (let i = 0; i < sIndex; i++) {
                                previousQuestionsCount += sections[i].questions.length;
                            }

                            return (
                                <div key={q.id} className="space-y-4">
                                    <h3 className="text-[#1E1E1E] text-base font-semibold">
                                        {qIndex + 1 + previousQuestionsCount}.{' '}
                                        {q.question}
                                    </h3>
                                    {q.subText && <p className="text-[#888888] text-sm -mt-2">{q.subText}</p>}

                                    {/* RADIO OR CHECKBOX OPTIONS */}
                                    {(q.type === 'radio' || q.type === 'checkbox') && q.options && (
                                        <div className="space-y-3">
                                            {q.options.map((option) => {
                                                const isChecked = q.type === 'radio' 
                                                    ? responses[q.id] === option 
                                                    : (responses[q.id] || '').split(',').includes(option);

                                                return (
                                                    <label
                                                        key={option}
                                                        className="flex items-center space-x-3 cursor-pointer group"
                                                    >
                                                        <div className="relative flex items-center justify-center">
                                                            <input
                                                                type={q.type}
                                                                name={q.id}
                                                                value={option}
                                                                checked={isChecked}
                                                                onChange={() => {
                                                                    if (q.type === 'radio') {
                                                                        onResponseChange(q.id, option);
                                                                    } else {
                                                                        handleCheckboxChange(q.id, option);
                                                                    }
                                                                }}
                                                                className={`appearance-none w-5 h-5 border-2 border-gray-300 transition-all cursor-pointer 
                                                                    ${q.type === 'radio' ? 'rounded-full' : 'rounded-md'} 
                                                                    checked:border-[#8B5CF6] checked:bg-white`}
                                                            />
                                                            {isChecked && (
                                                                <div className={`absolute bg-[#8B5CF6] ${q.type === 'radio' ? 'w-2.5 h-2.5 rounded-full' : 'w-2.5 h-2.5 rounded-sm'}`}></div>
                                                            )}
                                                        </div>
                                                        <span
                                                            className={`text-sm ${isChecked ? 'text-[#1E1E1E]' : 'text-[#888888]'} group-hover:text-[#1E1E1E] transition-colors`}
                                                        >
                                                            {option}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* TEXT AREA */}
                                    {q.type === 'text' && (
                                        <textarea
                                            placeholder={q.placeholder}
                                            value={responses[q.id] || ''}
                                            onChange={(e) => onResponseChange(q.id, e.target.value)}
                                            className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all min-h-[100px] text-sm placeholder:text-[#BBBBBB]"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Questionnaire;