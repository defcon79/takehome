import React, { Component } from 'react';
import './App.css';
import Search from './search';
import ImageGrid from './imageGrid';
import {loadData, cacheStats} from './dataLoader';
import Pager from './pager';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: '',
      images: [],
      offset: 0,
      limit: 10,
      total: 0
    }
  }


  // main entry point which loads data
  async refresh({term, offset, limit = this.state.limit}) {
    const data = await loadData({term, offset, limit});
    this.setState(data);
  }

  // callback for search component
  doSearch = async term => {
    console.log(`Searching for ${term}`);
    
    // starting a new search
    const offset = 0;

    this.refresh ({term, offset});
  }


  goNext = async () => {
    const {term, offset, limit, total} = this.state;

    // don't go beyond last item
    if (offset + limit < total) {
      this.refresh({term, offset:(offset + limit)});
    }
  }

  goPrev = async () => {
    const {term, offset, limit} = this.state;

    // don't go beyond 1st item
    if (offset >= limit) {
      this.refresh({term, offset:(offset - limit)});
    }
  }


  render() {

    const {offset, limit, total} = this.state;
    const page = Math.abs(offset / limit);

    return (
      <div className='App'>
        <p> Giphy Search Test app </p>
        <Search doSearch = {this.doSearch}/>
        <p/>
        <ImageGrid images={this.state.images} />
        <Pager prev = {this.goPrev} next = {this.goNext} page = {page} total={total} cacheStats = {cacheStats}/>
      </div>
    );
  }
}

export default App;
