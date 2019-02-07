import React, { Component } from 'react';
import './App.css';
import Interpreter, { ExpressionsInterpreter } from './api/api'

class App extends Component {

    state = {
        string: '',
        result: 'null',
    }

    interpret = () => {
        let interpreter = new ExpressionsInterpreter(this.state.string)
        let result = interpreter.interpret()
        console.log('res', result)
        this.setState({result: result.toString()})
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>{this.state.result}</h1>
                    <input value={this.state.string} onChange={(e) => this.setState({string: e.target.value})}/>
                    <button onClick={this.interpret}>Interpret</button>
                </header>
            </div>
        );
    }
}

export default App;
