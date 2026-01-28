import React from 'react';
import './App.css';
import { ParamEditor, Param, Model } from './ParamEditor';

const params: Param[] = [
  { id: 1, name: 'Назначение', type: 'string' },
  { id: 2, name: 'Длина', type: 'string' },
];

const model: Model = {
  paramValues: [
    { paramId: 1, value: 'повседневное' },
    { paramId: 2, value: 'маски' },
  ],
  colors: [
    { id: 1, name: 'красный' },
    { id: 2, name: 'синий' },
  ],
};

function App() {
  return (
    <div className="App">
      <ParamEditor params={params} model={model} />
    </div>
  );
}

export default App;