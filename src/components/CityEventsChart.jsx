// src/components/CityEventsChart.jsx

import React, { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from 'recharts';

const CityEventsChart = ({ allLocations, events }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(getData());
  }, [allLocations, events]);

  const getData = () => {
    const data = allLocations.map((location) => {
      const count = events.filter((event) => event.location === location).length;
      const city = location.split(', ')[0];
      return { city, count };
    });
    return data;
  };

  return (
    <div className="charts-container">
      <h2 className="chart-title">Events by City</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 30,
            bottom: 60,
            left: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis 
            type="category" 
            dataKey="city" 
            name="City"
            tick={{ fill: '#667eea', fontSize: 14 }}
            angle={-45}
            textAnchor="end"
            height={100}
          >
            <Label 
              value="City" 
              offset={-20} 
              position="insideBottom" 
              style={{ fill: '#667eea', fontWeight: 'bold', fontSize: 16 }}
            />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="count" 
            name="Number of Events"
            allowDecimals={false}
            tick={{ fill: '#667eea', fontSize: 14 }}
          >
            <Label 
              value="Number of Events" 
              angle={-90} 
              position="insideLeft" 
              style={{ fill: '#667eea', fontWeight: 'bold', fontSize: 16, textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'white',
              border: '2px solid #667eea',
              borderRadius: '8px',
              padding: '10px'
            }}
            labelStyle={{ color: '#667eea', fontWeight: 'bold' }}
          />
          <Scatter 
            name="Events" 
            data={data} 
            fill="#667eea"
            fillOpacity={0.8}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CityEventsChart;