import { Section } from '../pages/student/goal/components/Questionnaire';

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

export { questionnaireData };
