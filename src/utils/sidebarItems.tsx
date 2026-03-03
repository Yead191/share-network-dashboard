import { TSidebarItem } from './generateSidebarItems';

import {
    LuLayoutDashboard,
    LuBookOpen,
    LuCalendarDays,
    LuSettings,
    LuUser,
    LuUsers,
    LuFileText,
    LuMessageSquare,
} from 'react-icons/lu';
import { PiStudent, PiChalkboardTeacher } from 'react-icons/pi';
import { GiTeacher } from 'react-icons/gi';
import { MdOutlineEventNote, MdOutlineAssignment } from 'react-icons/md';
import { TbReportAnalytics } from 'react-icons/tb';
import { AiOutlineSchedule } from 'react-icons/ai';

export const adminSidebarItems: TSidebarItem[] = [
    {
        key: 'overview',
        label: 'Overview',
        path: 'admin/overview',
        icon: <LuLayoutDashboard size={24} />,
    },
    {
        key: 'student',
        label: 'Student',
        path: 'admin/student',
        icon: <PiStudent size={24} />,
    },
    {
        key: 'mentors',
        label: 'Mentors',
        path: 'admin/mentors',
        icon: <GiTeacher size={24} />,
    },
    {
        key: 'teacher',
        label: 'Teacher',
        path: 'admin/teacher',
        icon: <PiChalkboardTeacher size={24} />,
    },
    {
        key: 'events',
        label: 'Events',
        path: 'admin/events',
        icon: <MdOutlineEventNote size={24} />,
    },
    {
        key: 'materials',
        label: 'Materials',
        path: 'admin/materials',
        icon: <LuBookOpen size={24} />,
    },
    {
        key: 'schedule',
        label: 'Schedule',
        path: 'admin/schedule',
        icon: <AiOutlineSchedule size={24} />,
    },
    {
        key: 'weekly-report',
        label: 'Weekly Report',
        path: 'admin/weekly-report',
        icon: <TbReportAnalytics size={24} />,
    },
];

export const teacherSidebarItems: TSidebarItem[] = [
    {
        key: 'overview',
        label: 'Overview',
        path: 'teacher/overview',
        icon: <LuLayoutDashboard size={24} />,
    },
    {
        key: 'my-student',
        label: 'My Student',
        path: 'teacher/my-student',
        icon: <PiStudent size={24} />,
    },
    {
        key: 'class-schedule',
        label: 'Class Schedule',
        path: 'teacher/class-schedule',
        icon: <AiOutlineSchedule size={24} />,
    },
    {
        key: 'resources',
        label: 'Resources',
        path: 'teacher/resources',
        icon: <LuBookOpen size={24} />,
    },
    {
        key: 'assignment',
        label: 'Assignment',
        path: 'teacher/assignment',
        icon: <MdOutlineAssignment size={24} />,
    },
    {
        key: 'chat',
        label: 'Chat',
        path: 'teacher/chat',
        icon: <LuMessageSquare size={24} />,
    },
    {
        key: 'attendance',
        label: 'Attendance',
        path: 'teacher/attendance',
        icon: <LuUsers size={24} />,
    },
];

export const mentorCoordinatorSidebarItems: TSidebarItem[] = [
    {
        key: 'overview',
        label: 'Overview',
        path: 'mentor-coordinator/overview',
        icon: <LuLayoutDashboard size={24} />,
    },
    {
        key: 'mentors',
        label: 'Mentors',
        path: 'mentor-coordinator/mentors',
        icon: <GiTeacher size={24} />,
    },
    {
        key: 'group-schedule',
        label: 'Group Schedule',
        path: 'mentor-coordinator/group-schedule',
        icon: <LuUsers size={24} />,
    },
    {
        key: 'resources',
        label: 'Resources',
        path: 'mentor-coordinator/resources',
        icon: <LuBookOpen size={24} />,
    },
    {
        key: 'profile',
        label: 'Profile',
        path: 'mentor-coordinator/profile',
        icon: <LuUser size={24} />,
    },
];

export const studentSidebarItems: TSidebarItem[] = [
    {
        key: 'overview',
        label: 'Overview',
        path: 'student/overview',
        icon: <LuLayoutDashboard size={24} />,
    },
    {
        key: 'goal',
        label: 'Goal',
        path: 'student/goal',
        icon: <LuCalendarDays size={24} />,
    },
    {
        key: 'schedule',
        label: 'Class',
        path: 'student/schedule',
        icon: <AiOutlineSchedule size={24} />,
    },
    {
        key: 'resources',
        label: 'Resources',
        path: 'student/resources',
        icon: <LuBookOpen size={24} />,
    },
    {
        key: 'assignment',
        label: 'Assignment',
        path: 'student/assignment',
        icon: <MdOutlineAssignment size={24} />,
    },
    {
        key: 'mentor',
        label: 'Mentor',
        path: 'student/mentor',
        icon: <GiTeacher size={24} />,
    },
    {
        key: 'events',
        label: 'Events',
        path: 'student/events',
        icon: <MdOutlineEventNote size={24} />,
    },
    {
        key: 'chat',
        label: 'Chat',
        path: 'student/chat',
        icon: <LuMessageSquare size={24} />,
    },
    {
        key: 'profile',
        label: 'Profile',
        path: 'student/profile',
        icon: <LuUser size={24} />,
    },
];

export const mentorSidebarItems: TSidebarItem[] = [
    {
        key: 'overview',
        label: 'Overview',
        path: 'mentor/overview',
        icon: <LuLayoutDashboard size={24} />,
    },
    {
        key: 'students',
        label: 'Student',
        path: 'mentor/students',
        icon: <PiStudent size={24} />,
    },
    {
        key: 'weekly-report',
        label: 'Weekly Report',
        path: 'mentor/weekly-report',
        icon: <TbReportAnalytics size={24} />,
    },
    {
        key: 'time-tracking',
        label: 'Time Tracking',
        path: 'mentor/time-tracking',
        icon: <AiOutlineSchedule size={24} />,
    },
    {
        key: 'learning-materials',
        label: 'Resources',
        path: 'mentor/learning-materials',
        icon: <LuBookOpen size={24} />,
    },
    {
        key: 'woops',
        label: 'Woops',
        path: 'mentor/woops',
        icon: <LuFileText size={24} />,
    },
    {
        key: 'chat',
        label: 'Chat',
        path: 'mentor/chat',
        icon: <LuMessageSquare size={24} />,
    },
    {
        key: 'setting',
        label: 'Settings',
        path: 'mentor/profile', // Mapped to profile based on route provided for setting/profile
        icon: <LuSettings size={24} />,
    },
];
