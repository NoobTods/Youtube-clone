import axios from "axios";

const BASE_URL = 'https://youtube-v31.p.rapidapi.com';
const API_HOST = 'youtube-v31.p.rapidapi.com';

// [CHANGED - dual provider] Choix du fournisseur via .env :
//   VITE_API_PROVIDER=rapidapi  -> RapidAPI (200 req/mois)
//   VITE_API_PROVIDER=official  -> API officielle YouTube (10 000 unités/jour)
// Pour switcher manuellement, change juste cette variable et relance le serveur.
export const API_PROVIDER = import.meta.env.VITE_API_PROVIDER ?? 'rapidapi';
const OFFICIAL_BASE_URL = 'https://www.googleapis.com/youtube/v3';

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
// const logQuota = (response) => {
//   if (!import.meta.env.DEV) return;

//   // Header names vary between RapidAPI apps; check the usual suspects.
//   const remaining =
//     response.headers['x-ratelimit-requests-remaining'] ??
//     response.headers['x-ratelimit-remaining'];
//   const limit = response.headers['x-ratelimit-requests-limit'];

//   if (remaining !== undefined) {
//     console.info(
//       `[API quota] remaining: ${remaining}${limit ? ` / ${limit}` : ''}`
//     );
//   }
// };

const logQuota = (response) => {
  if (!import.meta.env.DEV) return;

  // [CHANGED - dual provider] L'API officielle ne renvoie pas de headers de
  // quota restants : on estime la consommation par type d'endpoint.
  //   search.list   = 100 unités | videos.list / channels.list = 1 unité
  //   Quota gratuit = 10 000 unités/jour.
  if (API_PROVIDER === 'official') {
    return; // handled by logOfficialQuota below (needs the URL, not the response)
  }

  console.log('========== RAPIDAPI QUOTA ==========');

  console.log(
    'Requests limit:',
    response.headers['x-ratelimit-requests-limit']
  );

  console.log(
    'Requests remaining:',
    response.headers['x-ratelimit-requests-remaining']
  );

  console.log(
    'Requests reset:',
    response.headers['x-ratelimit-requests-reset']
  );

  console.log(
    'Free plan limit:',
    response.headers['x-rate-limit-rapid-free-plans-hard-limit-limit']
  );

  console.log(
    'Free plan remaining:',
    response.headers['x-rate-limit-rapid-free-plans-hard-limit-remaining']
  );

  console.log(
    'Free plan reset:',
    response.headers['x-rate-limit-rapid-free-plans-hard-limit-reset']
  );

  console.log('====================================');
};

// [CHANGED - dual provider] Estimation de la consommation de quota officiel
// (pas de header côté Google, on compte nous-mêmes).
let officialUnitsUsed = 0;
const estimateUnits = (url) => (url.startsWith('search') ? 100 : 1);
const logOfficialQuota = (url) => {
  if (!import.meta.env.DEV) return;
  officialUnitsUsed += estimateUnits(url);
  console.log(
    `========== YOUTUBE API (official) ==========\n` +
    `Requête : ${url.split('?')[0]} (~${estimateUnits(url)} unités)\n` +
    `Estimation session : ~${officialUnitsUsed} / 10000 unités\n` +
    `============================================`
  );
};

// [CHANGED] `fetchFromAPI(url)` still works exactly as before, but it now also
// accepts an optional `params` object for future endpoints (pagination, extra parts...).
export const fetchFromAPI = async (url, params = {}) => {
  // [CHANGED - dual provider] Si on est sur l'API officielle, on traduit
  // l'URL RapidAPI (ex: "videos?part=snippet,statistics&id=abc") vers un
  // appel https://www.googleapis.com/youtube/v3/... avec la clé en paramètre.
  if (API_PROVIDER === 'official') {
    const [path, queryString] = url.split('?');
    const searchParams = new URLSearchParams(queryString ?? '');

    searchParams.set('key', import.meta.env.VITE_YOUTUBE_API_KEY);
    searchParams.set('maxResults', searchParams.get('maxResults') ?? '50');

    // L'API officielle renvoie channels/playlists/vidéos sans ce filtre ;
    // on force type=video pour que les composants reçoivent des vidéos.
    if (path === 'search' && !searchParams.has('type')) {
      searchParams.set('type', 'video');
    }

    // relatedToVideoId est déprécié depuis longtemps côté officiel : on le
    // remplace par une recherche par titre (géré côté VideoDetail).
    searchParams.delete('relatedToVideoId');
    Object.entries(params).forEach(([k, v]) => searchParams.set(k, v));

    const response = await axios.get(`${OFFICIAL_BASE_URL}/${path}?${searchParams.toString()}`);
    logOfficialQuota(url);
    return response.data;
  }

  const response = await axios.get(`${BASE_URL}/${url}`, buildRequestOptions(params));

  logQuota(response); // [CHANGED - quota] track remaining requests in dev console

  return response.data;
};