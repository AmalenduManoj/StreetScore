import { useEffect, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';

const emptyPlayer = (userId = null) => ({
  id: null,
  name: '',
  runs_scored: 0,
  user_id: userId,
  wickets_taken: 0,
  matches_played: 0,
  batting_average: 0,
  bowling_average: 0,
  role: 'batsman',
  age: 0,
  dob: new Date().getFullYear(),
  strike_rate: 0,
  over_bowled: 0,
  economy_rate: 0,
  five_wicket_hauls: 0,
  centuries: 0,
  half_centuries: 0,
  player_of_the_match_awards: 0,
  player_of_the_series_awards: 0,
  highest_score: 0,
  best_bowling_figures: '0/0',
  is_active: true,
  debut_date: null,
  last_match_date: null,
  profile_picture_url: '',
  bio: '',
  ball_faced: 0,
  fours: 0,
  sixes: 0,
  three_wicket_hauls: 0,
  catches: 0,
  stumpings: 0,
});

const numericFields = new Set([
  'runs_scored', 'user_id', 'wickets_taken', 'matches_played',
  'batting_average', 'bowling_average', 'age', 'strike_rate', 'over_bowled',
  'dob',
  'economy_rate', 'five_wicket_hauls', 'centuries', 'half_centuries',
  'player_of_the_match_awards', 'player_of_the_series_awards', 'highest_score',
  'ball_faced', 'fours', 'sixes', 'three_wicket_hauls', 'catches', 'stumpings',
]);

const Profile = () => {
  const { token, user, isAuthenticated } = useAuth();
  const currentUserId = user?.user_id ?? user?.id ?? null;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(emptyPlayer(currentUserId));
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const playerResponse = await fetch('http://localhost:8080/players', { headers });

        if (playerResponse.ok) {
          const playerData = await playerResponse.json();
          const allPlayers = Array.isArray(playerData) ? playerData : [];
          const existing = allPlayers.find((player) => player.user_id === currentUserId);

          if (existing) {
            setProfile({ ...existing, user_id: currentUserId });
            setHasExistingProfile(true);
          } else {
            setProfile(emptyPlayer(currentUserId));
            setHasExistingProfile(false);
          }
        }
      } catch (fetchError) {
        console.error('Error loading profile data:', fetchError);
        setError('Could not load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId, token]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? checked
        : numericFields.has(name)
          ? value === ''
            ? ''
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      if (hasExistingProfile && profile.id) {
        // Update only the fields this form edits.
        const updatePayload = {
          name: profile.name,
          is_active: Boolean(profile.is_active),
          dob: Number(profile.dob),
          role: profile.role,
          profile_picture_url: profile.profile_picture_url || null,
          bio: profile.bio || null,
        };

        const response = await fetch(`http://localhost:8080/players/update/${profile.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        });

        if (response.ok) {
          setMessage('Player updated successfully');
        } else {
          const text = await response.text();
          setError(text || 'Unable to update profile');
        }
      } else {
        // Create minimal player record (server takes user_id from token)
        const payload = {
          name: profile.name,
          is_active: profile.is_active,
          dob: Number(profile.dob),
          role: profile.role,
        };
        if (profile.profile_picture_url) payload.profile_picture_url = profile.profile_picture_url;
        if (profile.bio) payload.bio = profile.bio;

        const response = await fetch('http://localhost:8080/players', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setMessage('Player created successfully');
          setHasExistingProfile(true);
        } else {
          const text = await response.text();
          setError(text || 'Unable to create profile');
        }
      }
    } catch (submitError) {
      console.error('Profile submit error:', submitError);
      setError('Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-3 text-gray-600">Please log in to create or update your cricket profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Cricket Profile</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            {hasExistingProfile
              ? 'Update your player profile below. Changes are saved back to your cricket record.'
              : 'Create your cricket profile below so your player record can be added.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">Basic Information</h2>
            <p className="mb-4 text-sm text-gray-600">
              Only basic information is required. Cricket stats are created as zero and dates stay null until later.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">Player Name</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
                  placeholder="Your cricket name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">Role</label>
                <select
                  name="role"
                  value={profile.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
                >
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="all-rounder">All-rounder</option>
                  <option value="wicket-keeper">Wicket Keeper</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">Birth Year (dob)</label>
                <input
                  type="number"
                  name="dob"
                  value={profile.dob}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">Profile Picture URL</label>
                <input
                  name="profile_picture_url"
                  value={profile.profile_picture_url}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#00a79d] focus:outline-none focus:ring-1 focus:ring-[#00a79d]"
                  placeholder="Short player bio"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={profile.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-[#00a79d] focus:ring-[#00a79d]"
                />
                <label className="text-sm font-semibold text-gray-800">Active player</label>
              </div>
            </div>
          </section>

          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Only basic information is required. Cricket stats are created as zero and dates stay null until later.
          </div>

          {message && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gradient-to-r from-[#00a79d] to-[#008b7f] px-6 py-3 font-bold text-white transition-all duration-300 hover:from-[#008b7f] hover:to-[#006b61] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Saving...
                </span>
              ) : hasExistingProfile ? (
                'Update Profile'
              ) : (
                'Create Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;