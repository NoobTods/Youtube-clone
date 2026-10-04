import axios from "axios";

const BASE_URL = 'https://youtube-v31.p.rapidapi.com';
const API_HOST = 'youtube-v31.p.rapidapi.com';

export const API_PROVIDER = import.meta.env.VITE_API_PROVIDER ?? 'rapidapi';
const OFFICIAL_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const buildRequestOptions = (params) => ({
  params: {
    maxResults: '50', 
    ...params,        
                      
  },
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_APP_RAPID_API_KEY,
    'x-rapidapi-host': API_HOST,
    'Content-Type': 'application/json',
  },
});

const logQuota = (response) => {
  if (!import.meta.env.DEV) return;

  if (API_PROVIDER === 'official') {
    return;
  }

  const remaining =
    response.headers['x-ratelimit-requests-remaining'] ??
    response.headers['x-ratelimit-remaining'];
  const limit = response.headers['x-ratelimit-requests-limit'];

  if (remaining !== undefined) {
    console.info(
      `[API quota] remaining: ${remaining}${limit ? ` / ${limit}` : ''}`
    );
  }
};

export const fetchFromAPI = async (url, params = {}) => {
  if (API_PROVIDER === 'official') {
    const [path, queryString] = url.split('?');
    const searchParams = new URLSearchParams(queryString ?? '');

    searchParams.set('key', import.meta.env.VITE_YOUTUBE_API_KEY);
    searchParams.set('maxResults', searchParams.get('maxResults') ?? '50');

    if (path === 'search' && !searchParams.has('type')) {
      searchParams.set('type', 'video');
    }

    searchParams.delete('relatedToVideoId');
    Object.entries(params).forEach(([k, v]) => searchParams.set(k, v));

    const response = await axios.get(`${OFFICIAL_BASE_URL}/${path}?${searchParams.toString()}`);
    return response.data;
  }

  const response = await axios.get(`${BASE_URL}/${url}`, buildRequestOptions(params));

  logQuota(response);

  return response.data;
};