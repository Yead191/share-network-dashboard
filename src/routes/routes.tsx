import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from '../pages/authentication/Login';
import ErrorPage from '../components/ui/error/ErrorPage';
import ForgetPassword from '../pages/authentication/ForgetPassword';
import VerifyOtp from '../pages/authentication/VerifyOtp';
import NewPassword from '../pages/authentication/NewPassword';
import AdminOverview from '../pages/admin/overview';
import MentorCoordinatorOverview from '../pages/mentor-coordinator/mentor-coordinator-overview';
import MentorCoordinatorProfile from '../pages/mentor-coordinator/profile';
import Mentors from '../pages/mentor-coordinator/mentors';
import GroupSchedule from '../pages/mentor-coordinator/group-schedule';
import CoordinatorResources from '../pages/mentor-coordinator/resources';
import AttendanceTeacher from '../pages/teacher/attendance';
import TeacherOverview from '../pages/teacher/overview';
import MyStudent from '../pages/teacher/my-student';
import ClassSchedule from '../pages/teacher/class-schedule';
import Resources from '../pages/teacher/resources';
import Assignment from '../pages/teacher/assignment';
import StudentOverview from '../pages/student/overview';
import StudentProfile from '../pages/student/settings';
import StudentEvents from '../pages/student/events';
import Mentor from '../pages/student/mentor';
import StudentAssignment from '../pages/student/assignment';
import StudentResources from '../pages/student/resources';
import Goal from '../pages/student/goal';
import MentorOverview from '../pages/mentor/overview';
import Students from '../pages/mentor/students';
import MentorSetting from '../pages/mentor/setting';
import WeeklyReport from '../pages/mentor/weekly-report';
import TimeTracking from '../pages/mentor/time-tracking';
import LearningMaterials from '../pages/mentor/learning-materials';
import Woops from '../pages/mentor/woops';
import AdminSchedule from '../pages/admin/schdule';
import AdminLearningMaterials from '../pages/admin/materials';
import AdminEvents from '../pages/admin/events';
import AdminWeeklyReport from '../pages/admin/weekly-report';
import AdminTeachers from '../pages/admin/teachers';
import AdminMentors from '../pages/admin/mentors';
import AdminStudents from '../pages/admin/students';
import ChatLayout from '../components/shared/chat';
import StudentSchedule from '../pages/student/schdule';

import PrivateRoute from '../provider/PrivateRoutes';
import HomeRedirect from '../provider/HomeRedirect';
import AdminCoordinator from '../pages/admin/coordinator';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <PrivateRoute>
                <App />
            </PrivateRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
            // home element
            {
                index: true,
                element: <HomeRedirect />,
            },
            // Admin
            {
                path: '/admin/overview',
                element: (
                    <PrivateRoute role={['admin', 'super_admin']}>
                        <AdminOverview />
                    </PrivateRoute>
                ),
            },
            {
                path: '/admin/student',
                element: (
                    <PrivateRoute role={['admin', 'super_admin']}>
                        <AdminStudents />
                    </PrivateRoute>
                ),
            },
            {
                path: '/admin/mentors',
                element: (
                    <PrivateRoute role={['admin', 'super_admin']}>
                        <AdminMentors />
                    </PrivateRoute>
                ),
            },
            {
                path: '/admin/coordinator',
                element: (
                    <PrivateRoute role={['admin', 'super_admin']}>
                        <AdminCoordinator />
                    </PrivateRoute>
                ),
            },
            {
                path: '/admin/teacher',
                element: (
                    <PrivateRoute role={['admin', 'super_admin']}>
                        <AdminTeachers />
                    </PrivateRoute>
                ),
            },
            {
                path: '/admin/events',
                element: (
                    <PrivateRoute role={['admin', 'super_admin']}>
                        <AdminEvents />
                    </PrivateRoute>
                ),
            },
            {
                path: '/admin/materials',
                element: (
                    <PrivateRoute role={['admin', 'super_admin']}>
                        <AdminLearningMaterials />
                    </PrivateRoute>
                ),
            },
            {
                path: '/admin/schedule',
                element: (
                    <PrivateRoute role={['admin', 'super_admin']}>
                        <AdminSchedule />
                    </PrivateRoute>
                ),
            },
            {
                path: '/admin/weekly-report',
                element: (
                    <PrivateRoute role={['admin', 'super_admin']}>
                        <AdminWeeklyReport />
                    </PrivateRoute>
                ),
            },

            //Teacher
            {
                path: '/teacher/overview',
                element: (
                    <PrivateRoute role="teacher">
                        <TeacherOverview />
                    </PrivateRoute>
                ),
            },
            {
                path: '/teacher/my-student',
                element: (
                    <PrivateRoute role="teacher">
                        <MyStudent />
                    </PrivateRoute>
                ),
            },
            {
                path: '/teacher/class-schedule',
                element: (
                    <PrivateRoute role="teacher">
                        <ClassSchedule />
                    </PrivateRoute>
                ),
            },
            {
                path: '/teacher/resources',
                element: (
                    <PrivateRoute role="teacher">
                        <Resources />
                    </PrivateRoute>
                ),
            },
            {
                path: '/teacher/assignment',
                element: (
                    <PrivateRoute role="teacher">
                        <Assignment />
                    </PrivateRoute>
                ),
            },
            {
                path: '/teacher/chat',
                element: (
                    <PrivateRoute role="teacher">
                        <ChatLayout />
                    </PrivateRoute>
                ),
            },
            {
                path: '/teacher/attendance',
                element: (
                    <PrivateRoute role="teacher">
                        <AttendanceTeacher />
                    </PrivateRoute>
                ),
            },

            //  Mentor Coordinator
            {
                path: '/mentor-coordinator/overview',
                element: (
                    <PrivateRoute role="coordinator">
                        <MentorCoordinatorOverview />
                    </PrivateRoute>
                ),
            },
            {
                path: '/mentor-coordinator/mentors',
                element: (
                    <PrivateRoute role="coordinator">
                        <Mentors />
                    </PrivateRoute>
                ),
            },
            {
                path: '/mentor-coordinator/group-schedule',
                element: (
                    <PrivateRoute role="coordinator">
                        <GroupSchedule />
                    </PrivateRoute>
                ),
            },
            {
                path: '/mentor-coordinator/resources',
                element: (
                    <PrivateRoute role="coordinator">
                        <CoordinatorResources />
                    </PrivateRoute>
                ),
            },
            {
                path: '/mentor-coordinator/profile',
                element: (
                    <PrivateRoute role="coordinator">
                        <MentorCoordinatorProfile />
                    </PrivateRoute>
                ),
            },

            // Student
            {
                path: '/student/overview',
                element: (
                    <PrivateRoute role="student">
                        <StudentOverview />
                    </PrivateRoute>
                ),
            },
            {
                path: '/student/goal',
                element: (
                    <PrivateRoute role="student">
                        <Goal />
                    </PrivateRoute>
                ),
            },
            {
                path: '/student/schedule',
                element: (
                    <PrivateRoute role="student">
                        <StudentSchedule />
                    </PrivateRoute>
                ),
            },
            {
                path: '/student/resources',
                element: (
                    <PrivateRoute role="student">
                        <StudentResources />
                    </PrivateRoute>
                ),
            },
            {
                path: '/student/assignment',
                element: (
                    <PrivateRoute role="student">
                        <StudentAssignment />
                    </PrivateRoute>
                ),
            },
            {
                path: '/student/mentor',
                element: (
                    <PrivateRoute role="student">
                        <Mentor />
                    </PrivateRoute>
                ),
            },
            {
                path: '/student/events',
                element: (
                    <PrivateRoute role="student">
                        <StudentEvents />
                    </PrivateRoute>
                ),
            },
            {
                path: '/student/chat',
                element: (
                    <PrivateRoute role="student">
                        <ChatLayout />
                    </PrivateRoute>
                ),
            },
            {
                path: '/student/profile',
                element: (
                    <PrivateRoute role="student">
                        <StudentProfile />
                    </PrivateRoute>
                ),
            },

            // Mentor
            {
                path: '/mentor/overview',
                element: (
                    <PrivateRoute role="mentor">
                        <MentorOverview />
                    </PrivateRoute>
                ),
            },
            {
                path: '/mentor/students',
                element: (
                    <PrivateRoute role="mentor">
                        <Students />
                    </PrivateRoute>
                ),
            },
            {
                path: '/mentor/weekly-report',
                element: (
                    <PrivateRoute role="mentor">
                        <WeeklyReport />
                    </PrivateRoute>
                ),
            },
            {
                path: '/mentor/time-tracking',
                element: (
                    <PrivateRoute role="mentor">
                        <TimeTracking />
                    </PrivateRoute>
                ),
            },
            {
                path: '/mentor/learning-materials',
                element: (
                    <PrivateRoute role="mentor">
                        <LearningMaterials />
                    </PrivateRoute>
                ),
            },
            {
                path: '/mentor/woops',
                element: (
                    <PrivateRoute role="mentor">
                        <Woops />
                    </PrivateRoute>
                ),
            },
            {
                path: '/mentor/chat',
                element: (
                    <PrivateRoute role="mentor">
                        <ChatLayout />
                    </PrivateRoute>
                ),
            },
            {
                path: '/mentor/profile',
                element: (
                    <PrivateRoute role="mentor">
                        <MentorSetting />
                    </PrivateRoute>
                ),
            },
        ],
    },
    { path: '/login', element: <Login /> },
    { path: '/forget-password', element: <ForgetPassword /> },
    { path: '/verify-otp', element: <VerifyOtp /> },
    { path: '/new-password', element: <NewPassword /> },
]);

export default router;
