import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';

import { InstantSearch, SearchBox, Configure } from 'react-instantsearch/dom';
import 'bootstrap/dist/css/bootstrap.css';
import { connectHits } from 'react-instantsearch/connectors';

class HeaderForm extends Component {
  constructor() {
    super();
    this.state = { appId: '', apiKey: '', indexName: '' };
  }

  onChangeProps(e) {
    const attributeName = e.target.name;
    console.log('target name', e.target.name);
    console.log('state', this.state);
    // To pass a variable in an object as a key: option1
    // Create an empty object then use the bracket notation
    // const obj = {};
    // obj[targetName] = e.target.value;
    // Option 2: dynamic attribute
    // this.setState(obj)
    this.setState({ [attributeName]: e.target.value }, () => {
      this.props.onChange(this.state);
    });
  }

  render() {
    return (
      <div>
        <form>
          <label>
            App ID<input
              name="appId"
              type="text"
              onChange={this.onChangeProps.bind(this)}
            />
          </label>
          <label>
            API Key<input
              name="apiKey"
              type="text"
              onChange={this.onChangeProps.bind(this)}
            />
          </label>
          <label>
            Index Name<input
              name="indexName"
              type="text"
              onChange={this.onChangeProps.bind(this)}
            />
          </label>
        </form>
      </div>
    );
  }
}

const computeColumns = hits =>
  Object.keys(hits[0]).reduce(
    (columns, key) => {
      if (typeof hits[0][key] !== 'object' && key !== 'objectID') {
        return [...columns, { key, name: key, editable: true }];
      }

      return columns;
    },
    [{ key: 'objectID', name: 'objectID' }]
  );

const Hits = connectHits(
  ({ hits }) =>
    hits.length > 0
      ? <ReactDataGrid
          enableCellSelect={true}
          columns={computeColumns(hits)}
          rowGetter={index => hits[index]}
          rowsCount={hits.length}
          minHeight={500}
          onGridRowsUpdated={() => {
            console.log('test');
          }}
        />
      : null
);

function Search() {
  return (
    <div className="container">
      <Hits />
    </div>
  );
}

class App extends Component {
  constructor() {
    super();
    // The state needs to be initialized
    this.state = {
      appId: 'latency',
      apiKey: 'cc85a3bf7c1c2a91b72b3edcbbbc4801',
      indexName: 'bestbuy_hack_is',
    };
  }

  render() {
    let content;
    if (
      this.state.appId.length === 0 ||
      this.state.indexName === 0 ||
      this.state.apiKey.length < 32
    ) {
      content = (
        <div>
          <strong>Please fill in the input fields</strong>
        </div>
      );
    } else {
      content = (
        <InstantSearch
          appId={this.state.appId}
          apiKey={this.state.apiKey}
          indexName={this.state.indexName}
        >
          <Configure hitsPerPage={100} />
          <br />
          <hr />
          <br />
          <SearchBox focusShortcuts={[]} />
          <br />
          <Search />
        </InstantSearch>
      );
    }
    return (
      <div>
        <HeaderForm
          onChange={credentials => {
            this.setState(credentials);
          }}
        />
        {content}
      </div>
    );
  }
}

export default App;
