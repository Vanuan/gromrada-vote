import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import { fetchVotes } from './fetchVotes';
import { TableChart } from './TableChart';
import './App.css';

class Spinner extends PureComponent {
  render() {
    return <div id="loading" className="loading"><p>Підрахунок голосів...</p></div>;
  }
}

class ResultsRoute extends PureComponent {
  componentDidMount() {
    const { orgId, year } = this.props.match.params;
    this.setState({ loading: true, meta: null });
    fetch('/data/metadata.json').then(data => data.json()).then(metadata => {
      const meta = metadata[`${orgId}-${year}`];
      this.setState({ loading: true, meta });
      fetchVotes(meta).then(data => {
        const { votersCount, candidatesCount, votes } = data;
        this.setState({
          loading: false,
          meta: { ...meta, votersCount, candidatesCount },
          data: votes
        });
      }); 
    });
  }

  render() {
    if (!this.state || !this.state.meta) return null;
    if(this.state.loading) return <Spinner />;
    const { radaTitle, members, year, votersCount, candidatesCount } = this.state.meta;

    return (<>
      <Link to='/'>Інші голосування</Link>
      <h1>Результати рейтингового інтернет-голосування</h1>
      <h2>За кандидатів на обрання до складу Громадської ради<br />
      {radaTitle}<br />
      у {year} році
      </h2>
      <div><p>Усього прийняло участь: <span id="voters-count">{votersCount}</span></p></div>
      <div><p>Кількість місць: {members}</p></div>
      <div><p>Кількість кандидатів: <span id="candidates-count">{candidatesCount}</span></p></div>
      <TableChart meta={this.state.meta} data={this.state.data} />
    </>);
  }
}

class IndexRoute extends PureComponent {
  componentDidMount() {
    fetch('/data/metadata.json').then(data => data.json()).then(metadata => {
      this.setState({ metadata })
    });
  }

  render() {
    if(!this.state || !this.state.metadata) return null;
    return <>
      <ul>
        {
          Object.keys(this.state.metadata).map((voteName) => {
            const { orgId, year, radaTitle } = this.state.metadata[voteName];
            return <li><Link to={`${orgId}/${year}`}>{radaTitle} ({year})</Link></li>;
          })
        }
      </ul>
    </>;
  }
}

class Header extends PureComponent {
  render() {
    return <><h1>Громадські ради</h1></>
  }
}

class App extends PureComponent {

  render() {
    return (<Router>
      <>
        <Header />
        <Route path="/" exact component={IndexRoute} />
        <Route path="/:orgId/:year" component={ResultsRoute} />
      </>
    </Router>);
  }
}
export default App;
