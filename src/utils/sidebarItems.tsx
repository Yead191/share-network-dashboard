import { TSidebarItem } from './generateSidebarItems';

import {
    LuLayoutDashboard,
    LuBookOpen,
    LuSettings,
    LuUser,
    LuUsers,
    LuFileText,
    LuMessageSquare,
    LuTarget,
} from 'react-icons/lu';
import { PiStudent, PiChalkboardTeacher } from 'react-icons/pi';
import { GiTeacher } from 'react-icons/gi';
import { MdOutlineEventNote, MdOutlineAssignment } from 'react-icons/md';
import { TbReportAnalytics } from 'react-icons/tb';
import { AiOutlineSchedule } from 'react-icons/ai';
import { ShieldCheck } from 'lucide-react';

export const adminSidebarItems: TSidebarItem[] = [
    {
        key: 'overview',
        label: 'Overview',
        path: 'admin/overview',
        icon: <LuLayoutDashboard size={20} />,
    },
    {
        key: 'student',
        label: 'Student',
        path: 'admin/student',
        icon: <PiStudent size={20} />,
    },
    {
        key: 'mentors',
        label: 'Mentors',
        path: 'admin/mentors',
        icon: <GiTeacher size={20} />,
    },
    {
        key: 'coordinator',
        label: 'Coordinator',
        path: 'admin/coordinator',
        icon: <ShieldCheck size={20} />,
    },
    {
        key: 'teacher',
        label: 'Teacher',
        path: 'admin/teacher',
        icon: <PiChalkboardTeacher size={20} />,
    },
    {
        key: 'events',
        label: 'Events',
        path: 'admin/events',
        icon: <MdOutlineEventNote size={20} />,
    },
    {
        key: 'materials',
        label: 'Materials',
        path: 'admin/materials',
        icon: <LuBookOpen size={20} />,
    },
    {
        key: 'assignment',
        label: 'Assignment',
        path: 'admin/assignment',
        icon: <MdOutlineAssignment size={20} />,
    },
    {
        key: 'schedule',
        label: 'Schedule',
        path: 'admin/schedule',
        icon: <AiOutlineSchedule size={20} />,
    },
    {
        key: 'weekly-report',
        label: 'Weekly Report',
        path: 'admin/weekly-report',
        icon: <TbReportAnalytics size={20} />,
    },
    {
        key: 'profile',
        label: 'Profile',
        path: 'admin/profile',
        icon: <LuUser size={20} />,
    },

];

export const teacherSidebarItems: TSidebarItem[] = [
    {
        key: 'overview',
        label: 'Overview',
        path: 'teacher/overview',
        icon: <LuLayoutDashboard size={20} />,
    },
    {
        key: 'my-student',
        label: 'My Student',
        path: 'teacher/my-student',
        icon: <PiStudent size={20} />,
    },
    {
        key: 'class-schedule',
        label: 'Class Schedule',
        path: 'teacher/class-schedule',
        icon: <AiOutlineSchedule size={20} />,
    },
    {
        key: 'resources',
        label: 'Resources',
        path: 'teacher/resources',
        icon: <LuBookOpen size={20} />,
    },
    {
        key: 'assignment',
        label: 'Assignment',
        path: 'teacher/assignment',
        icon: <MdOutlineAssignment size={20} />,
    },
    {
        key: 'chat',
        label: 'Chat',
        path: 'teacher/chat',
        icon: <LuMessageSquare size={20} />,
    },
    {
        key: 'attendance',
        label: 'Attendance',
        path: 'teacher/attendance',
        icon: <LuUsers size={20} />,
    },
    {
        key: 'profile',
        label: 'Profile',
        path: 'teacher/profile',
        icon: <LuUser size={20} />,
    },
];

export const mentorCoordinatorSidebarItems: TSidebarItem[] = [
    {
        key: 'overview',
        label: 'Overview',
        path: 'mentor-coordinator/overview',
        icon: <LuLayoutDashboard size={20} />,
    },
    {
        key: 'mentors',
        label: 'Mentors',
        path: 'mentor-coordinator/mentors',
        icon: <GiTeacher size={20} />,
    },
    {
        key: 'group-schedule',
        label: 'Group Schedule',
        path: 'mentor-coordinator/group-schedule',
        icon: <LuUsers size={20} />,
    },
    {
        key: 'resources',
        label: 'Resources',
        path: 'mentor-coordinator/resources',
        icon: <LuBookOpen size={20} />,
    },
    {
        key: 'profile',
        label: 'Profile',
        path: 'mentor-coordinator/profile',
        icon: <LuUser size={20} />,
    },
];

export const studentSidebarItems: TSidebarItem[] = [
    {
        key: 'overview',
        label: 'Overview',
        path: 'student/overview',
        icon: <LuLayoutDashboard size={20} />,
    },
    {
        key: 'goal',
        label: 'Goals',
        path: 'student/goal',
        icon: <LuTarget size={20} />,
    },
    {
        key: 'schedule',
        label: 'Class',
        path: 'student/schedule',
        icon: <AiOutlineSchedule size={20} />,
    },
    {
        key: 'resources',
        label: 'Resources',
        path: 'student/resources',
        icon: <LuBookOpen size={20} />,
    },
    {
        key: 'assignment',
        label: 'Assignment',
        path: 'student/assignment',
        icon: <MdOutlineAssignment size={20} />,
    },
    {
        key: 'mentor',
        label: 'Mentor',
        path: 'student/mentor',
        icon: <GiTeacher size={20} />,
    },
    {
        key: 'events',
        label: 'Events',
        path: 'student/events',
        icon: <MdOutlineEventNote size={20} />,
    },
    {
        key: 'chat',
        label: 'Chat',
        path: 'student/chat',
        icon: <LuMessageSquare size={20} />,
    },
    {
        key: 'profile',
        label: 'Profile',
        path: 'student/profile',
        icon: <LuUser size={20} />,
    },
];

export const mentorSidebarItems: TSidebarItem[] = [
    {
        key: 'overview',
        label: 'Overview',
        path: 'mentor/overview',
        icon: <LuLayoutDashboard size={20} />,
    },
    {
        key: 'students',
        label: 'Student',
        path: 'mentor/students',
        icon: <PiStudent size={20} />,
    },
    {
        key: 'weekly-report',
        label: 'Weekly Report',
        path: 'mentor/weekly-report',
        icon: <TbReportAnalytics size={20} />,
    },
    {
        key: 'time-tracking',
        label: 'Time Tracking',
        path: 'mentor/time-tracking',
        icon: <AiOutlineSchedule size={20} />,
    },
    {
        key: 'schedule',
        label: 'Schedule',
        path: 'mentor/schedule',
        icon: <AiOutlineSchedule size={20} />,
    },
    {
        key: 'learning-materials',
        label: 'Resources',
        path: 'mentor/learning-materials',
        icon: <LuBookOpen size={20} />,
    },
    {
        key: 'woops',
        label: 'Woops',
        path: 'mentor/woops',
        icon: <LuFileText size={20} />,
    },
    {
        key: 'chat',
        label: 'Chat',
        path: 'mentor/chat',
        icon: <LuMessageSquare size={20} />,
    },
    {
        key: 'setting',
        label: 'Settings',
        path: 'mentor/profile',
        icon: <LuSettings size={20} />,
    },
];
