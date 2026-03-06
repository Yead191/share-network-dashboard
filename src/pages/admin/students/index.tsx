import { Tabs } from 'antd';
import { useState } from 'react';
import Student from './student/Student';

import TakeAttendance from './take-attendance/TakeAttendance';

const AdminStudents = () => {
    const [activeTab, setActiveTab] = useState('1');
    const tabItems = [
        {
            key: '1',
            label: 'Student',
            children: <Student />,
        },
        {
            key: '2',
            label: 'Take Attendance',
            children: <TakeAttendance />,
        },
    ];
    return (
        <section>
            <div className="px-6 sm:px-6 bg-white rounded-md">
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" />
            </div>
        </section>
    );
};
export default AdminStudents;
