import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
  };


  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    

    this.setState({ manager, players , balance});
}

onSubmit = async event => {
  event.preventDefault();

  const accounts = await web3.eth.getAccounts();

  this.setState({ message: 'Waiting on transaction success...' });

  await lottery.methods.enter().send({
    from: accounts[0],
    value: web3.utils.toWei(this.state.value, 'ether')
  });

  this.setState({ message: 'You have been entered!' });
};


onClick = async () => {
  const accounts = await web3.eth.getAccounts();

  this.setState({ message: 'Waiting on transaction success...' });

  await lottery.methods.pickWinner().send({
    from: accounts[0]
  });

  this.setState({ message: 'A winner has been picked!' });
};


  render() {
    //console.log(web3.version); //getting the version of web3
    //web3.eth.getAccounts().then(console.log);  //getting the account address 
    return (
      <div>
        
        
        <h1><center>Lottery Contract</center></h1>
        <center><p>
          This contract is managed by {this.state.manager}. There are currently{' '}
          {this.state.players.length} people entered, competing to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p></center>

        <hr />
        
        <form onSubmit={this.onSubmit}>
          <h3><center>Want to try your luck?</center></h3>
          
          <div>
            <label><center>Amount of ether to enter</center></label>
            <center><input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            /></center>
          </div>


          <br />
          
          <center><button><b>Enter</b></button></center>
        </form>

        <hr />

        <h3><center>Ready to pick a winner?</center></h3>
        <center><b><button onClick={this.onClick}>Pick a winner!</button></b></center>


        <hr />


        <h1><center>{this.state.message}</center></h1>

      </div>
    );
  }
}

export default App;
