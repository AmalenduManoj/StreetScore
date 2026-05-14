import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import MatchDetail from './MatchDetail';
import CreateMatch from './CreateMatch';
import CreateTeam from './CreateTeam';

const LiveScoreCard = ({ match, isLive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#00a79d] transition-all duration-300 hover:shadow-lg hover:shadow-[#00a79d]/20 cursor-pointer transform hover:scale-105"
    >
      {isLive && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-500 text-sm font-bold">LIVE</span>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 items-center mb-6">
        <div className="text-center">
          <p className="text-gray-900 font-bold text-lg">{match.team1?.name}</p>
          <p className="text-[#00a79d] text-2xl font-bold mt-2">{match.team1_score || 0}</p>
          <p className="text-gray-600 text-xs mt-1">
            {match.team1_wickets || 0}w ({match.team1_overs || 0})
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-xs uppercase">vs</p>
          <div className="my-2">
            <p className="text-gray-700 text-xs">{match.venue}</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-900 font-bold text-lg">{match.team2?.name}</p>
          <p className="text-[#00a79d] text-2xl font-bold mt-2">{match.team2_score || 0}</p>
          <p className="text-gray-600 text-xs mt-1">
            {match.team2_wickets || 0}w ({match.team2_overs || 0})
          </p>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <p className="text-gray-700 text-sm">
          <span className="text-[#00a79d] font-semibold">Status:</span> {match.status}
        </p>
      </div>
    </div>
  );
};

export default function Livescore() {
  const { isAuthenticated, token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        // Create headers with auth if available
        const headers = token 
          ? { Authorization: `Bearer ${token}` }
          : {};

        // Fetch all matches
        const matchesResponse = await fetch('http://localhost:8080/matches', {
          headers,
        });

        // Fetch live matches
        const liveResponse = await fetch('http://localhost:8080/matches/live', {
          headers,
        });

        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          const completed = matchesData.filter((m) => m.status === 'completed');
          setMatches(completed);
        }

        if (liveResponse.ok) {
          const liveData = await liveResponse.json();
          setLiveMatches(liveData);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [token]);

  const handleCreateMatchSuccess = (newMatch) => {
    if (newMatch.status === 'live') {
      setLiveMatches((prev) => [newMatch, ...prev]);
    } else {
      setMatches((prev) => [newMatch, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        {/* Header Section */}
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Live Scores
            </h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Stay updated with real-time cricket scores, match stats, and live commentary.
            </p>
          </div>
          {isAuthenticated && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowCreateTeam(true)}
                className="whitespace-nowrap rounded-lg border border-[#00a79d] bg-white px-6 py-3 font-bold text-[#00a79d] transition-colors duration-300 hover:bg-gray-50"
              >
                + Create Team
              </button>
              <button
                onClick={() => setShowCreateMatch(true)}
                className="whitespace-nowrap rounded-lg bg-gradient-to-r from-[#00a79d] to-[#008b7f] px-6 py-3 font-bold text-white transition-all duration-300 hover:from-[#008b7f] hover:to-[#006b61]"
              >
                + Create Match
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-600 text-lg">Loading matches...</div>
          </div>
        ) : (
          <>
            {/* Live Matches Section */}
            {liveMatches.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  Live Matches
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {liveMatches.map((match) => (
                    <LiveScoreCard
                      key={match.id}
                      match={match}
                      isLive={true}
                      onClick={() => {
                        if (!isAuthenticated) {
                          alert('Please login to view match details');
                        } else {
                          setSelectedMatch(match.id);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Matches Section */}
            {matches.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Finished Matches</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matches.map((match) => (
                    <LiveScoreCard
                      key={match.id}
                      match={match}
                      isLive={false}
                      onClick={() => {
                        if (!isAuthenticated) {
                          alert('Please login to view match details');
                        } else {
                          setSelectedMatch(match.id);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Matches Message */}
            {liveMatches.length === 0 && matches.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">
                  No matches available at the moment.
                </p>
              </div>
            )}

            {/* User Specific Content */}
            {isAuthenticated && (
              <div className="mt-16 bg-gradient-to-r from-[#00a79d] to-[#008b7f] rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Welcome!</h3>
                <p className="text-white text-opacity-90">
                  You're now logged in and can create matches, view detailed statistics, and stay updated with live cricket scores.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <MatchDetail matchId={selectedMatch} onBack={() => setSelectedMatch(null)} />
      )}

      {/* Create Match Modal */}
      {showCreateMatch && isAuthenticated && (
        <CreateMatch
          onClose={() => setShowCreateMatch(false)}
          onSuccess={handleCreateMatchSuccess}
        />
      )}

      {showCreateTeam && isAuthenticated && (
        <CreateTeam
          onClose={() => setShowCreateTeam(false)}
          onSuccess={() => setShowCreateTeam(false)}
        />
      )}
    </div>
  );
}
    