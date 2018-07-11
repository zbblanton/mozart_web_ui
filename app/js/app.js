class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {page: "ListContainersPage"};
    this.handleShowPage = this.handleShowPage.bind(this);
  }

  componentDidMount() {

  }

  handleShowPage(page) {
    console.log("test: " + page)
    this.state.page = page
    this.setState(this.state)
  }

  render() {
    return (
      <div>
        <TopMenuComponent handleShowPage={this.handleShowPage}/>
        <PageComponent page={this.state.page}/>
      </div>
    );
  }
}

class PageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    switch(this.props.page) {
      case "HomePage":
        return (
          <HomePageComponent />
        );
        break;ListContainersPageComponent
      case "ListAccountsPage":
        return (
          <ListAccountsPageComponent />
        );
        break;
      case "ListContainersPage":
        return (
          <ListContainersPageComponent />
        );
        break;
      case "TestPage":
        return (
          <TestPageComponent />
        );
        break;
      default:
        return (
          <HomePageComponent />
        );
    }
  }
}

class TopMenuComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar is-light" role="navigation" aria-label="dropdown navigation">
      <a className="navbar-item">
        Mozart
      </a>

      <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link">
          Workers
        </a>
        <div className="navbar-dropdown">
          <a className="navbar-item" onClick={() => this.props.handleShowPage("TestPage")}>
            List
          </a>
        </div>
      </div>
      <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link">
          Containers
        </a>
        <div className="navbar-dropdown">
          <a className="navbar-item">
            Create
          </a>
          <a className="navbar-item" onClick={() => this.props.handleShowPage("ListContainersPage")}>
            List
          </a>
        </div>
      </div>
      <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link">
          Accounts
        </a>
        <div className="navbar-dropdown">
          <a className="navbar-item">
            Create
          </a>
          <a className="navbar-item" onClick={() => this.props.handleShowPage("ListAccountsPage")}>
            List
          </a>
        </div>
      </div>
      </nav>
    );
  }
}

class HomePageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">
          Hello World
        </h1>
        <p className="subtitle">
          My first website with <strong>Bulma</strong>!
        </p>
      </div>
    );
  }
}

class TestPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">
          TEST PAGE Hello World
        </h1>
        <p className="subtitle">
          My first website with <strong>Bulma</strong>!
        </p>
      </div>
    );
  }
}

class ListAccountsListItemComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="column is-one-quarter">
      <div className="card">
        <div className="card-content">
          <p className="title">
            {this.props.account["Name"]}
          </p>
          <p className="subtitle">
            {this.props.account["Type"]}
          </p>
        </div>
        <footer className="card-footer">
          <a href="#" className="card-footer-item">Revoke</a>
          <a href="#" className="card-footer-item">Delete</a>
        </footer>
      </div>
      </div>
    );
  }
}

class ListAccountsListComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.accounts.map(function (i) {
        return (
          <ListAccountsListItemComponent key={i["Name"]} account={i}/>
        );
      })
    );
  }
}

class ListAccountsPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {accounts: []};
  }

  getAccounts() {
    fetch('api/accounts/list', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res=>res.json())
      .then(res => {
        //So the json parser has a hard time with object json instead of an array
        //Which means we must do a double loop through the Accounts. The inner one
        //is to grab each key and value and save it, then the outer loop places each
        //account into an array instead of a map.
        var accountsArray = []
        Object.keys(res.Accounts).forEach(function(key) {
            var accountMap = new Map()
            Object.keys(res.Accounts[key]).forEach(function(key2) {
                accountMap[key2] = res.Accounts[key][key2]
            });
            accountsArray.push(accountMap)
        });
        this.state.accounts = accountsArray
        this.setState(this.state)
    });
  }

  componentDidMount() {
    this.getAccounts()
  }

  render() {
    return (
      <div>
      <section className="hero is-info">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Accounts
            </h1>
          </div>
        </div>
      </section>
      <br />
      <div className="container">
        <div className="columns is-multiline is-mobile">
        <ListAccountsListComponent accounts={this.state.accounts}/>
        </div>
      </div>
      </div>
    );
  }
}

class ListContainersListComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.containers)
    if(this.props.containers.length > 0){
      return (
        this.props.containers.map(function (container) {
          return (
            <div className="column is-one-quarter" key={container["Name"]}>
            <div className="card">
              <div className="card-content">
                <p className="title">
                  {container["Name"]}
                </p>
                {container["Worker"] == "" ? (
                  <p className="subtitle">No Worker</p>
                ) : (
                  <p className="subtitle">{container["Worker"]}</p>
                )}
              </div>
              <footer className="card-footer">
                <a href="#" className="card-footer-item">View</a>
                <a href="#" className="card-footer-item">Delete</a>
              </footer>
            </div>
            </div>
          );
        })
      );
    }
    else {
      return(<p>No containers.</p>);
    }

  }
}

class ListContainersPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {containers: []};
  }

  getAccounts() {
    fetch('api/containers/list', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res=>res.json())
      .then(res => {
        //So the json parser has a hard time with object json instead of an array
        //Which means we must do a double loop through the Accounts. The inner one
        //is to grab each key and value and save it, then the outer loop places each
        //account into an array instead of a map.
        var containersArray = []
        Object.keys(res.Containers).forEach(function(key) {
            var containerMap = new Map()
            Object.keys(res.Containers[key]).forEach(function(key2) {
                containerMap[key2] = res.Containers[key][key2]
            });
            containersArray.push(containerMap)
        });
        this.state.containers = containersArray
        this.setState(this.state)
    });
  }

  componentDidMount() {
    this.getAccounts()
  }

  render() {
    return (
      <div>
      <section className="hero is-info">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Containers
            </h1>
          </div>
        </div>
      </section>
      <br />
      <div className="container">
        <div className="columns is-multiline is-mobile">
        <ListContainersListComponent containers={this.state.containers}/>
        </div>
      </div>
      </div>
    );
  }
}

ReactDOM.render(<AppComponent />, document.getElementById('App'));
