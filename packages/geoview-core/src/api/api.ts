import { Map } from "leaflet";

/* eslint-disable no-plusplus */
import { Event, EVENT_NAMES } from "./event";

import { Projection, PROJECTION_NAMES } from "../geo/projection/projection";

import { MapViewer } from "../geo/map/map";

import { Plugin } from "./plugin";
import { GeoUtilities } from "../geo/utils/utilities";
import { CONST_LAYER_TYPES } from "../core/types/cgpv-types";
import * as MarkerDefinitions from "../../../geoview-loader/public/markers/marker-definitions";

/**
 * Class used to handle api calls (events, functions etc...)
 *
 * @export
 * @class API
 */
export class API {
  // event object used to handle triggering events, subscribing to an event etc...
  event: Event;

  // available event names
  eventNames = EVENT_NAMES;

  // project object used to handle transforming projects
  projection: Projection;

  // available projection names
  projectNames = PROJECTION_NAMES;

  // available layer types
  layerTypes = CONST_LAYER_TYPES;

  // list of available maps
  maps: Record<string, MapViewer> = {};

  // timeout number used to check if everything is ready to make API calls
  isReady = 0;

  // callback function to call after everything is ready
  readyCallback: () => void = () => undefined;

  // load plugins API
  plugin: Plugin;

  // utilities object
  geoUtilities: GeoUtilities;

  // used to access marker definitions
  markerDefinitions = MarkerDefinitions;

  /**
   * Initiate the event and projection objects
   */
  constructor() {
    this.event = new Event();
    this.projection = new Projection();
    this.plugin = new Plugin();
    this.geoUtilities = new GeoUtilities();
  }

  /**
   */
  /**
   * Check if map rendering / drawing is ready then run the callback function
   * Timeout does not effect rendering speed, each map will cancel the previous timer after it renders
   * so timing of rendering will be based on device specs.
   *
   * @param callback a callback to make once the map has rendered
   */
  ready = (callback: () => void): void => {
    // Clear our timeout throughout the event change
    window.clearTimeout(this.isReady);

    // Set a timeout to run after render ends
    // this will only be called after the last map renders so no delay in rendering and performance will happen
    this.isReady = window.setTimeout(() => {
      if (callback) callback();

      // Run the callback
      if (this.readyCallback) this.readyCallback();
    }, 1000);
  };

  /**
   * Get the instance of a map by it's ID to access API functions
   *
   * @param {string} id the map id
   *
   * @returns map api functions
   */
  map = (id: string): MapViewer => {
    return this.maps[id];
  };

  /**
   * Get the instance of a map by a leaflet instance to access API functions
   *
   * @param {Map} map the leaflet map instance
   *
   * @returns {MapViewer | undefined} the map instance
   */
  mapInstance = (map: Map): MapViewer | undefined => {
    for (let i = 0; i < Object.keys(this.maps).length; i++) {
      var key = Object.keys(this.maps)[i];
      var value = this.maps[key];

      if (value.map === map) {
        return this.maps[key];
      }
    }
  };
}

export const api = new API();
