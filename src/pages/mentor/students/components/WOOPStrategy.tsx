import { Card } from 'antd';

interface WoopData {
    wish?: { detail?: string };
    outcome?: { detail?: string };
    obstacle?: { detail?: string };
    plan?: { detail?: string };
    goal?: { title?: string };
}

const WOOPStrategy = ({ woops = [] }: { woops: WoopData[] }) => {
    const latestWoop = woops[0];

    const strategies = latestWoop
        ? [
              { title: 'Wish', description: latestWoop.wish?.detail || 'Not set yet' },
              { title: 'Outcome', description: latestWoop.outcome?.detail || 'Not set yet' },
              { title: 'Obstacle', description: latestWoop.obstacle?.detail || 'Not set yet' },
              { title: 'Plan', description: latestWoop.plan?.detail || 'Not set yet' },
          ]
        : [];

    return (
        <Card
            className="shadow-sm border-none rounded-2xl overflow-hidden"
            title={<span className="text-xl font-bold">WOOP Strategy</span>}
        >
            {strategies.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No WOOP strategy created yet.</p>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {strategies.map((strategy, idx) => (
                        <div key={idx}>
                            <h4 className="font-bold text-gray-800 mb-2">{strategy.title}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">{strategy.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default WOOPStrategy;
