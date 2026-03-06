import { Card } from 'antd';

const UpcomingEvents = () => {
    return (
        <Card title="Upcoming Events" className="rounded-xl border border-gray-100 shadow-sm">
            <div className="min-h-[100px] flex items-center justify-center text-gray-400">
                {/* Content can be added here as needed */}
                EventCard

                <p>No upcoming events scheduled</p>
            </div>
        </Card>
    );
};

export default UpcomingEvents;
