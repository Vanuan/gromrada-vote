import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import { fetchVotes } from './fetchVotes';
import { TableChart, visualize } from './TableChart';
import './App.css';

class ResultsRoute extends PureComponent {
  componentDidMount() {
    const { orgId, year } = this.props.match.params;
    fetch('/data/metadata.json').then(data => data.json()).then(metadata => {
      const meta = metadata[`${orgId}-${year}`];
      this.setState({ meta })
      fetchVotes(meta).then(data => visualize(data, meta)); 
    });
  }

  render() {
    if (!this.state || !this.state.meta) return null;
    const { radaTitle, members, year } = this.state.meta;
    return (<>
      <Link to='/'>Інші голосування</Link>
      <h1>Результати рейтингового інтернет-голосування</h1>
      <h2>За кандидатів на обрання до складу Громадської ради<br />
      {radaTitle}<br />
      у {year} році
      </h2>
      <div><p>Усього прийняло участь: <span id="voters-count"></span></p></div>
      <div><p>Кількість місць: {members}</p></div>
      <div><p>Кількість кандидатів: <span id="candidates-count"></span></p></div>
      <TableChart />
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
