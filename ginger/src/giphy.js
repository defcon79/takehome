const giphyKey = 'brXMsD0cTFgrd7yQh6u17ilSMIhDz2t9';

const buildUrl = ({term, offset = 0, limit = 10}) => 
                `https://api.giphy.com/v1/gifs/search?q=${term}&offset=${offset}&limit=${limit}&api_key=${giphyKey}`;


export const getGiphyUrl = ({term, offset = 0, limit = 10}) => buildUrl({term, offset, limit}); 

const giphySelector = 'fixed_width_still';

export const mapGiphyData = res => {
    if (!res.meta || (res.meta.msg !== 'OK')) return null;

    const pagination = res.pagination;
    const data = res.data;
    
    // filter all images of type 'gif'
    // the only pick the data for image of specified selector type
    const imgs = data
                    .filter (e => e.type === 'gif')    
                    .map (e => { return {
                                    id: e.id,          // used as key
                                    title: e.title,    // used as tooltip
                                    img: e.images[giphySelector]
                                }
                        });
    
    return {
        images: imgs,
        offset: pagination.offset,
        total: pagination.total_count
    }                
}
