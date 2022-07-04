import { RoadmapStartup } from './src/index';
import rawData from './src/sample-data.json';

const container = document.getElementById('container');
const bounding = container.getBoundingClientRect();
const width = bounding.width;
const height = bounding.height;
const rm = new RoadmapStartup(rawData.samples2, {
  title: 'Front-end',
  width: width,
  height: height,
  container: container,
  markDoneFunc: () => {},
});
rm.startup();
