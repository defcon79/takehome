import React from 'react';

const Pager = props => {
    const {prev, next, page, total, cacheStats} = props;

    return <div>
            <button onClick={prev}> Previous </button>
            <button onClick={next}> Next </button>
            Page: {page}, Total: {total}, Cache: Hits {cacheStats.hits} Misses {cacheStats.misses}
           </div>;
}

export default Pager;

