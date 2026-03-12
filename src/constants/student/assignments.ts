// export type AssignmentStatus = 'PENDING' | 'IN_PROCESS' | 'COMPLETED';


// export interface SubmittedAssignment {
//     _id: string;
//     fileAssignment: string;
//     notes?: string;
//     createdAt: string;
// }

// export interface Assignment {
//     id: string;
//     title: string;
//     description: string;
//     status: "PENDING" | "COMPLETED";
//     dueDate: string;
//     openDate?: string;
//     totalPoint: number;
//     attachment?: string;
//     subject?: string;
//     color?: string;
//     submitAssignment?: SubmittedAssignment[];
//     teacher?: {
//         _id: string;
//         firstName: string;
//         lastName: string;
//         profile: string;
//     };
//     userGroup?: { _id: string; name: string }[];
//     userGroupTrack?: { _id: string; name: string };
// }

export type AssignmentStatus = 'PENDING' | 'IN_PROCESS' | 'COMPLETED';

export interface SubmittedAssignment {
    _id: string;
    studentId: string;
    fileAssignment: string;
    notes?: string;
    createdAt: string;
    status: string;
}

export interface Assignment {
    id: string;
    title: string;
    description: string;
    status: "PENDING" | "COMPLETED";
    dueDate: string;
    openDate?: string;
    totalPoint?: number;
    attachment?: string;
    subject?: string;
    color?: string;
    submitAssignment?: SubmittedAssignment[];
    teacher?: {
        _id: string;
        firstName: string;
        lastName: string;
        profile: string;
    };
    userGroup?: { _id: string; name: string }[];
    userGroupTrack?: string;
}