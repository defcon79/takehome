import React from 'react';

const ImageGrid = ({images}) => {
    if (!images || images.length === 0) {
        return <div> Nothing Found !! </div>
    }
    const elems = images.map(e => {
        return (
            <div className='cell' key = {e.id}>
                <img src={e.img.url} alt={e.title} title={e.title}/>
            </div>
        );
    });

   return <div className='container'>
            <div className='grid'>
                {elems}
            </div>
          </div>;
};

export default ImageGrid;