import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const CreateMatch = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    tournament_id: null,
    team1_id: null,
    team2_id: null,
    venue: '',
    total_overs: 20,
  });
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tournamentSearch, setTournamentSearch] = useState('');
  const [team1Search, setTeam1Search] = useState('');
  const [team2Search, setTeam2Search] = useState('');
  const [showTournamentDropdown, setShowTournamentDropdown] = useState(false);
  const [showTeam1Dropdown, setShowTeam1Dropdown] = useState(false);
  const [showTeam2Dropdown, setShowTeam2Dropdown] = useState(false);
  const { token } = useAuth();

  // Fetch tournaments and teams on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch tournaments
        const tournamentsResponse = await fetch('http://localhost:8080/tournaments', {
          headers,
        });
        if (tournamentsResponse.ok) {
          const tournamentsData = await tournamentsResponse.json();
          setTournaments(tournamentsData);
        }

        // Fetch teams
        const teamsResponse = await fetch('http://localhost:8080/teams', {
          headers,
        });
        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json();
          setTeams(teamsData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [token]);

  const handleTournamentSelect = (tournament) => {
    setFormData((prev) => ({
      ...prev,
      tournament_id: tournament.id,
    }));
    setTournamentSearch(tournament.name);
    setShowTournamentDropdown(false);
  };

  const handleTeam1Select = (team) => {
    setFormData((prev) => ({
      ...prev,
      team1_id: team.id,
    }));
    setTeam1Search(team.name);
    setShowTeam1Dropdown(false);
  };

  const handleTeam2Select = (team) => {
    setFormData((prev) => ({
      ...prev,
      team2_id: team.id,
    }));
    setTeam2Search(team.name);
    setShowTeam2Dropdown(false);
  };

  const handleFriendlyMatch = () => {
    setFormData((prev) => ({
      ...prev,
      tournament_id: null,
    }));
    setTournamentSearch('Friendly Match');
    setShowTournamentDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.team1_id || !formData.team2_id || !formData.venue) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.team1_id === formData.team2_id) {
      setError('Team 1 and Team 2 must be different');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(data);
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to create match');
      }
    } catch (err) {
      setError('Error creating match');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Match</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tournament Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Tournament</label>
            <div className="relative">
              <input
                type="text"
                value={tournamentSearch}
                onChange={(e) => {
                  setTournamentSearch(e.target.value);
                  setShowTournamentDropdown(true);
                }}
                onFocus={() => setShowTournamentDropdown(true)}
                placeholder="Search tournaments..."
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#00a79d] focus:ring-1 focus:ring-[#00a79d]"
              />
              {showTournamentDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                  {/* Friendly Match Option */}
                  <button
                    type="button"
                    onClick={handleFriendlyMatch}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-900 border-b border-gray-200"
                  >
                    <div className="font-semibold">🎯 Friendly Match</div>
                    <div className="text-xs text-gray-600">No tournament</div>
                  </button>

                  {/* Tournament List */}
                  {tournaments
                    .filter((t) =>
                      t.name.toLowerCase().includes(tournamentSearch.toLowerCase())
                    )
                    .map((tournament) => (
                      <button
                        key={tournament.id}
                        type="button"
                        onClick={() => handleTournamentSelect(tournament)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-900"
                      >
                        <div className="font-semibold">{tournament.name}</div>
                        <div className="text-xs text-gray-600">
                          {tournament.location} • {new Date(tournament.start_date).toLocaleDateString()}
                        </div>
                      </button>
                    ))}

                  {tournaments.filter((t) =>
                    t.name.toLowerCase().includes(tournamentSearch.toLowerCase())
                  ).length === 0 &&
                    tournamentSearch &&
                    tournamentSearch !== 'Friendly Match' && (
                      <div className="px-4 py-3 text-sm text-gray-600 bg-blue-50">
                        <p className="font-semibold text-blue-900">💡 New Tournament?</p>
                        <p className="text-xs mt-1">
                          New tournaments must be created by admin. Please contact administrator to add "{tournamentSearch}".
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
            {formData.tournament_id === null && tournamentSearch === 'Friendly Match' && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                ✓ Friendly match selected (no tournament required)
              </p>
            )}
          </div>

          {/* Team 1 Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Team 1</label>
            <div className="relative">
              <input
                type="text"
                value={team1Search}
                onChange={(e) => {
                  setTeam1Search(e.target.value);
                  setShowTeam1Dropdown(true);
                }}
                onFocus={() => setShowTeam1Dropdown(true)}
                placeholder="Search teams..."
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#00a79d] focus:ring-1 focus:ring-[#00a79d]"
              />
              {showTeam1Dropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                  {teams
                    .filter((t) => t.name.toLowerCase().includes(team1Search.toLowerCase()))
                    .map((team) => (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => handleTeam1Select(team)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-900"
                      >
                        {team.name}
                      </button>
                    ))}
                  {teams.filter((t) =>
                    t.name.toLowerCase().includes(team1Search.toLowerCase())
                  ).length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-600">No teams found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Team 2 Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Team 2</label>
            <div className="relative">
              <input
                type="text"
                value={team2Search}
                onChange={(e) => {
                  setTeam2Search(e.target.value);
                  setShowTeam2Dropdown(true);
                }}
                onFocus={() => setShowTeam2Dropdown(true)}
                placeholder="Search teams..."
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#00a79d] focus:ring-1 focus:ring-[#00a79d]"
              />
              {showTeam2Dropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                  {teams
                    .filter((t) => t.name.toLowerCase().includes(team2Search.toLowerCase()))
                    .map((team) => (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => handleTeam2Select(team)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-900"
                      >
                        {team.name}
                      </button>
                    ))}
                  {teams.filter((t) =>
                    t.name.toLowerCase().includes(team2Search.toLowerCase())
                  ).length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-600">No teams found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Venue</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData((prev) => ({ ...prev, venue: e.target.value }))}
              placeholder="e.g., Cricket Stadium"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#00a79d] focus:ring-1 focus:ring-[#00a79d]"
              required
            />
          </div>

          {/* Total Overs */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Total Overs</label>
            <input
              type="number"
              value={formData.total_overs}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, total_overs: parseInt(e.target.value) }))
              }
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#00a79d] focus:ring-1 focus:ring-[#00a79d]"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !formData.team1_id || !formData.team2_id || !formData.venue}
            className="w-full bg-gradient-to-r from-[#00a79d] to-[#008b7f] hover:from-[#008b7f] hover:to-[#006b61] text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Match'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMatch;
