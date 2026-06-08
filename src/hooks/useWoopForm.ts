// hooks/useWoopForm.ts
import { useState, useCallback } from 'react';

const defaultFormData = {
    wish: { detail: '' },
    outcome: { detail: '' },
    obstacle: { detail: '' },
    plan: { detail: '' },
} as const;

export type WoopFormData = typeof defaultFormData;
export type StepKey = keyof WoopFormData;

const stepKeys: Record<number, StepKey> = {
    1: 'wish',
    2: 'outcome',
    3: 'obstacle',
    4: 'plan',
};

export const useWoopForm = () => {
    const [formData, setFormData] = useState<WoopFormData>(defaultFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const [editingWoopId, setEditingWoopId] = useState<string | null>(null);

    const resetForm = useCallback(() => {
        setFormData(defaultFormData);
        setCurrentStep(1);
        setEditingWoopId(null);
    }, []);

    const setEditMode = useCallback((woop: any) => {
        setFormData({
            wish: { detail: woop.wish?.detail || '' },
            outcome: { detail: woop.outcome?.detail || '' },
            obstacle: { detail: woop.obstacle?.detail || '' },
            plan: { detail: woop.plan?.detail || '' },
        });
        setEditingWoopId(woop._id);
        setCurrentStep(1);
    }, []);

    const handleDetailChange = useCallback((detail: string) => {
        const key = stepKeys[currentStep];
        setFormData((prev) => ({
            ...prev,
            [key]: { detail },
        }));
    }, [currentStep]);

    const goNext = useCallback(() => {
        if (currentStep < 4) {
            setCurrentStep((s) => s + 1);
            return false;
        }
        return true; // ready to submit
    }, [currentStep]);

    const goBack = useCallback(() => {
        if (currentStep > 1) setCurrentStep((s) => s - 1);
    }, [currentStep]);

    return {
        formData,
        currentStep,
        editingWoopId,
        setEditingWoopId,
        handleDetailChange,
        goNext,
        goBack,
        resetForm,
        setEditMode,
    };
};