import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ParamEditor } from './ParamEditor';

const mockParams = [
  { id: 1, name: 'Назначение', type: 'string' as const },
  { id: 2, name: 'Длина', type: 'string' as const },
];

const mockModel = {
  paramValues: [
    { paramId: 1, value: 'повседневное' },
    { paramId: 2, value: 'маски' },
  ],
  colors: [
    { id: 1, name: 'красный' },
    { id: 2, name: 'синий' },
  ],
};

describe('ParamEditor', () => {
  test('отображает все переданные параметры', () => {
    render(<ParamEditor params={mockParams} model={mockModel} />);
    
    expect(screen.getByText('Назначение')).toBeInTheDocument();
    expect(screen.getByText('Длина')).toBeInTheDocument();
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);
  });

  test('инициализируется значениями из модели', () => {
    render(<ParamEditor params={mockParams} model={mockModel} />);
    
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs[0].value).toBe('повседневное');
    expect(inputs[1].value).toBe('маски');
  });

  test('изменяет значения при вводе', () => {
    render(<ParamEditor params={mockParams} model={mockModel} />);
    
    const input = screen.getAllByRole('textbox')[0] as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'вечернее' } });
    
    expect(input.value).toBe('вечернее');
  });

  test('имеет кнопку для вызова getModel', () => {
    render(<ParamEditor params={mockParams} model={mockModel} />);
    
    const button = screen.getByTestId('get-model-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Вызвать getModel()');
  });

  test('отображает параметры в таблице', () => {
    render(<ParamEditor params={mockParams} model={mockModel} />);
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
  });
});