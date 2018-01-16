const e = React.createElement;
const states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];


class CreateForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      phone_number: '',
      city: '',
      state: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit (e) {
    e.preventDefault()
    const params = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)
    }
    const endpoint = (this.props.company_type === 'brand') ? 'brands' : 'factories'
    fetch('/' + endpoint, params)
      .then(res => res.json())
      .then(json => {
        this.setState({
          name: '',
          email: '',
          phone_number: '',
          city: '',
          state: ''
        })
        const key = (endpoint === 'brands') ? 'addedBrand' : 'addedFactory'
        this.props.addCompany(json, key)
        console.log(json)
      })
  }

  render() {
    const stateOptions = states.map(s => e('option', {key: s, value: s}, s));
    return(
      e('form', {className: 'create-form', onSubmit: this.handleSubmit},
        e('h5', null, 'Add ' + this.props.company_type),
        e('input', {name: 'name', value: this.state.name, placeholder: 'Name', onChange: this.handleChange}),
        e('input', {name: 'email', value: this.state.email, placeholder: 'e-mail', onChange: this.handleChange}),
        e('input', {name: 'phone_number', value: this.state.phone_number, placeholder: 'phone_number', onChange: this.handleChange}),
        e('input', {name: 'city', value: this.state.city, placeholder: 'City', onChange: this.handleChange}),
        e('select', {name: 'state', value: this.state.state, placeholder: 'Select State', onChange: this.handleChange},
          stateOptions
          ),
        e('input', {type: 'submit'})
      )
    )

  }
}

class CompanyList extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      companies: [],
      currentSelection: '',
      currentCompany: null
    }
    this.endpoint = (this.props.company_type === 'brand') ? 'brands' : 'factories'
    this.componentDidMount = this.componentDidMount.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.closeInfo = this.closeInfo.bind(this)
    this.deleteCompany = this.deleteCompany.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.addedCompany){
      this.setState({companies: [...this.state.companies, nextProps.addedCompany]})
    } else {
      return null
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    fetch('/' + this.endpoint + '/' + value)
      .then(res => res.json())
      .then(json => {
        console.log(json)
        this.setState({
          currentCompany: json
        })
      })
  }

  componentDidMount() {
    fetch('/' + this.endpoint)
      .then(res => res.json())
      .then(json => {
        const companies = json.map(c => ({id: c.id, name: c.name}) );
        this.setState({ companies })
      })
  }

  deleteCompany() {
    const params = {
      method: 'DELETE'
    }
    const { id } = this.state.currentCompany
    fetch('/' + this.endpoint + '/' + id, params)
      .then(res => res.json())
      .then(json => {
        console.log(json)
        const nextCompanies = this.state.companies.filter(c => c.id !== id)
        this.setState({ currentCompany: null, companies: nextCompanies})
      })

  }

  closeInfo() {
    this.setState({
      currentCompany: null
    })
  }

  render() {
    const { companies, currentCompany } = this.state;
    const compOptions = companies.map(c => e('option', {key: c.id, value: c.id}, c.name))
    const companyDiv = currentCompany ? e('div', {className: 'company-div'}, e('p', null, this.props.company_type + ' name: ' + currentCompany.name),
                                                        e('p', null, 'Phone: ' + currentCompany.phone_number),
                                                        e('p', null, 'Email: ' + currentCompany.email),
                                                        e('p', null, 'Location: ' + currentCompany.city + ', ' + currentCompany.state),
                                                        e('button', {onClick: this.closeInfo}, 'Close'),
                                                        e('button', {onClick: this.deleteCompany}, 'DELETE COMPANY')
                                                      ) : null
    return (
        e('div', {className: 'company-list'}, e('p', null, 'See ' + this.endpoint),
                      e('select', {name: 'currentSelection', value: this.state.value, onChange: this.handleChange}, compOptions),
                      companyDiv
        )
    )
  }
}

class SearchCompanies extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: '',
      found: null,
    }
    this.endpoint = (this.props.company_type === 'brand') ? 'brands' : 'factories'
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.closeInfo = this.closeInfo.bind(this)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    fetch('/' + this.endpoint + '/search?q=' + this.state.searchTerm)
      .then(res => {
        if(res.status == 404){
          throw new Error(res.statusText);
          return;
        } else {
          return res.json()
        }
        })
        .catch(error => alert(error))
      .then(json => {
        this.setState({found: json, searchTerm: ''})
      })
  }

  closeInfo() {
    this.setState({
      found: null
    })
  }

  render() {
    const { found, searchTerm } = this.state
    const companyDiv = found ? e('div', {className: 'company-div'},
                                  e('p', null, this.props.company_type + ' name: ' + found.name),
                                  e('p', null, 'Phone: ' + found.phone_number),
                                  e('p', null, 'Email: ' + found.email),
                                  e('p', null, 'Location: ' + found.city + ', ' + found.state),
                                  e('button', {onClick: this.closeInfo}, 'Close')
                                  ) : null
    return(
      e('div', null, e('form', {onSubmit: this.handleSubmit, className: 'search-field'},
                        e('input', {name: 'searchTerm', value: this.state.searchTerm, placeholder: 'Search '+ this.endpoint, onChange: this.handleChange}),
                        e('input', {type: 'submit'})
        ),
        companyDiv
      )

    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addedBrand: null,
      addedFactory: null
    }
    this.addCompany = this.addCompany.bind(this)
  }

  addCompany(company, key) {
    this.setState({
      [key]: company
    })
  }

  render () {
    return (
      e('div', {className: 'container'},
        e('div', null, e('h2', null, 'Brands'),
                        e(SearchCompanies, {company_type: 'brand'}),
                        e(CompanyList, {company_type: 'brand', addedCompany: this.state.addedBrand})
          ),
        e(CreateForm, {company_type: 'brand', addCompany: this.addCompany}),
        e('div', null, e('h2', null, 'Factories'),
                        e(SearchCompanies, {company_type: 'factory'}),
                        e(CompanyList, {company_type: 'factory', addedCompany: this.state.addedFactory})
        ),
        e(CreateForm, {company_type: 'factory', addCompany: this.addCompany})
      )
    )
  }
}

window.onload = function() {
  ReactDOM.render(
                    e(App, null),
                    document.getElementById('root')
                );
};
