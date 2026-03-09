interface WelcomeBannerProps {
    name: string;
    group: string;
    description: string;
}

const WelcomeBanner = ({ name, group, description }: WelcomeBannerProps) => {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h1 className="text-2xl font-bold text-[#1E1E1E] font-heading">
                Hi {name}! You have joined the {group} group
            </h1>
            <div className="mt-4 space-y-3 text-[#555555] text-[15px] leading-relaxed">
                <p>{description}</p>
            </div>
        </div>
    );
};

export default WelcomeBanner;
