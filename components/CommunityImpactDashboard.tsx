import React from 'react';
import { RecycleIcon } from '../constants';

// Icons defined locally to avoid major refactoring of icon system
const WaterDropIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a7 7 0 01-4.95-12.05A7 7 0 0112 5a7 7 0 017 7c0 3.86-3.14 7-7 7z" />
    </svg>
);
const TreeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V12m0 0H9m3 0h3m-3 0V3m0 9h3m-3 0H9m12-3.372C21 8.243 16.97 4.5 12 4.5S3 8.243 3 11.628c0 2.051.5 4.218 1.5 6.072C5.5 19.643 8.5 21 12 21s6.5-1.357 7.5-3.299c1-1.854 1.5-4.021 1.5-6.072z" />
    </svg>
);
const CloudIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
);

interface StatItemProps {
    icon: React.ReactElement;
    value: string;
    label: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label }) => (
    <div className="bg-background p-4 rounded-lg flex items-center gap-4">
        <div className="text-primary">{icon}</div>
        <div>
            <p className="text-xl font-bold text-text-primary">{value}</p>
            <p className="text-sm text-text-secondary">{label}</p>
        </div>
    </div>
);

const CommunityImpactDashboard: React.FC = () => {
    // Mock data
    const weeklyData = [
        { week: 'Week 1', points: 850 },
        { week: 'Week 2', points: 1200 },
        { week: 'Week 3', points: 1100 },
        { week: 'This Week', points: 1550 },
    ];
    const maxPoints = Math.max(...weeklyData.map(d => d.points), 1);

    return (
        <div className="bg-surface p-6 rounded-2xl shadow-xl h-full">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Our Community Impact 📊</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <StatItem icon={<WaterDropIcon />} value="120 Liters" label="Water Saved This Week" />
                <StatItem icon={<TreeIcon />} value="50 Trees" label="Total Trees Planted" />
                <StatItem icon={<CloudIcon />} value="1,100 kg" label="Est. CO₂ Absorbed" />
                <StatItem icon={<RecycleIcon />} value="85 kg" label="Waste Recycled" />
            </div>

            <div>
                <h3 className="font-bold text-lg text-text-primary mb-2">Weekly Points Contribution</h3>
                <div className="bg-background p-4 rounded-lg">
                    <div className="flex justify-between items-end h-40 space-x-2">
                        {weeklyData.map(data => (
                            <div key={data.week} className="flex-1 flex flex-col items-center justify-end">
                                <div 
                                    className="w-full bg-primary rounded-t-md transition-all duration-500" 
                                    style={{ height: `${(data.points / maxPoints) * 100}%` }}
                                    title={`${data.points} points`}
                                ></div>
                                <p className="text-xs text-text-secondary mt-1">{data.week}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityImpactDashboard;
