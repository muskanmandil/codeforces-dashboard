import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import '@shopify/polaris/build/esm/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {
  AppProvider,
  Page,
  Select,
  TextField,
  DataTable,
  Pagination,
  Button,
  Icon,
} from '@shopify/polaris';
import {
  SearchIcon,
  StarIcon,
  StarFilledIcon,
} from '@shopify/polaris-icons';
import ContestChart from './ContestChart';
import ContestDetailPage from './ContestDetailPage';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const CONTESTS_CACHE_KEY = 'codeforces-contests-cache';
const CACHE_EXPIRATION_HOURS = 1;

const App = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);

  const [currPage, setCurrPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [typeFilter, setTypeFilter] = useState('All');
  const [phaseFilter, setPhaseFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-new-to-old');

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = sessionStorage.getItem('contestFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);

  const [loading, setLoading] = useState(false);

  // Debounce the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);


  const fetchContests = async () => {

    const cachedData = localStorage.getItem(CONTESTS_CACHE_KEY);

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const currentTime = new Date().getTime();

      // Check if cache is still valid
      if (currentTime - timestamp < CACHE_EXPIRATION_HOURS * 60 * 60 * 1000) {
        setContests(data);
        setFilteredContests(data);
        return;
      }
    }
    setLoading(true);
    try {
      const response = await fetch('https://codeforces.com/api/contest.list', {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'OK') {
        // Cache the fetched data
        localStorage.setItem(CONTESTS_CACHE_KEY, JSON.stringify({
          data: result.result,
          timestamp: new Date().getTime()
        }));

        setContests(result.result);
        setFilteredContests(result.result);
      } else {
        throw new Error('Failed to fetch contests');
      }
    } catch (err) {
      // toast.error(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    let filtered = contests;

    // Filter Contests
    if (typeFilter !== 'All') {
      filtered = filtered.filter((contest) => contest.type === typeFilter);
    }
    if (phaseFilter !== 'All') {
      filtered = filtered.filter((contest) => contest.phase === phaseFilter);
    }

    filtered = filtered.filter((contest) =>
      contest.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    // Sort contests
    if (sortBy === 'date-new-to-old') {
      filtered.sort((a, b) => b.startTimeSeconds - a.startTimeSeconds);
    } else if (sortBy === 'date-old-to-new') {
      filtered.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
    } else if (sortBy === 'duration-high-to-low') {
      filtered.sort((a, b) => b.durationSeconds - a.durationSeconds);
    } else if (sortBy === 'duration-low-to-high') {
      filtered.sort((a, b) => a.durationSeconds - b.durationSeconds);
    }

    // Show only favorite contests if the toggle is on
    if (showFavorites) {
      filtered = filtered.filter((contest) => favorites.includes(contest.id));
    }

    setFilteredContests(filtered);
    setCurrPage(1);
  }, [typeFilter, phaseFilter, debouncedSearchQuery, sortBy, contests, showFavorites, favorites]);

  useEffect(() => {
    sessionStorage.setItem('contestFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (contestId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(contestId)
        ? prevFavorites.filter((id) => id !== contestId)
        : [...prevFavorites, contestId]
    );
  };

  const formatPhase = (phase) => {
    switch (phase) {
      case 'BEFORE':
        return 'Upcoming';

      case 'CODING':
        return 'Live';

      case 'FINISHED':
        return 'Completed'
    }
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hours ${minutes !== 0 ? `${minutes} minutes` : ''}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const handleItemsPerPageChange = (value) => {
    const num = parseInt(value);
    if (num >= 5 && num <= 15) {
      setItemsPerPage(num);
      setCurrPage(1);
    }
  };

  const lastIdx = currPage * itemsPerPage;
  const firstIdx = lastIdx - itemsPerPage;
  const currContests = filteredContests.slice(firstIdx, lastIdx);
  const totalPages = Math.ceil(filteredContests.length / itemsPerPage);

  const handleNextPage = () => {
    if (currPage < totalPages) {
      setCurrPage(currPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currPage > 1) {
      setCurrPage(currPage - 1);
    }
  };

  const paginationLabel = filteredContests.length > 0 ?
    `${firstIdx + 1}-${Math.min(lastIdx, filteredContests.length)} of ${filteredContests.length} contests` : '';

  const rows = currContests.map((contest) => [
    <Link to={`/contest/${contest.id}`}>
      {contest.name}
    </Link>,
    contest.type,
    formatPhase(contest.phase),
    formatDuration(contest.durationSeconds),
    formatDate(contest.startTimeSeconds),
    <Button
      tone='success'
      onClick={() => toggleFavorite(contest.id)}
      children={favorites.includes(contest.id) ?
        (<Icon source={StarFilledIcon} tone='magic' />) :
        (<Icon source={StarIcon} tone='magic' />)}
    />
  ]);

  return (
    <Router>
      <AppProvider i18n={enTranslations}>
        <Routes>
          <Route
            path="/"
            element={
              <Page title="Contests">

                <div>

                  {/* Search Bar */}
                  <div className="mb-6">
                    <TextField
                      inputMode='search'
                      type='search'
                      placeholder="Search Contests by Name"
                      value={searchQuery}
                      onChange={(value) => setSearchQuery(value)}
                      prefix={<Icon source={SearchIcon} />}
                      variant='borderless'
                      tone='magic'
                      id='search-bar'
                    />
                  </div>

                  {/* Filter Options - Two Columns */}
                  <div className="flex justify-between gap-5 flex-wrap mb-6">
                    <div className="flex gap-6 flex-1 items-end">
                      <Select
                        label="Contest Type"
                        options={[
                          { label: 'All', value: 'All' },
                          { label: 'ICPC', value: 'ICPC' },
                          { label: 'CF', value: 'CF' },
                        ]}
                        onChange={(value) => setTypeFilter(value)}
                        value={typeFilter}
                        tone='magic'
                      />
                      <Select
                        label="Phase"
                        options={[
                          { label: 'All', value: 'All' },
                          { label: 'Upcoming', value: 'BEFORE' },
                          { label: 'Live', value: 'CODING' },
                          { label: 'Completed', value: 'FINISHED' },
                        ]}
                        onChange={(value) => setPhaseFilter(value)}
                        value={phaseFilter}
                        tone='magic'
                      />

                      <Button
                        id='fav-btn'
                        onClick={() => setShowFavorites(!showFavorites)}
                      >
                        {showFavorites ? 'Show All' : 'Show Favorites'}
                      </Button>
                    </div>

                    <div className='flex gap-4 justify-end flex-1'>
                      <Select
                        label="Sort"
                        options={[
                          { label: 'Date (New to Old)', value: 'date-new-to-old' },
                          { label: 'Date (Old to New)', value: 'date-old-to-new' },
                          { label: 'Duration (High to Low)', value: 'duration-high-to-low' },
                          { label: 'Duration (Low to High)', value: 'duration-low-to-high' },
                        ]}
                        onChange={(value) => setSortBy(value)}
                        value={sortBy}
                      />

                      <TextField
                        label="Items per Page (5-15)"
                        type="number"
                        value={itemsPerPage.toString()}
                        onChange={handleItemsPerPageChange}
                        id='items-per-page'
                      />
                    </div>
                  </div>
                </div>

                <div className='mb-8'>
                  <ContestChart data={currContests.map((contest) => ({
                    name: contest.name,
                    durationSeconds: contest.durationSeconds,
                  }))} />
                </div>


                {loading ? <p>Loading...</p> : filteredContests.length === 0 ? (
                  <p>No contests found with the given filters.</p>
                ) : (
                  <div className='flex flex-col gap-2 mb-12'>
                    {/* Contests List */}
                    <DataTable
                      columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text']}
                      headings={['Name', 'Type', 'Phase', 'Duration', 'Start Time', '']}
                      rows={rows}
                      hoverable="true"
                      stickyHeader="true"
                    />

                    {/* Pagination */}
                    <Pagination
                      type='table'
                      label={paginationLabel}
                      hasPrevious={currPage > 1}
                      onPrevious={handlePreviousPage}
                      hasNext={currPage < totalPages}
                      onNext={handleNextPage}
                    />
                  </div>
                )}

              </Page>
            }
          />


          <Route
            path="/contest/:contestId"
            element={<ContestDetailPage contests={contests} />}
          />
        </Routes>


      </AppProvider>
    </Router>
  );
}

export default App;