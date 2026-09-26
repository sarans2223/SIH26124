/**
 * Urban Fleet Intelligence
 * City and Geographic Baseline Configuration
 * 
 * Keep the city as a data setting only so the product can be reused for other municipal regions.
 */

export const CITY_CONFIG = {
  city: 'Chennai',
  region: 'Tamil Nadu',
  country: 'India',
  center: [13.0827, 80.2707],
  defaultZoom: 12,
  minZoom: 10,
  maxZoom: 18,
  bounds: [
    [12.75, 79.95],
    [13.35, 80.40]
  ],
  transitAgency: 'Metropolitan Fleet Transit',
  dataModeLabel: 'Demo data'
};

export default CITY_CONFIG;
