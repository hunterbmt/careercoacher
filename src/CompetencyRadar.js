import React from 'react';
import {Radar} from 'react-chartjs-2';
import tinyColor from 'tinycolor2';
import _ from 'lodash';
import {getRandomColor} from './utils';


const options = {
  tooltips: {
    enabled: false
  },
  legend: {
    position: 'bottom'
  },
  scale: {
    ticks: {
      display: false,
      beginAtZero: true,
      stepSize: 1,
      max: 4
    },
    pointLabels: { fontSize: 16 }
  }
};

const colorList = _([
  '#8884d8',
  '#82ca9d',
  ...getRandomColor(10)
])
.map(tinyColor)
.value();

const getBackgroundColorString = (index) => colorList[index].setAlpha(0.2).toRgbString();
const getBorderColor = (index) => colorList[index].setAlpha(1).toRgbString();

const CompentencyRadar = ({width = 600, height = 'auto', data, compentencies}) => {
  const radarData = _.map(data, () => ({
    label: data.name,
    data: _.map(compentencies, (compentency) => data.competencies[compentency]),
    backgroundColor: getBackgroundColorString(0),
    borderColor: getBorderColor(1),
    pointBackgroundColor: getBackgroundColorString(2),
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: getBackgroundColorString(3)
  }));
  return (
    <div style={{width, height}}>
      <Radar
        width='100%'
        height='100%'
        data={{
          labels: compentencies,
          datasets: radarData
        }}
        options={options}
      />
    </div>
  );
};

export default CompentencyRadar;
