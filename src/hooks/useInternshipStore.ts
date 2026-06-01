import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { InternshipFormValues, InternshipRecord } from '../types/internship.types';

// ─── Seed data so the list isn't empty on first load ────────────────────────
const SEED: InternshipRecord[] = [
    {
        id: 'seed-1',
        studentId: 'seed-student-1',
        studentName: 'Aisha Noor',
        studentAvatar: undefined,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        fullName: 'Aisha Noor',
        dateOfBirth: '1999-04-12',
        phoneNumber: '+31612345678',
        email: 'aisha.noor@example.com',
        currentCity: 'Amsterdam',
        linkedIn: 'https://linkedin.com/in/aishanoor',
        studyDirection: 'Software Engineering',
        institution: 'Amsterdam University of Applied Sciences',
        currentStatus: 'studying',
        expectedGraduation: '2025-07',
        keySkills: ['React', 'TypeScript', 'Node.js'],
        languages: [{ language: 'Dutch', level: 'B2' }, { language: 'English', level: 'C1' }],
        workExperience: 'Freelance web development (6 months)',
        overallScore: 8,
        performanceRating: 4,
        strengths: 'Fast learner, excellent problem solving',
        areasForImprovement: 'Public speaking',
        hasDutchResidency: true,
        workAuthStatus: 'fully_allowed',
        isAsylumSeeker: false,
        interestedInInternship: true,
        interestedInFullTime: false,
        preferredFields: ['IT', 'FinTech'],
        preferredLocation: 'Amsterdam',
        availabilityStartDate: '2025-09-01',
        availabilityHoursPerWeek: 32,
        consentToShare: true,
        doNotShareContact: false,
        doNotSharePhoto: false,
        anonymousOnly: false,
        additionalNotes: 'Outstanding student — prioritise for partner companies.',
    },
];

// ─── Helper: generate a unique id (nanoid if available, otherwise fallback) ─
function uid() {
    try {
        return nanoid();
    } catch {
        return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
}

export function useInternshipStore() {
    const [records, setRecords] = useState<InternshipRecord[]>(SEED);
    const [loading, setLoading] = useState(false);

    const simulateDelay = () =>
        new Promise<void>((res) => setTimeout(res, 400));

    const createInternship = useCallback(
        async (values: InternshipFormValues, studentName: string, studentAvatar?: string) => {
            setLoading(true);
            await simulateDelay();
            const now = new Date().toISOString();
            const record: InternshipRecord = {
                ...values,
                id: uid(),
                studentName,
                studentAvatar,
                createdAt: now,
                updatedAt: now,
            };
            setRecords((prev) => [record, ...prev]);
            setLoading(false);
            return record;
        },
        []
    );

    const updateInternship = useCallback(
        async (id: string, values: Partial<InternshipFormValues>) => {
            setLoading(true);
            await simulateDelay();
            setRecords((prev) =>
                prev.map((r) =>
                    r.id === id ? { ...r, ...values, updatedAt: new Date().toISOString() } : r
                )
            );
            setLoading(false);
        },
        []
    );

    const deleteInternship = useCallback(async (id: string) => {
        setLoading(true);
        await simulateDelay();
        setRecords((prev) => prev.filter((r) => r.id !== id));
        setLoading(false);
    }, []);

    const getById = useCallback(
        (id: string) => records.find((r) => r.id === id),
        [records]
    );

    return { records, loading, createInternship, updateInternship, deleteInternship, getById };
}
