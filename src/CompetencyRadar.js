import React from 'react';
import { Radar } from 'react-chartjs-2';
import tinyColor from 'tinycolor2';
import _ from 'lodash';
import { getRandomColor } from './utils';


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


const CompentencyRadar = ({width = 600, height = 'auto', data, competencies}) => {   
  const radarData = _.map(data, (item, index) => ({
    label: 'Must change',
    data: _.map(competencies, (competencyName) => _.isNumber(competencyName) ?  item.competencyName : _.get(item,competencyName)),
    backgroundColor: getBackgroundColorString(index),
    borderColor: getBorderColor(index),
    pointBackgroundColor: getBackgroundColorString(index),
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: getBackgroundColorString(index)
  }));
  return (
    <div style={{ width, height }}>
      <Radar
        width='100%'
        height='100%'
        data={{
          labels: competencies,
          datasets: radarData
        }}
        options={options}
      />
    </div>
  );
};

export default CompentencyRadar;
