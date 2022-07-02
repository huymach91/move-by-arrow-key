import { RoadmapStartup } from './src/index';
import rawData from './src/sample-data.json';

const rm = new RoadmapStartup(rawData.samples2, {
  title: 'Front-end',
});

rm.startup();
