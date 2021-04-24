import React, { Component } from 'react';
import { Calculator, StringComparator, ExpressionsInterpreter } from '@expression-interpreter/core'

class App extends Component {

    state = {
        string: '',
        result: 'null',
        interpreter: new ExpressionsInterpreter(),
        selectedOption: "ExpressionsInterpreter"
    }

    classes = {
        Calculator, 
        StringComparator, 
        ExpressionsInterpreter
    }

    interpret = () => {
        let result = ''
        try {
            result = this.state.interpreter.eval(this.state.string)
        } catch (error) {
            result = error
        }
        this.setState({result: result.toString()})            
    }

    handleOptionChange = (e) => {
        let value = e.target.value
        this.setState({
            interpreter: new this.classes[value.toString()](),
            selectedOption: value,
            result: 'null',
            string: '',
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>{this.state.result}</h1>
                    <input value={this.state.string} onChange={(e) => this.setState({string: e.target.value})}/>
                    <button onClick={this.interpret}>Interpret</button>
                    <div>
                        <div>
                            Calculator
                            <input type="radio" value="Calculator" onChange={this.handleOptionChange} name="interpreterType" checked={this.state.selectedOption == 'Calculator'}/>
                        </div>
                        <div>
                            String Comparator
                            <input type="radio" value="StringComparator" onChange={this.handleOptionChange} name="interpreterType" checked={this.state.selectedOption == 'StringComparator'}/>
                        </div>
                        <div>   
                            Expressions Interpreter
                            <input type="radio" value="ExpressionsInterpreter" onChange={this.handleOptionChange} name="interpreterType" checked={this.state.selectedOption == 'ExpressionsInterpreter'}/>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default App;