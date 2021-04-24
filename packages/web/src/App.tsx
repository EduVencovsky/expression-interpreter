import React, { Component, useRef, useState } from "react";
import "./App.css";
import {
  Calculator,
  StringComparator,
  ExpressionsInterpreter,
  Token,
  TokenType,
} from "@expression-interpreter/core";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";

const classes = {
  Calculator: new Calculator(),
  StringComparator: new StringComparator(),
  ExpressionsInterpreter: new ExpressionsInterpreter(),
};

type ValidClasses = keyof typeof classes;

const isKeyofClasses = (value: string): value is ValidClasses => {
  return value in classes;
};

interface InterpreterResult {
  result: string;
  tokens: Token<TokenType>[];
}

interface InputOption {
  value: string;
  option: ValidClasses;
}

// 1 + 1 + 2 == 4 - 8 && 1 + 2 + 3 == 5 - 2

const App = () => {
  const [input, setInput] = useState<InputOption>({
    value: "",
    option: "ExpressionsInterpreter",
  });
  const [interpreterResult, setInterpreterResult] = useState<InterpreterResult>(
    {
      result: "",
      tokens: [],
    }
  );

  const interpret = () => {
    let result = "";
    const interpreter = classes[input.option];

    try {
      result = interpreter.eval(input.value);
    } catch (error) {
      result = error;
    }
    setInterpreterResult({
      result: result.toString(),
      tokens: interpreter.parser?.tokenList || [],
    });
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isKeyofClasses(e.target.value)) {
      setInput({
        value: "",
        option: e.target.value,
      });
      setInterpreterResult({
        tokens: [],
        result: "",
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h1">{interpreterResult.result}</Typography>
        <Paper>
          <Box>
            <Box>
              <TextField
              variant="outlined"
                value={input.value}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, value: e.target.value }))
                }
              />
            </Box>
            <Button variant="contained" color="primary" onClick={interpret}>
              Interpretar
            </Button>
          </Box>
          <Box m={1}>
            <FormControl component="fieldset">
              <RadioGroup value={input.option} onChange={handleOptionChange}>
                <FormControlLabel
                  value="Calculator"
                  control={<Radio />}
                  label="Calculator"
                />
                <FormControlLabel
                  value="StringComparator"
                  control={<Radio />}
                  label="String Comparator"
                />
                <FormControlLabel
                  value="ExpressionsInterpreter"
                  control={<Radio />}
                  label="Expressions Interpreter"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Paper>
        <Box flexDirection="row" display="flex" overflow="auto" width="90%">
          {interpreterResult.tokens.map((x, i) => (
            <Box key={i} m={1}>
              <Paper>
                <Box p={1}>
                  <Box>
                    <Typography variant="h5">{x.type}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6">{x.value || "\u00A0"}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      </header>
    </div>
  );
};

export default App;
