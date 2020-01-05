import React from 'react';

export default class CustomerApp extends React.Component 
{
    constructor(props)
    {
        super(props);

        this.state = {
            customer : [],
            customertypes: [],
            customertype : '',
            customername : '',
            address : '',
            loading: false,
            addNew: false
        }
    }

    componentDidMount()
    {
        console.log("componentDidMount");
        this.fetchTypes();
        this.fetchData();
    }

    async fetchTypes()
    {
        try{
            let response = await fetch("http://localhost:3002/asiakastyyppi")
            console.log("response:", response);
            let data = await response.json();
            this.setState({customertypes : data});
        }
        catch(e)
        {
            console.log("Virhe:", e);
        }
    }

    // muutetaan state muuttujia, inputtien name ja address muuttuessa
    inputChanged(event)
    {
        this.setState({[event.target.name] : event.target.value});
    }

    async fetchData()
    {  
        // asetetaan loading trueksi
        this.setState({loading: true}); 

        // asetetaan pohja URI, jolla etsitään kaikki asiakkaat jos ei ole hakuehtoja
        let URI = "http://localhost:3002/asiakas?";

            // testaan onko nimiehto asetettu ja lisätään hakuehto hakulausekkeeseen
            if (this.state.customername !== "") {
                URI = URI + "Nimi=" + this.state.customername;
            }

            // testataan onko kumpikin ehto asetettu, jolloin väliin tuleek & -merkki
            if (this.state.customername !== "" && this.state.address !== "") {
                URI = URI + "&";
            }
            // testaan onko osoite-ehto asetettu ja lisätään hakuehto hakulausekkeeseen
            if (this.state.address !== "") {
                URI = URI + "Osoite=" + this.state.address;
            }
            if ((this.state.nimi !== "" || this.state.address !== "") && this.state.customertype !== "") {
                URI = URI + "&";
            }
            if (this.state.customertype !== "") {
                URI = URI + "Tyyppi_id=" + this.state.customertype;
            }

            //testataan tulostuksella millainen URI on asetettu
            console.log("URI", URI);
        try{            
            // haetaan tietokannasta tiedot hakulausekkeella
            let response = await fetch(
                URI,
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
            this.setState({customer : data, loading: false});            
        }
        // otetaan kiinni virhetilanteet, ohjelma ei kaadu
        catch(e)
        {
            console.log("Virhe:", e);
        }
    }

    async deleteData()
    {      
        const ID = this.state.customer.map((c) => <p key={c.id}>{c.id}</p>)
        console.log("ID: ", ID[0].key)
        try{            
            let response = await fetch(
                "http://localhost:3002/asiakas/" + ID[0].key,
                {
                    method : "DELETE",
                    headers : {"Content-type" : "application/json"},
                }
                
            );
            console.log("Response", response);
            console.log("Poisto onnistui");
            this.fetchData();
        }
        // otetaan kiinni virhetilanteet, ohjelma ei kaadu
        catch(e)
        {
            console.log("Virhe:", e);
        }
    }

    // tässä asetetaan formi näkyviin "Lisää uusi" buttonin painalluksen jälkeen
    addNew()
    {
        this.setState({addNew: true});
    }

    render()
    {

            // const types = this.state.customertypes.map((c) => <p key={c.id}>{c.types}</p>)
            // console.log("TYPES: ", types[0]);
        return (
            <div>
                 Nimi <input type="text" name="customername" value={this.state.customername} onChange={(e) => this.inputChanged(e)}/>
                 Osoite <input type="text" name="address" value={this.state.address} onChange={(e) => this.inputChanged(e)}/>
                 Asiakkuus <select name="customertype" value={this.state.customertype} onChange={(e) => this.inputChanged(e)}>
                  <option value="">Valitse</option>
                  <option value="1">Yritysasiakas</option>
                  <option value="2">Kuluttaja-asiakas</option>
               </select>
                <button onClick={() => this.fetchData()}>Hae</button>
                <button onClick={() => this.addNew()}>Lisää uusi</button>

                <br/>
                <br/>
                
                <CustomerInfo loading = {this.state.loading} customer = {this.state.customer} delete={(x) => this.deleteData(x)}/>

                <br/>
                <br/>
                <CustomerForm addNew = {this.state.addNew} refresh={(x) => this.fetchData(x)} cancel={(x) => this.fetchData(x)}/>
            </div>
        )
    }
}

// tässä luodaan formi ja otetaan ylös inputit ja lisätään niillä addNewCustomer metodissa uusi asiakas
class CustomerForm extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            nimi : "",
            osoite : "",
            postinumero : "",
            postitoimipaikka : "",
            puhelinnumero : "",
            tyyppi_id : "",
            tyyppi_selite : "",
        }
    }
    // muutetaan state muuttujia, inputtien name ja address muuttuessa
    inputChanged(event)
    {
        this.setState({[event.target.name] : event.target.value});
    }

    
    // lisätään asiakas POST metodilla, bodyssa käytetään syötettyjä arvoja
    async addNewCustomer()
    {    
        try{            
            return await fetch(
                "http://localhost:3002/asiakas/",
                {
                    method : "POST",
                    headers : {"Content-Type" : "application/json"},
                    body: JSON.stringify({
                        Nimi : this.state.nimi
                        , Osoite : this.state.osoite
                        , Postinumero : this.state.postinumero 
                        , Postitoimipaikka : this.state.postitoimipaikka 
                        , Puhelinnumero : this.state.puhelinnumero 
                        , Tyyppi_id : this.state.tyyppi_id 
                        , Tyyppi_selite : this.state.tyyppi_selite
                    })
                }
            );
        }
        // otetaan kiinni virhetilanteet, ohjelma ei kaadu
        catch(e)
        {
            console.log("Virhe:", e);
        }
    }

    // luodaan formi ja kutsutaan buttoneilla metodeja
    render()
    {
        let displayValue = this.state.showStore ? 'block' : 'none' ;
        if (this.props.addNew === true) {
            displayValue = "";
        }
        return(
            <div>
                <form style={{display: displayValue}} onSubmit={() => {this.addNewCustomer(); this.props.refresh()}}>
                    <label>                        
                        Nimi 
                        <input type="text" name="nimi" value={this.state.nimi} onChange={(event) => this.inputChanged(event)} /><br/>
                        Osoite
                        <input type="text" name="osoite" value={this.state.osoite} onChange={(event) => this.inputChanged(event)} /><br/>
                        Postinumero
                        <input type="number" name="postinumero" value={this.state.postinumero} onChange={(event) => this.inputChanged(event)} /><br/>
                        Postitoimipaikka
                        <input type="text" name="postitoimipaikka" value={this.state.postitoimipaikka} onChange={(event) => this.inputChanged(event)} /><br/>
                        Puhelinnumero
                        <input type="text" name="puhelinnumero" value={this.state.puhelinnumero} onChange={(event) => this.inputChanged(event)} /><br/>
                        Tyyppi_id
                        <input type="number" name="tyyppi_id" value={this.state.tyyppi_id} onChange={(event) => this.inputChanged(event)} /><br/>
                        Tyyppi_selite
                        <input type="text" name="tyyppi_selite" value={this.state.tyyppi_selite} onChange={(event) => this.inputChanged(event)} /><br/>
                    </label>
                    <button onClick={() => this.props.cancel()}>Peruuta</button>
                    <button type = "Submit">Tallenna</button>
                </form>
            </div>
        )
    }
}

// renderöinti tablessa
const CustomerInfo = (props)=> {
    const data = props.customer;
    let content;

    // tässä testataan onko loading true, tehtävä 79
    if (props.loading) {
        content = <div>Loading...</div>
    // jos loading ei ole true niin hypätään tänne ja renderoidaan taulukko
    } else {
        let x = null;
        // testataan ensin onko taulukkoon tulossa dataa, jos ei niin laitetaan tekstiä
        if (data.length === 0) x = <p>Et ole hakenut vielä tai annetuilla hakuehdoilla ei löytynyt dataa</p>
    
        // haetaan mapin avulla tiedot asiakkaista
        const tb = data.map((item, index) => {
            return <tr key={index} style={{borderStyle : ""}}>
                        <td>{item.Nimi}</td>
                        <td>{item.Osoite}</td>
                        <td>{item.Postinumero}</td>
                        <td>{item.Postitoimipaikka}</td>
                        <td>{item.Puhelinnumero}</td>
                        <td>{item.Tyyppi_id}</td>
                        <td>{item.Tyyppi_selite}</td>
                        <td><button onClick={() => props.delete()}>Poista</button></td>
                    </tr>
        })
        // muotoillaan taulukko
        content =   <div>
                    {x}
                        <table style={{borderStyle : ""}}>
                            <tbody>
                                {tb}
                            </tbody>
                        </table>
                    </div>
    }

    return (
        <div>
            {content}
        </div>
    )
}