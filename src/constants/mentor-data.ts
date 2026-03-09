import { FiTarget, FiSearch, FiEye } from 'react-icons/fi';

export interface StepContent {
    number: string;
    title: string;
    subtitle: string;
    color: string;
    bgColor: string;
    borderColor: string;
    fieldLabel1: string;
    fieldLabel2: string;
    placeholderExample: string;
}

export const stepsData: Record<number, StepContent> = {
    1: {
        number: 'STEP - 01',
        title: 'Wish',
        subtitle: 'What is an important wish that you want to fulfill?',
        color: '#9333EA',
        bgColor: '#FAF5FF',
        borderColor: '#C084FC',
        fieldLabel1: 'Your wish',
        fieldLabel2: 'What is your wish?',
        placeholderExample:
            'Example: I want to finish my portfolio project by Friday so I can start applying for internships ...',
    },
    2: {
        number: 'STEP - 02',
        title: 'Outcome',
        subtitle: 'What is the best outcome?',
        color: '#3B82F6',
        bgColor: '#EFF6FF',
        borderColor: '#93C5FD',
        fieldLabel1: 'Your Outcome',
        fieldLabel2: 'What is the best possible outcome?',
        placeholderExample: 'Example: I will feel confident and proud when I showcase my work to recruiters ...',
    },
    3: {
        number: 'STEP - 03',
        title: 'Obstacle',
        subtitle: 'What is your main inner obstacle?',
        color: '#F97316',
        bgColor: '#FFF7ED',
        borderColor: '#FDBA74',
        fieldLabel1: 'Your Obstacle',
        fieldLabel2: 'What is the best possible Obstacle?',
        placeholderExample: 'Example: I often get distracted by social media and spend too much time scrolling ...',
    },
    4: {
        number: 'STEP - 04',
        title: 'Plan',
        subtitle: 'If (obstacle), then I will (action).',
        color: '#22C55E',
        bgColor: '#F0FDF4',
        borderColor: '#86EFAC',
        fieldLabel1: 'Your Plan',
        fieldLabel2: 'What is the best possible Plan?',
        placeholderExample:
            'Example: If I feel the urge to check social media, I will immediately close the tab and type 10 lines of code ...',
    },
};

export const tipsData = [
    {
        icon: FiTarget,
        title: 'Be Specific',
        description:
            'Instead of "I want to be healthier," try "I want to eat one serving of vegetables with dinner every night this week."',
    },
    {
        icon: FiSearch,
        title: 'Identify Internal Obstacles',
        description:
            'Focus on things within your control. Procrastination, fear of failure, or a busy schedule are common internal hurdles.',
    },
    {
        icon: FiEye,
        title: 'Vividly Imagine Outcomes',
        description:
            'Take a moment to truly feel the benefit of achieving your wish. This emotional connection fuels your motivation.',
    },
];
