import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf"
const syncMaps = require('mapbox-gl-sync-move');

const utmCode = '+proj=utm +ellps=GRS80 +datum=nad83 +units=m +no_defs +zone='

const latLngCode = '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees +no_defs'

export const MapboxViewerUtils = () => {
  let _viewerId;
  let _eventHandler;
  let _viewer;
  let _isViewerInitialized = false;

  let _map;
  let _popup;

  let _project;
  let _structure;
  let _snapshot;

  let _isPendingDataToLoad = false;
  let _isPendingLayersToLoad = false;

  let _documentURNs;
  let _selectedType;
  let _tm;
  let _globalOffset;
  let _manifestNode;
  let _model;
  let _isModelLoaded = false;

  let _realityPositionMap = {};
  let _issuesList = [];
  let _tasksList = [];
  let _showLayersList = [];
  let _showTag = {};

  let _context;

  let _dataVizExtn;
  let _bimWalkExtn;
  let _dataVizUtils;
  let _isAddTagActive = false;

  let _hotspotClick;

  const isCompareView = () => {
    if (_viewerId.split('_')[1] === '1') {
      return false;
    } else {
      return true;
    }
  };

  const isViewerInitialized = () => {
    return _isViewerInitialized;
  };


  const setType = (type) => {
    _selectedType = type;
  };


  const initializeViewer = (viewerId, options, map) => {
    _viewerId = viewerId;
    console.log('Inside Initializer callback', _eventHandler);
    mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_Map_Token}`;
    _map = new mapboxgl.Map({
      container: viewerId, // container ID
      style: 'mapbox://styles/mapbox/satellite-v9', // style URL
      center: options ? options.center : [77.5657485841588, 15.061798588445253], // starting position [lng, lat]
      zoom: 16 // starting zoom
    });
    _map.on("load", () => {
      _isViewerInitialized = true;
      if(map) {
        syncMaps(map, _map)
        map.resize()
        _map.resize()
      }
    })
  };

  const setProject = (project) => {
    _project = project;
  }

  const setStructure = (structure) => {
    _structure = structure;
  }

  const setSnapshot = (snapshot) => {
    _snapshot = snapshot;
  }


  const updateData = (models, context) => {
    console.log('Inside update data: ', models, context);

    if (_isViewerInitialized) {
      if(_map.isStyleLoaded()) {
        removeData(models)
        loadData(models)
      } else {
        _map.on('style.data', () => {
          removeData(models)
          loadData(models);
        });
      }
    } else {
      // initializeViewer();
    }
  };

  const updateLayersData = (layers, context) => {
    console.log('Inside update layers data: ', layers, context);
    if (context) {
      _context = context;
    } else {
      _context = null;
    }
    _realityPositionMap = layers;
    _isPendingLayersToLoad = true;
    if (loadLayersOnDataLoadCompletion()) {
      // loadLayers(layers);
      loadIssues();
      loadTasks();
    }
  };

  const updateIssuesData = (list) => {
    console.log('Inside update issues data: ', list);
    _issuesList = list;
    _isPendingLayersToLoad = true;
    if (loadLayersOnDataLoadCompletion()) {
      loadIssues();
    }
  };

  const updateTasksData = (list) => {
    console.log('Inside update tasks data: ', list);
    _tasksList = list;
    _isPendingLayersToLoad = true;
    if (loadLayersOnDataLoadCompletion()) {
      loadTasks();
    }
  };

  const updateProgressData = (progress) => {
    _progressData = progress;
  };

  const refreshData = () => {
    _isPendingDataToLoad = true;
    _isPendingLayersToLoad = true;
    loadData();
  };

  const loadLayersOnDataLoadCompletion = () => {
    return _isViewerInitialized;
  };

  const loadData = (data) => {
    let realities = _snapshot.reality.map(r => r._id);
    let layersString = JSON.stringify(data);
    layersString = layersString.split('{{PROJECT_ID}}').join(_project._id);
    layersString = layersString.split('{{STRUCTURE_ID}}').join(_structure._id);
    layersString = layersString.split('{{SNAPSHOT_ID}}').join(_snapshot._id);
    layersString = layersString.split('{{REALITY_ID}}').join(realities[0]);
    let layers = JSON.parse(layersString);
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].layer) {
        _map.addLayer(layers[i].layer, layers[i].layer.before);
        if (layers[i].layer.id == "progress") {
          _map.on('click', layers[i].layer.id, (e) => {
            onLayerClick(e.features[0]);
          });
          _map.on('mouseenter', layers[i].layer.id, () => {
            _map.getCanvas().style.cursor = 'pointer'
          });
          _map.on('mouseleave', layers[i].layer.id, () => {
            _map.getCanvas().style.cursor = ''
          });
        }
      }
    }
  };

  const onLayerClick = (e) => {
    _hotspotClick && _hotspotClick(e);
    let coordinates = e.geometry.type === 'Polygon' ? getCentreOfFeatureCollection(e) : e.geometry.coordinates;
    _map.flyTo({
      center: coordinates,
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
    if (!_popup) {
      _popup = new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat(coordinates)
        .setHTML(e.properties.htmlInfo ? e.properties.htmlInfo : getHtmlInfo(e))
        .addTo(_map);
    } else {
      _popup.setLngLat(coordinates)
        .setHTML(e.properties.htmlInfo ? e.properties.htmlInfo : getHtmlInfo(e))
        .addTo(_map);
    }
  }

  const getMap = () => {
    return _map;
  }

  const resize = () => {
    _map.resize();
  }

  const getCentreOfFeatureCollection = (collection) => {
    let center;
    center = turf.center(collection);
    return center.geometry.coordinates;
  }

  const getHtmlInfo = (e) => {
    let html = '<div style="display:flex;flex-direction: column;">';
    let total = e.properties.length;
    let row_clearing = e.properties.row_clearing;
    let excavation = e.properties.excavation;
    let stringing = e.properties.stringing;
    let pipe_laying = e.properties.pipe_laying;
    let back_filling = e.properties.back_filling;
    let ofc_cabling = e.properties.ofc_cabling;
    let mat_laying = e.properties.mat_laying;
    let progress = (row_clearing + stringing + excavation + pipe_laying + ofc_cabling + mat_laying + back_filling) * 100 / (7 * total);
    let current_stage = e.properties.stage;
    // current_stage = current_stage.charAt(0).toUpperCase() + current_stage.slice(1);
    html += '<div style="font-weight:600;border-bottom: 1px solid #aaa;margin-bottom: 0.5em;">' + e.properties.name + '</div>';
    html += '<div style="display:flex; padding:0 0.5em; background:rgba(0,255,200,0.5)"><div style="flex: 1";>' + 'Progress' + ': </div><strong style="margin-left: 1em;">' + progress.toFixed(0) + '%</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Total length' + ': </div><strong style="margin-left: 1em;">' + e.properties.length.toFixed(2) + ' mts.</strong></div>';
    // html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Current Stage' + ': </div><strong style="margin-left: 1em; text-transform: capitalize;">' + current_stage + '</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Row Clearing' + ': </div><strong style="margin-left: 1em;">' + e.properties.row_clearing.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Stringing' + ': </div><strong style="margin-left: 1em;">' + stringing.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Excavation' + ': </div><strong style="margin-left: 1em;">' + e.properties.excavation.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Pipe Laying' + ': </div><strong style="margin-left: 1em;">' + e.properties.pipe_laying.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'OFC Cabling' + ': </div><strong style="margin-left: 1em;">' + ofc_cabling.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Mat Laying' + ': </div><strong style="margin-left: 1em;">' + mat_laying.toFixed(2) + ' mts.</strong></div>';
    html += '<div style="display:flex; padding:0 0.5em;"><div style="flex: 1";>' + 'Back Filling' + ': </div><strong style="margin-left: 1em;">' + e.properties.back_filling.toFixed(2) + ' mts.</strong></div>';
    // for (const [key, value] of Object.entries(e.properties)) {
    //   html += '<div style="display:flex;"><div style="flex: 1";>' + key + ': </div><strong style="margin-left: 1em;">' + value + '</strong></div>';
    // }
    html += '</div>';
    return html;
  }

  const loadIssues = () => {
    const issuesLayer = {
      id: 'issues',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection'
        }
      },
      layout: {
        'icon-image': 'rocket-15'
      }
    }
  };

  const loadTasks = () => {
    const tasksLayer = {
      id: 'tasks',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection'
        }
      },
      layout: {
        'icon-image': 'rocket-15'
      }
    }
  };

  const annotationToFeature = (annotation) => {
    const context = annotation.context
    const tagPosition = context.tag.tagPosition
    const lngLat = utmToLatLng([tagPosition.x, tagPosition.y, tagPosition.z], 43)
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: []
      },
      properties: {
        context,
        type: annotation.type,
        title: annotation.description,
        id: annotation._id
      }
    }
  }

  const latLngToUtm = (latLng, zoneId) => {

    return proj4(latLngCode, `${utmCode}${zoneId}`, latLng)
  }

  const radianToDegee = (radian) => {
    return radian * 180 / Math.PI
  }

  const degreeToRadian = (degree) => {
    return degree * Math.PI / 180
  }

  const utmToLatLng = (utm, zoneId) => {

    return proj4(`${utmCode}${zoneId}`, latLngCode, [utm[0], utm[1]])
  }

  const showLayers = (layersList) => {
    
  };

  const showTag = (tag, show) => {
    
  };

  const initiateAddTag = (type) => {
    
  };

  const cancelAddTag = () => {
    
  };

  const setHotspotClick = (onHotspotClick) => {
    _hotspotClick = onHotspotClick;
  }

  const selectTag = (tag) => {
    
  };

  const updateContext = (context, sendContext) => {
    // console.log("Updating context for forge: ", context);
    if (context) {
      _context = getContextLocalFromGlobal(context, _globalOffset);
    } else {
      _context = null;
      return;
    }
    handleContext(_context);
    _context = null;
  };

  const handleContext = (context) => {
    switch (context.type) {
      case '3d':
        setNavigation(context);
        setForgeControls(context.type);
        break;
      case 'image':
      case 'panorama':
        setNavigation(context);
        setForgeControls(context.type);
        break;
      case '360 Video':
        // goToImageContext(context);
        break;
      case 'tag':
        // goToTagContext(context.tag);
        break;
    }
  };

  const getContext = () => {
    
    let contextObject = {}
    const utm = latLngToUtm(_map.getCenter(), 43)
    contextObject['target'] = {x: utm[0], y: utm[1], z: position[2]}
    contextObject['pitch'] = degreeToRadian(_map.getPitch())
    contextObject['yaw'] = -degreeToRadian(_map.getBearing())
    return contextObject;
  };

  const onViewerUnInitialized = () => { };

  const removeData = (models) => {
    console.log("Model Before Removed: ", models);
    if(_map) {
      removeLayers(models);
    }
  };

  const removeLayers = (models) => {
    console.log('Inside remove layers in forgeWrapper: ');
    for (let i = 0; i < models.length; i++) {
      if (models[i].layer) {
        try {
          _map.removeLayer(models[i].layer.id);
          _map.removeSource(models[i].layer.id)
        } catch (error) {
          console.log(error)
        }
      }
    }
  };

  const shutdown = () => {
    if (_isViewerInitialized) {
      removeData();
      
    }
  };

  return {
    initializeViewer: initializeViewer,
    setType: setType,
    setProject: setProject,
    setStructure: setStructure,
    setSnapshot: setSnapshot,
    isViewerInitialized, isViewerInitialized,
    updateData: updateData,
    updateLayersData: updateLayersData,
    updateIssuesData: updateIssuesData,
    updateTasksData: updateTasksData,
    refreshData: refreshData,
    showLayers: showLayers,
    initiateAddTag: initiateAddTag,
    cancelAddTag: cancelAddTag,
    selectTag: selectTag,
    showTag: showTag,
    onLayerClick: onLayerClick,
    getContext: getContext,
    getMap: getMap,
    resize: resize,
    updateContext: updateContext,
    removeData: removeData,
    removeLayers: removeLayers,
    setHotspotClick: setHotspotClick,
    shutdown: shutdown,
  };
};
