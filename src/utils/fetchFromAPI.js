import axios from "axios";

const BASE_URL = 'https://youtube-v31.p.rapidapi.com';
const API_HOST = 'youtube-v31.p.rapidapi.com';

// [CHANGED - API optimization] Build the axios config *inside* the request function.
// Before, a single shared `options` object was reused for every call. That works today,
// but per-call options let future endpoints pass their own params (pagination tokens,
// `part=snippet,statistics`...) without mutating shared state.
const buildRequestOptions = (params) => ({
  params: {
    maxResults: '50', // keep maxResults at 50: a bigger page costs the same 1 request
    ...params,        // [CHANGED] params are now passed per call (plain object)
                      // instead of being hardcodable only in this file
  },
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_APP_RAPID_API_KEY,
    'x-rapidapi-host': API_HOST, // [CHANGED] reuse the API_HOST constant
    'Content-Type': 'application/json',
  },
});

// [CHANGED - quota] Every response carries RapidAPI rate-limit headers. Reading them
// lets you SEE your burn rate in dev instead of discovering you're out of quota.
// No-op in production builds so there is zero overhead for end users.
const logQuota = (response) => {
  if (!import.meta.env.DEV) return;

  // Header names vary between RapidAPI apps; check the usual suspects.
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

// [CHANGED] `fetchFromAPI(url)` still works exactly as before, but it now also
// accepts an optional `params` object for future endpoints (pagination, extra parts...).
export const fetchFromAPI = async (url, params = {}) => {
  const response = await axios.get(`${BASE_URL}/${url}`, buildRequestOptions(params));

  logQuota(response); // [CHANGED - quota] track remaining requests in dev console

  return response.data;
};