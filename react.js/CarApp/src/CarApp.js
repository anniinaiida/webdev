import React from 'react';

class CarApp extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            
            name : ""
            , address : ""
            , bYear : ""
            , people : [
  
            ]
        }
    }

    onNameChanged(event)
    {
        this.setState({ name : event.target.value});
    }

    onAddressChanged(event)
    {
        this.setState({ address : event.target.value});
    }

    onbYearChanged(event)
    {
        this.setState({ bYear : event.target.value});
    }

    onAddClicked()
    {     
        const t = [...this.state.people, this.state.name + ", " + this.state.address + ", " + this.state.bYear];
        this.setState({people : t});

        console.log(...t);
    }

    clearInput()
    {
        this.setState({name : "", address : "", bYear : ""});
    }  

    render()
    {
        const t = this.state.people.map(s => (<li>{s}</li>));
        return (
            <div>
                <form>
                    <label>
                        Nimi <input type="text" value={this.state.name} onChange={(e) => this.onNameChanged(e)} />
                         Osoite <input type="text" value={this.state.address} onChange={(e) => this.onAddressChanged(e)}/>
                         Syntymävuosi <input type="text" value={this.state.bYear} onChange={(e) => this.onbYearChanged(e)}/>

                    </label>
                </form>
                <button onClick={() => {this.onAddClicked(); this.clearInput()}}>Save</button>
                <ul>{t}</ul>
            </div>
        )
    }
}

export default CarApp;