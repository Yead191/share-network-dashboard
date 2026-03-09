export interface Message {
    id: string;
    text: string;
    sender: 'student' | 'mentor';
    timestamp: string;
}

export interface Mentor {
    name: string;
    firstName: string;
    lastName: string;
    role: string;
    subtext: string;
    profile: string;
    location: string;
    specialization: string;
    availability: string;
    email: string;
}

