import axios from "axios";
import {getGiphyUrl, mapGiphyData} from './giphy';


const getData = async (url) => {
    console.log(`GET ${url}`);
    const results = await axios.get(url);

    //console.log('Got data ' + JSON.stringify(results));
    return results.data;
}

// a simple key/value cache which stores results
const cache = new Map();
const maxCacheEntries = 10;

export const cacheStats = {
    hits: 0,
    misses: 0
}

export const loadData = async ({term, offset, limit}) => {
    console.log(`loadData term:${term} offset:${offset} limit:${limit}`);

    // get the url which will be used as a cache key
    const key = getGiphyUrl({term, offset, limit});

    if (cache.has(key)) {
        console.log(`Cache Hit: term:${term} offset:${offset} limit:${limit}`);
        cacheStats.hits++;
        return cache.get(key);
    }

    // get the data
    const bigData = await getData(key);
    cacheStats.misses++;

    // transform it 
    const data = mapGiphyData(bigData);

    if (!data) {
        return null;
    }

    // since we didn't get it from the data loader
    data.term = term;

    // evict the oldest entry if needed. Since JS maps preserve order we can safely use the first index
    if (cache.size === maxCacheEntries) {
        const key0 = cache.keys().next().value;
        cache.delete(key0);
    }

    // and cache it
    cache.set(key, data);
    console.log(`Cached: term:${term} offset:${offset} limit:${limit}`);

    return data;
}

