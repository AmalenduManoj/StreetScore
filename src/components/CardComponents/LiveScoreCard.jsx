export default function LiveScoreCard() {
    return (    
        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-md">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">Live Score</h2>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src="/team1-logo.png" alt="Team 1 Logo" className="h-10 w-10 rounded-full" />
                    <span className="text-gray-700">Team 1</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">3 - 2</span>
                <div className="flex items-center gap-4">
                    <img src="/team2-logo.png" alt="Team 2 Logo" className="h-10 w-10 rounded-full" />
                    <span className="text-gray-700">Team 2</span>
                </div>
            </div>
            <p className="
mt-2 text-sm text-gray-500">45' - First Half</p>
        </div>
    );
}   
