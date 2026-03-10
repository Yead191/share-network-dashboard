import { Section } from '../pages/student/goal/components/Questionnaire';

const mockGoals: any[] = [
    {
        id: '1',
        title: 'Goal 1: Foundations',
        wish: 'To achieve a 95% proficiency in advanced JavaScript by the end of this semester.',
        outcome: 'I will be eligible for the senior internship program and feel confident in technical interviews.',
        obstacle: 'Managing time between exam preparation and coding practice; staying focused on complex concepts.',
        plan: 'Dedicate 1 hour every morning to code; join peer review sessions on Fridays.',
    },
    {
        id: '2',
        title: 'Goal 2: Critical Thinking',
        wish: 'Improve problem-solving skills by solving 3 complex algorithms weekly.',
        outcome: 'Better logical reasoning and faster implementation of code.',
        obstacle: 'Difficulty in understanding complex data structures.',
        plan: 'Study one data structure per week and implement it in a project.',
    },
    {
        id: '3',
        title: 'Goal 3: Career Planning',
        wish: 'Network with at least 5 professionals in the tech industry.',
        outcome: 'Gain insights into industry trends and potential job opportunities.',
        obstacle: 'Feelings of imposter syndrome when reaching out.',
        plan: 'Attend one networking event per month and reach out on LinkedIn.',
    },
];

const questionnaireData: Section[] = [
    {
        title: 'PART 1. Where are you now? (Starting point)',
        questions: [
            {
                id: 'computer_comfort',
                question: 'How comfortable do you feel with computers right now?',
                type: 'checkbox',
                options: [
                    'I have never really used a computer',
                    'I can use basic things (email, browser)',
                    'I can work with documents and online tools',
                    'I already have some IT or digital skills',
                ],
            },
            {
                id: 'hardest_to_learn',
                question: 'When you need to learn something new, what is hardest for you?',
                type: 'checkbox',
                options: [
                    'Understanding instructions',
                    'Language',
                    'Confidence / fear of mistakes',
                    'Concentration or stress',
                    'Not knowing where to start',
                    'Time or personal situation',
                ],
            },
            {
                id: 'proud_moment',
                question: 'What do you feel MOST proud of in your life so far?',
                subText: 'Open question - can be personal, small or big',
                type: 'text',
                placeholder: 'Write your answer here...',
            },
        ],
    },
    {
        title: 'PART 2. What gives you energy or interest? (Direction)',
        questions: [
            {
                id: 'curious_activities',
                question: 'Which activities do you enjoy or feel curious about?',
                type: 'checkbox',
                options: [
                    'Learning new things',
                    'Helping other people',
                    'Solving problems',
                    'Working with computers or technology',
                ],
            },
        ],
    },
];

export { mockGoals, questionnaireData };
