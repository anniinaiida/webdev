import React, {useState, useEffect} from 'react';
import {Link, NavLink, Switch, Route, BrowserRouter as Router, useHistory, withRouter, Redirect, useLocation} from 'react-router-dom'
import './Link.css';

export default class BasicApp extends React.Component 
{
    constructor(props)
    {
        super(props);

        this.state = {
            user : null
        }
    }

    loginDone(loggedUser)
    {
        this.setState({user : loggedUser});
    }

    render()
    {
        let x = "";
        if (this.state.user !== null) x = "Käyttäjä on " + this.state.user;

        return(
            <Router>
                <p></p>
                {
                    // importtina .css ja se linkitettynä classNamella linkkeihin
                }
                <NavLink className="Link" to="/">Home </NavLink>
                <Link className="Link" to="/cars">Cars </Link>
                <Link className="Link" to="/customers">Customers </Link>                

                <p>{x}</p>

                <Switch>                    
                    <Route exact path="/" render={(p) => <Home {...p} />}/>                    
                    
                    <Route path="/cars">
                    {   this.state.user ?
                        <Cars /> : <LoginComponent onLogin={(user) => this.loginDone(user)}/>
                    }
                    </Route>
                    <Route path="/customers" render={(p) => <Customers {...p} />}/>
                    
                    <Route path="*" render={(p) => <My404Component {...p} />}/>
                </Switch>

            </Router>
        )
    }
}

const Login = (props) => {

    // luodaan function sisäiset muuttujat ja alustetaan tyhjiksi
    const [_user, set_User] = useState("");
    const [ID, setID] = useState("");

    let h = useHistory();

    const onClick = (event) =>
    {
        // testataan, että nimi ja id on syötetty
        if (_user !== "" && ID !== "")
        {
            // viedään käyttäjän tiedot pääkomponenttiin
            props.onLogin(_user);
            // automaattisesti avataan /cars sivu näkyviin
            h.push("/cars");
        }
    }

    console.log("Login:", props);

    // täällä kysytään tiedot ja inputeissa tallennetaan suoraan
    // onChance eventillä funktion muuttujiin syötetty data
    return (
        <div>
            <p>Kirjaudu sisään</p>

            Nimi <input type="text" value={_user} onChange={(event) => set_User(event.target.value)}/>
            ID <input type="text" value={ID}onChange={(event) => setID(event.target.value)}/>
            <p><button onClick={(e) => onClick(e)}>Kirjaudu</button></p>
        </div>
    );
}

// määritellään mitä näkyy Home -kohdassa (kutsutaan myös Time-komponenttia)
function Home(props)
{
    let location = useLocation();

    console.log("HOME l:", location);
    // KÃ¤ytettÃ¤vissÃ¤ myÃ¶s props koska render-metodissa passataan props myÃ¶s tÃ¤nne
    console.log("HOME p:", props);

    return <div>
        <h4>Savonia AMK</h4>
        <p>Käyntiosoite: Microkatu 1, 70210 KUOPIO</p>
        <p>savonia@savonia.fi</p>

        <div>Nyt on <Time/></div>

        <p>This is Home (reitti oli {location.pathname}) </p>
        </div>
}

const Customers = props => {

    // MyÃ¶s tÃ¤Ã¤llÃ¤ on props kÃ¤ytÃ¶ssÃ¤, ks. render() Router:ssa
    console.log("Customers:", props);

    return <div><p>This is site</p></div>
}

// funktio car joka näyttää yhden auton tiedot
const Car = () => {
    const [car, setCar] = useState([]);
    const [x, setX] = useState("");

    useEffect(() => {
        async function fetchCar()
        {
            let response = await fetch("http://localhost:3002/autot/1");
            let data = await response.json();
            setCar(data);
        }

        if (x !== "")
        fetchCar();
    }, [x],)

    return(
        <div>
            <button onClick={() => setX("x")}>Hae yksi auto</button>
            {car.Merkki} {car.Malli}
        </div>
    )

}

// Autot class komponentti, jossa näytetään kaikkien autojen tiedot
// tässä kutsutaan myös car funktiota, joka näyttää yhden auton tiedot
class Cars extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cars : []
        }
    }
    async fetchCars()
    {  
        try
        {            
            // haetaan tietokannasta tiedot hakulausekkeella
            let response = await fetch(
                "http://localhost:3002/autot",
                {
                    method : "GET",
                    headers : {"Content-type" : "application/json"}
                }
            );
            // tulostetaan response sellaisenaan konsoliin
            console.log("response", response);
            // muutetaan response JSON muotoon
            let data = await response.json();
            // asetetaan data customer stateen
            this.setState({cars : data});            
        }
        // otetaan kiinni virhetilanteet, ohjelma ei kaadu
        catch(e)
        {
            console.log("Virhe:", e);
        }
    }

    render()
    {
        const car = this.state.cars.map((c) => <p key={c.id}>{c.Merkki} {c.Malli}</p>)

        return (
            <div>
                <button onClick={() => this.fetchCars()}>Hae kaikki autot</button>
                {car}
                <Car/>
            </div>
        )
    }
}



// Aika-komponentti
const Time = () =>
{
    let today = new Date(),
        date = today.getDay();

    switch (date) {
        case 1:
            date = "Maanantai";
            break;
        case 2:
            date = "Tiistai";
            break;
        case 3:
            date = "Keksiviikko";
            break;
        case 4:
            date = "Torstai";
            break;
        case 5:
            date = "Perjantai";
            break;
        case 6:
            date = "Lauantai";
            break;
        case 7:
            date = "Sunnuntai";
            break;
        default:
    }

    // hakee oikean kellonajan
    let noon = new Date().getHours();

    if (noon < 14 && noon >= 6)
    noon = "aamupäivä";
    else
    noon = "iltapäivä";
    console.log("ilta vai aamu: ", noon);

    return <div>{date} {noon}</div>
}

const My404Component = (props) => {
    let location = useLocation();

    return(
        <div>
            <h3>Yritit navigoida väärälle sivulle: {location.pathname}</h3>

            <a href="/">Takaisin kotisivulle</a>
        </div>

    )
    
}