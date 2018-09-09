// Converted to react from https://github.com/derhuerst/svg-radar-chart
import * as React from 'react';

const polarToX = (angle, distance) => Math.cos(angle - Math.PI / 2) * distance;

const polarToY = (angle, distance) => Math.sin(angle - Math.PI / 2) * distance;

const points = (points) => {
  return points
    .map((point) => point[0].toFixed(4) + ',' + point[1].toFixed(4))
    .join(' ');
};

const noSmoothing = (points) => {
  let d = 'M' + points[0][0].toFixed(4) + ',' + points[0][1].toFixed(4);
  for (let i = 1; i < points.length; i++) {
    d += 'L' + points[i][0].toFixed(4) + ',' + points[i][1].toFixed(4);
  }
  return d + 'z';
};

const axis = (opt) => (col) => {
  return (
    <polyline key={col.key} {...opt.axisProps(col)} points={points([[0,0],[polarToX(col.angle, opt.chartSize / 2),polarToY(col.angle, opt.chartSize / 2)]])} />
  );
};

const shape = (columns, opt) => (data, i) => {
  const d = opt.smoothing(columns.map((col) => {
    const val = data[col.key];
    if ('number' !== typeof val) {
      throw new Error(`Data set ${i} is invalid.`);
    }

    return [
      polarToX(col.angle, val * opt.chartSize / 2),
      polarToY(col.angle, val * opt.chartSize / 2),
    ];
  }));
  return (
    <path key={i} {...opt.shapeProps(data)} d={d}/>
  );
};

const scale = (opt, value, cols): JSX.Element[] => {
  const distFromOrigin = (opt.chartSize / 2) * value;
  const line = (startIdx, endIdx) => {
    const start = [polarToX(cols[startIdx].angle, distFromOrigin),polarToY(cols[startIdx].angle, distFromOrigin)];
    const end = [polarToX(cols[endIdx].angle, distFromOrigin),polarToY(cols[endIdx].angle, distFromOrigin)];
    return <polyline key={`${startIdx}-${endIdx}-${value}`} {...opt.scaleProps(value)} points={points([start,end])} />;
  };
  const lines = [];
  for (let ct = 0; ct < cols.length - 1; ct++) {
    lines.push(line(ct, ct+1));
  }
  if (cols.length > 1) {
    lines.push(line(cols.length-1, 0));
  }
  return lines;
};

const caption = (opt) => (col) => {
  return (
    <text
      key={col.key}
      {...opt.captionProps(col)}
      x={polarToX(col.angle, opt.size / 2 * .95).toFixed(4)}
      y={polarToY(col.angle, opt.size / 2 * .95).toFixed(4)}
      dy={(opt.captionProps(col).fontSize || 2) / 2}>
      {col.caption}
    </text>
  );
};

const defaults = {
  size: 100, // size of the chart (including captions)
  axes: true, // show axes?
  scales: 3, // show scale circles?
  captions: true, // show captions?
  captionsPosition: 1.2, // where on the axes are the captions?
  smoothing: noSmoothing, // shape smoothing function
  axisProps: () => ({className: 'axis'}),
  scaleProps: () => ({className: 'scale', fill: 'none'}),
  shapeProps: () => ({className: 'shape'}),
  captionProps: () => ({
    className: 'caption',
    textAnchor: 'middle', fontSize: 3,
    fontFamily: 'sans-serif',
  }),
};

interface IProp {
  columns: any;
  data: any;
  opt: any;
}

export const render = ({columns, data, opt = {}}: IProp) => {
  if ('object' !== typeof columns || Array.isArray(columns)) {
    throw new Error('columns must be an object');
  }
  if (!Array.isArray(data)) {
    throw new Error('data must be an array');
  }
  opt = {
    ...defaults,
    ...opt,
  };
  opt.chartSize = opt.size / opt.captionsPosition;

  columns = Object.keys(columns).map((key, i, all) => ({
    key, caption: columns[key],
    angle: Math.PI * 2 * i / all.length,
  }));

  const groups = [(
    <g key="shape">
      {data.map(shape(columns, opt))}
    </g>
  )];
  if (opt.captions) {
    groups.push((
      <g key="captions">{columns.map(caption(opt))}</g>
    ));
  }
  if (opt.axes) {
    groups.unshift((<g key="axes">{columns.map(axis(opt))}</g>));
  }
  if (opt.scales > 0) {
    const scales = [];
    for (let i = opt.scales; i > 0; i--) {
      scales.push(...scale(opt, i / opt.scales, columns));
    }
    groups.unshift((<g key="scale">{scales}</g>));
  }

  const delta = (opt.size / 2).toFixed(4);
  return (
    <svg className="static-radar" version="1" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${opt.size} ${opt.size}`}>
      <g transform={`translate(${delta},${delta})`}>
        {groups}
      </g>
    </svg>
  );
};
