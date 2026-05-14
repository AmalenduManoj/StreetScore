import { useEffect, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';

const CreateTeam = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    matches_played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    created_by_user_id: null,
  });
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playerSearch, setPlayerSearch] = useState('');
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
  const { token, user } = useAuth();
  const currentUserId = user?.user_id ?? user?.id ?? null;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch('http://localhost:8080/players', { headers });

        if (response.ok) {
          const data = await response.json();
          setPlayers(Array.isArray(data) ? data : []);
        }
      } catch (fetchError) {
        console.error('Error fetching players:', fetchError);
      }
    };

    fetchPlayers();
  }, [token]);

  useEffect(() => {
    if (currentUserId) {
      setFormData((prev) => ({
        ...prev,
        created_by_user_id: currentUserId,
      }));
    }
  }, [currentUserId]);

  const filteredPlayers = useMemo(() => {
    const query = playerSearch.trim().toLowerCase();
    if (!query) return players;

    return players.filter((player) => {
      const name = player.name || '';
      return name.toLowerCase().includes(query);
    });
  }, [players, playerSearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['matches_played', 'wins', 'losses', 'draws', 'created_by_user_id'].includes(name)
        ? value === ''
          ? ''
          : parseInt(value, 10)
        : value,
    }));
  };

  const handlePlayerSelect = (player) => {
    const alreadySelected = selectedPlayers.some((selected) => selected.id === player.id);
    if (alreadySelected) return;

    setSelectedPlayers((prev) => [...prev, player]);
    setPlayerSearch('');
    setShowPlayerDropdown(false);
  };

  const handleRemovePlayer = (playerId) => {
    setSelectedPlayers((prev) => prev.filter((player) => player.id !== playerId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.city || !currentUserId) {
      setError('Please fill in team name and city');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          created_by_user_id: currentUserId,
          players: selectedPlayers.map((player) => player.id),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(data);
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || errorData.message || 'Failed to create team');
      }
    } catch (submitError) {
      console.error('Error creating team:', submitError);
      setError('Error creating team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Team</h2>
            <p className="mt-1 text-sm text-gray-600">
              Create a team and optionally add players using the search box below.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 transition-colors hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">Team Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Mumbai Indians"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., Mumbai"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">Matches</label>
              <input
                type="number"
                name="matches_played"
                value={formData.matches_played}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
                min="0"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">Wins</label>
              <input
                type="number"
                name="wins"
                value={formData.wins}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
                min="0"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">Losses</label>
              <input
                type="number"
                name="losses"
                value={formData.losses}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
                min="0"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">Draws</label>
              <input
                type="number"
                name="draws"
                value={formData.draws}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">Add Players</label>
            <div className="relative">
              <input
                type="text"
                value={playerSearch}
                onChange={(e) => {
                  setPlayerSearch(e.target.value);
                  setShowPlayerDropdown(true);
                }}
                onFocus={() => setShowPlayerDropdown(true)}
                placeholder="Search players to add..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
              />

              {showPlayerDropdown && (
                <div className="absolute top-full left-0 right-0 z-10 mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                  {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player) => (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => handlePlayerSelect(player)}
                        className="flex w-full items-center justify-between px-4 py-2 text-left text-gray-900 transition-colors hover:bg-gray-100"
                      >
                        <span>{player.name}</span>
                        <span className="text-xs text-gray-500">Add</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-600">
                      No players available yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {selectedPlayers.map((player) => (
                <span
                  key={player.id}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
                >
                  {player.name}
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Players returned from the database will appear here.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[#00a79d] to-[#008b7f] py-3 font-bold text-white transition-all duration-300 hover:from-[#008b7f] hover:to-[#006b61] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;