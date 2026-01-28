import React, { useState, useEffect } from 'react';

export interface Param {
  id: number;
  name: string;
  type: 'string';
}

export interface ParamValue {
  paramId: number;
  value: string;
}

export interface Color {
  id: number;
  name: string;
}

export interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

export interface ParamEditorProps {
  params: Param[];
  model: Model;
}

interface ParamInputProps {
  param: Param;
  value: string;
  onChange: (value: string) => void;
}

const ParamInput: React.FC<ParamInputProps> = ({ param, value, onChange }) => {
  if (param.type === 'string') {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          boxSizing: 'border-box'
        }}
        aria-label={`Редактировать ${param.name}`}
        data-testid={`param-input-${param.id}`}
      />
    );
  }
  
  return null;
};

export const ParamEditor: React.FC<ParamEditorProps> = ({ params, model }) => {
  const [paramValues, setParamValues] = useState<Map<number, string>>(() => {
    const map = new Map<number, string>();
    model.paramValues.forEach(pv => {
      map.set(pv.paramId, pv.value);
    });
    return map;
  });

  useEffect(() => {
    const map = new Map<number, string>();
    model.paramValues.forEach(pv => map.set(pv.paramId, pv.value));
    setParamValues(map);
  }, [model]);

  const handleParamChange = (paramId: number, value: string) => {
    setParamValues(prev => new Map(prev).set(paramId, value));
  };

  const getModel = (): Model => {
    const paramValuesArray: ParamValue[] = [];
    
    paramValues.forEach((value, paramId) => {
      paramValuesArray.push({ paramId, value });
    });
    
    return {
      paramValues: paramValuesArray,
      colors: [...model.colors]
    };
  };

  const handleGetModel = () => {
    const currentModel = getModel();
    console.log('Текущая модель (getModel()):', currentModel);
    alert('Модель выведена в консоль. Проверьте DevTools (F12 → Console)');
    
    return currentModel;
  };

  return (
    <div 
      style={{ 
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}
      data-testid="param-editor"
    >
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Редактор параметров</h2>
      
      <div style={{ 
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '24px'
      }}>
        <table style={{ 
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ 
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#495057',
                borderBottom: '2px solid #e0e0e0',
                width: '40%'
              }}>
                Параметр
              </th>
              <th style={{ 
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#495057',
                borderBottom: '2px solid #e0e0e0'
              }}>
                Значение
              </th>
            </tr>
          </thead>
          <tbody>
            {params.map((param, index) => (
              <tr 
                key={param.id}
                style={{ 
                  borderBottom: index < params.length - 1 ? '1px solid #e0e0e0' : 'none'
                }}
                data-testid={`param-row-${param.id}`}
              >
                <td style={{ 
                  padding: '16px',
                  fontWeight: '500',
                  color: '#212529',
                  backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                }}>
                  {param.name}
                </td>
                <td style={{ 
                  padding: '16px',
                  backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                }}>
                  <ParamInput
                    param={param}
                    value={paramValues.get(param.id) || ''}
                    onChange={(value) => handleParamChange(param.id, value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Кнопка для вызова getModel */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleGetModel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
          data-testid="get-model-button"
        >
          Вызвать getModel()
        </button>
        <span style={{ fontSize: '14px', color: '#666' }}>
          Проверьте консоль браузера (F12)
        </span>
      </div>

      <div>
        <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>Текущая модель:</h4>
        <div style={{ 
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          padding: '16px',
          border: '1px solid #ddd',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          <pre style={{ margin: 0, fontSize: '12px', lineHeight: '1.4' }}>
            {JSON.stringify(getModel(), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export class ClassParamEditor extends React.Component<ParamEditorProps, { paramValues: Map<number, string> }> {
  constructor(props: ParamEditorProps) {
    super(props);
    
    const paramValuesMap = new Map<number, string>();
    props.model.paramValues.forEach(pv => {
      paramValuesMap.set(pv.paramId, pv.value);
    });
    
    this.state = {
      paramValues: paramValuesMap
    };
  }

  componentDidUpdate(prevProps: ParamEditorProps) {
    if (prevProps.model !== this.props.model) {
      const paramValuesMap = new Map<number, string>();
      this.props.model.paramValues.forEach(pv => {
        paramValuesMap.set(pv.paramId, pv.value);
      });
      
      this.setState({ paramValues: paramValuesMap });
    }
  }

  handleParamChange = (paramId: number, value: string) => {
    this.setState(prevState => ({
      paramValues: new Map(prevState.paramValues).set(paramId, value)
    }));
  };

  public getModel(): Model {
    const paramValues: ParamValue[] = [];
    
    this.state.paramValues.forEach((value, paramId) => {
      paramValues.push({ paramId, value });
    });
    
    return {
      paramValues,
      colors: [...this.props.model.colors]
    };
  }

  render() {
    const { params } = this.props;
    const { paramValues } = this.state;

    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Редактор параметров (Классовый компонент)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {params.map(param => (
              <tr key={param.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{param.name}</td>
                <td style={{ padding: '12px' }}>
                  <input
                    type="text"
                    value={paramValues.get(param.id) || ''}
                    onChange={(e) => this.handleParamChange(param.id, e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}