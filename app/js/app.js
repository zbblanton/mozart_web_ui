class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {page: "CreateContainersPage"};
    this.handleShowPage = this.handleShowPage.bind(this);
  }

  componentDidMount() {

  }

  handleShowPage(page) {
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
      case "CreateAccountsPage":
        return (
          <CreateAccountsPageComponent />
        );
        break;
      case "ListContainersPage":
        return (
          <ListContainersPageComponent />
        );
        break;
      case "CreateContainersPage":
        return (
          <CreateContainersPageComponent />
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
          <a className="navbar-item" onClick={() => this.props.handleShowPage("CreateContainersPage")}>
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
          <a className="navbar-item" onClick={() => this.props.handleShowPage("CreateAccountsPage")}>
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

class CreateAccountsPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {accounts: []};
  }

  render() {
    return (
      <div>
      <section className="hero is-info">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Create Account
            </h1>
          </div>
        </div>
      </section>
      <br />
      <div className="container">
        <MessageComponent />
        <article className="message is-warning">
          <div className="message-body">
            Currently only service accounts are supported.
          </div>
        </article>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input className="input" type="text" placeholder="" />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input className="input" type="password" placeholder="" disabled />
          </div>
        </div>
        <div className="field">
          <label className="label">Confirm Password</label>
          <div className="control">
            <input className="input" type="password" placeholder="" disabled />
          </div>
        </div>
        <div className="field">
          <label className="label">Description</label>
          <div className="control">
            <input className="input" type="text" placeholder="" />
          </div>
        </div>
        <div className="field has-addons has-addons-right">
          <div className="select">
            <select disabled>
              <option>Service Account</option>
              <option>User Account</option>
            </select>
          </div>
        </div>
        <div className="field has-addons has-addons-right">
          <div className="control">
            <button className="button is-link">Submit</button>
          </div>
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

class CreateContainersEnvListItemComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="column is-one-quarter">
        <div className="card">
          <div className="card-content">
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                <input className="input" type="text" placeholder="" />
              </div>
            </div>
            <div className="field">
              <label className="label">Value</label>
              <div className="control">
                <input className="input" type="text" placeholder="" />
              </div>
            </div>
            <div className="field has-addons has-addons-right">
              <a className="button is-danger" disabled>Remove</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CreateContainersEnvListComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.envs.map(function (i) {
        return (
          <CreateContainersEnvListItemComponent key={i} item={i} />
        );
      })
    );
  }
}

class CreateContainersMountsListItemComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="column is-half">
        <div className="card">
          <div className="card-content">
            <div className="field">
              <label className="label">Source</label>
              <div className="control">
                <input className="input" type="text" placeholder="" />
              </div>
            </div>
            <div className="field">
              <label className="label">Target</label>
              <div className="control">
                <input className="input" type="text" placeholder="" />
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <label className="label">Type</label>
                <div className="select">
                  <select>
                    <option>Bind Mount</option>
                    <option>Volume</option>
                  </select>
                </div>
              </div>
              <div className="control">
                <label className="label">Readonly</label>
                <div className="select">
                  <select>
                    <option>False</option>
                    <option>True</option>
                  </select>
                </div>
              </div>
              <div className="control">
                <label className="label">Actions</label>
                <a className="button is-danger" disabled>Remove</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CreateContainersMountsListComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.mounts.map(function (i) {
        return (
          <CreateContainersMountsListItemComponent key={i} />
        );
      })
    );
  }
}

class CreateContainersPortsListItemComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="column is-one-quarter">
        <div className="card">
          <div className="card-content">
            <div className="field">
              <label className="label">Container Port</label>
              <div className="control">
                <input className="input" type="text" placeholder="" />
              </div>
            </div>
            <div className="field">
              <label className="label">Host Port</label>
              <div className="control">
                <input className="input" type="text" placeholder="" />
              </div>
            </div>
            <div className="field">
              <label className="label">Host IP</label>
              <div className="control">
                <input className="input" type="text" placeholder="Optional" />
              </div>
            </div>
            <div className="field has-addons has-addons-right">
              <a className="button is-danger" disabled>Remove</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CreateContainersPortsListComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.ports.map(function (i) {
        return (
          <CreateContainersPortsListItemComponent key={i} />
        );
      })
    );
  }
}

class MessageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {type: "", message: ""}
  }

  render() {
    if(this.props.message != undefined){
      var type = this.props.type
      if(type == undefined){
        type = "is-warning"
      }
      return (
        <article className="message ${this.type}">
          <div className="message-body">
            {this.props.message}
          </div>
        </article>
      );
    }
    else {
      return (
        <div></div>
      );
    }
  }
}

class CreateContainersPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {Name: "", Image: "", envs: [], mounts: [], ports: [], AutoRemove: true, Privileged: false};
    this.handleEnvAdd = this.handleEnvAdd.bind(this);
    this.handleMountAdd = this.handleMountAdd.bind(this);
    this.handlePortAdd = this.handlePortAdd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEnvAdd() {
    this.state.envs.push(this.state.envs.length);
    this.setState(this.state)
  }

  handleMountAdd() {
    this.state.mounts.push(this.state.mounts.length);
    this.setState(this.state)
  }

  handlePortAdd() {
    this.state.ports.push(this.state.ports.length);
    this.setState(this.state)
  }

  handleSubmit(e) {
    e.preventDefault();

    var form = document.getElementById("form")
    var Name = document.getElementById("Name").value
    var Image = document.getElementById("Image").value

    var Envs = document.getElementsByClassName("envs")
    for(var i = 0; i < Envs.length; i++){
      var envKey = Envs[i].getElementsByClassName("envKey")[0].value;
      var envValue = Envs[i].getElementsByClassName("envValue")[0].value;
    }

    this.sendData(JSON.stringify({"Name": Name, "Image": Image, "AutoRemove": true, "Privileged": false}))
  }

  verifySubmit() {

  }

  sendData(postData) {
    fetch('api/containers/create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: postData
    }).then(res=>res.json())
      .then(res => {
      console.log(res)
    });
  }


  render() {
    return (
      <form id="form" onSubmit={this.handleSubmit}>
      <section className="hero is-info">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Create Container
            </h1>
          </div>
        </div>
      </section>
      <br />
      <div className="container">
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input required id="Name" className="input" type="text" placeholder="" />
          </div>
        </div>
        <div className="field">
          <label className="label">Image</label>
          <div className="control">
            <input required id="Image" className="input" type="text" placeholder="" />
          </div>
        </div>
        <div className="field">
          <label className="label">Environment Variables</label>
          <div className="control">
            <div className="container">
              <div className="columns is-multiline is-mobile">
                <CreateContainersEnvListComponent envs={this.state.envs} />
              </div>
            </div>
          </div>
          <br />
          <div className="control">
            <a className="button" onClick={this.handleEnvAdd}>Add Environment Variable</a>
          </div>
        </div>
        <div className="field">
          <label className="label">Expose Ports</label>
          <div className="control">
            <div className="container">
              <div className="columns is-multiline is-mobile">
                <CreateContainersPortsListComponent ports={this.state.ports} />
              </div>
            </div>
          </div>
          <br />
          <div className="control">
            <a className="button" onClick={this.handlePortAdd}>Add Port</a>
          </div>
        </div>
        <div className="field">
          <label className="label">Mounts</label>
          <div className="control">
            <div className="container">
              <div className="columns is-multiline is-mobile">
                <CreateContainersMountsListComponent mounts={this.state.mounts} />
              </div>
            </div>
          </div>
          <br />
          <div className="control">
            <a className="button" onClick={this.handleMountAdd}>Add Mount</a>
          </div>
        </div>
        <div className="field">
          <label className="label">Auto Remove</label>
          <div className="select">
            <select>
              <option>True</option>
              <option>False</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label className="label">Privileged</label>
          <div className="select">
            <select>
              <option>False</option>
              <option>True</option>
            </select>
          </div>
        </div>
        <div className="field has-addons has-addons-right">
          <div className="control">
            <input type="submit" value="Submit" className="button is-primary" />
          </div>
        </div>
      </div>
      </form>
    );
  }
}

ReactDOM.render(<AppComponent />, document.getElementById('App'));
