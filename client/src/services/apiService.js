import axios from 'axios';

// GitHub API (Free, rate limited without auth)
export const fetchGithubRepos = async (topic) => {
    try {
        const q = encodeURIComponent(`${topic} tutorial in:readme,description`);
        const { data } = await axios.get(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=3`);
        return data.items.map(repo => ({
            id: repo.id,
            title: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            type: 'github',
            stars: repo.stargazers_count
        }));
    } catch (error) {
        console.error("Error fetching GitHub repos", error);
        return [];
    }
};

// DEV.to API (Free, no auth required)
export const fetchDevToArticles = async (tag) => {
    try {
        // DEV doesn't allow multi-word spaces easily in tags, so we map or simplify
        const cleanTag = tag.toLowerCase().replace(/[^a-z0-9]/g, '');
        const { data } = await axios.get(`https://dev.to/api/articles?tag=${cleanTag}&per_page=3`);
        return data.map(article => ({
            id: article.id,
            title: article.title,
            description: article.description,
            url: article.url,
            type: 'article',
            author: article.user.name
        }));
    } catch (error) {
        console.error("Error fetching Dev.to articles", error);
        return [];
    }
};

// YouTube API (Requires key, but we will mock a fallback if it fails or if there's no key)
// In a real scenario, you'd use process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
export const fetchYouTubeVideos = async (query) => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (!apiKey) {
        // Fallback mock data if no API key is set for testing the UI
        return [
            { id: 'mock1', title: `Learn ${query} Basics`, description: `A comprehensive guide to ${query}`, url: `https://youtube.com/results?search_query=${encodeURIComponent(query + ' tutorial')}`, type: 'video' },
            { id: 'mock2', title: `Advanced ${query} Crash Course`, description: `Master ${query} in 2 hours`, url: `https://youtube.com/results?search_query=${encodeURIComponent(query + ' crash course')}`, type: 'video' }
        ];
    }

    try {
        const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' tutorial')}&type=video&maxResults=3&key=${apiKey}`);
        return data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            type: 'video',
            author: item.snippet.channelTitle
        }));
    } catch (error) {
        console.error("Error fetching YouTube videos", error);
        return [];
    }
};

// Aggregate function for a specific learning step
export const fetchLearningResources = async (topic) => {
    const [github, articles, videos] = await Promise.all([
        fetchGithubRepos(topic),
        fetchDevToArticles(topic),
        fetchYouTubeVideos(topic)
    ]);
    return [...videos, ...articles, ...github];
};
