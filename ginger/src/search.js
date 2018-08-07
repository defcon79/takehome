import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// future optimization - we should debounce esp when SAYT is used
//import debounce from 'lodash/debounce';

class Search extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            term:'',
            sayt: false,
        }
    }

    static defaultProps = {
        minSearchLength: 3
    }

    static propTypes = {
        doSearch: PropTypes.func.isRequired,
        minSearchLength: PropTypes.number
    }

    onSubmit = (ev) => {
        ev.preventDefault();

        const term = this.state.term;
        //console.log(`Search for ${term}`);

        this.props.doSearch(term);
    }
    
    onChange = ({target: {value}}) => {
        //const value = ev.target.value;
        //console.log(`Typed ${value}`);
        this.setState({term: value});

        // do a search if needed
        if (this.state.sayt && value.length >= this.props.minSearchLength) {
         
            // since setState is async, we search for the explicit value here
            // rather than the satte
            this.props.doSearch(value);
        }
    }

    onSaytChange = ({target: {checked}}) => {
        console.log('sayt = ', checked);
        this.setState({sayt: checked});
    }



    render() {
        const {term, sayt} = this.state;
        const enableSearchBtn = !sayt && term.length >= this.props.minSearchLength; 
        return (
            <div>
                Search as you type: 
                <input type = 'checkbox' checked = {this.state.sayt} onChange = {this.onSaytChange}/> 
                <form onSubmit={this.onSubmit}>
                    <input type = 'text' placeholder='Do a search' value = {this.state.term} onChange = {this.onChange}/>
                    <input type="submit" value="Search" disabled = {!enableSearchBtn}/>
                </form>
            </div>);
    }
}

export default Search;