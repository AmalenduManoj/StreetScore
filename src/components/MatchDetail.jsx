import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const MatchDetail = ({ matchId, onBack }) => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await fetch(`http://localhost:8080/matches/${matchId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMatch(data);
        } else {
          setError('Failed to fetch match details');
        }
      } catch (err) {
        setError('Error fetching match details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMatch();
    } else {
      setLoading(false);
    }
  }, [matchId, token]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-xl p-8 text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full text-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Match Details</h2>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : match ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Team 1</p>
                <p className="text-2xl font-bold text-[#00a79d]">{match.team1?.name}</p>
                <p className="text-4xl font-bold mt-3">{match.team1_score}</p>
                <p className="text-gray-400 text-sm mt-2">
                  {match.team1_wickets}w ({match.team1_overs})
                </p>
              </div>
              <div className="text-center flex flex-col justify-center">
                <p className="text-gray-400 text-xs mb-2">VS</p>
                <div className="border-t border-b border-gray-700 py-4">
                  <span className="text-[#00a79d] font-semibold uppercase text-xs">
                    {match.status}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Team 2</p>
                <p className="text-2xl font-bold text-[#00a79d]">{match.team2?.name}</p>
                <p className="text-4xl font-bold mt-3">{match.team2_score}</p>
                <p className="text-gray-400 text-sm mt-2">
                  {match.team2_wickets}w ({match.team2_overs})
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Venue</p>
                  <p className="text-white font-semibold">{match.venue}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tournament</p>
                  <p className="text-white font-semibold">Tournament #{match.tournament_id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Overs</p>
                  <p className="text-white font-semibold">{match.total_overs}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Match Status</p>
                  <p className="text-white font-semibold capitalize">{match.status}</p>
                </div>
              </div>
            </div>

            {match.team1 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-[#00a79d]">{match.team1.name} Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Matches Played</p>
                    <p className="text-white font-semibold">{match.team1.matches_played}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Won</p>
                    <p className="text-green-400 font-semibold">{match.team1.won}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Lost</p>
                    <p className="text-red-400 font-semibold">{match.team1.lost}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Draw</p>
                    <p className="text-gray-400 font-semibold">{match.team1.draw}</p>
                  </div>
                </div>
              </div>
            )}

            {match.team2 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-[#00a79d]">{match.team2.name} Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Matches Played</p>
                    <p className="text-white font-semibold">{match.team2.matches_played}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Won</p>
                    <p className="text-green-400 font-semibold">{match.team2.won}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Lost</p>
                    <p className="text-red-400 font-semibold">{match.team2.lost}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Draw</p>
                    <p className="text-gray-400 font-semibold">{match.team2.draw}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400">No match data available</p>
        )}
      </div>
    </div>
  );
};

export default MatchDetail;
