import {
    applyOffset,
    removeOffset,
    applyTMInverse,
    applyTM

  } from './ViewerDataUtils';
import { MathUtils } from "../public/potree/libs/three.js/build/three.module";

export class ForgeLayerUtils {
    
    constructor (viewer, extn) {

        this._viewer = viewer
        
        this._edit2d = extn

        this._layer = this._edit2d.defaultContext.layer
    }

    setTransform(tm, offset) {

        this._tm = tm

        this._offset = offset
    }


    loadMediaData = async (mediaData) => {

        for(let type of Object.keys(mediaData)) {

            const data = []

            const images = Object.keys(mediaData[type])
    
            for(let i = 0; i < images.length; i++) {

                const item = mediaData[type][images[i]]
    
                data.push({
    
                    id: images[i],
        
                    position: item.position,
        
                    rotation: item.rotation,
        
                    type: type
                })
            }           
            
            this._addShapes(data, type)
        }
    }

    _addShapes = (data, type) => {

        for(let i = 0; i < data.length; i++) {
    
            // let localPosition = this._toLocalPosition({ x: data[i].position[0], y: data[i].position[1], z: data[i].position[2] })

            var poly = new Autodesk.Edit2D.Polygon([
                {x: -0.5, y: -0.5},
                {x: -0.5, y: 0.5},
                {x: 0.5, y: 0.5}
            ]);
            
            var circle = new Autodesk.Edit2D.Circle(5, 5)
            
            const svgString = '<path d="M100.94,110.75a.74.74,0,0,1-.53-.22l-2-2.06a.74.74,0,0,1,0-1.06.75.75,0,0,1,1.06,0l101.52,100.53L115.58,208.3a.75.75,0,0,1,1.06,0,.74.74,0,0,1,0,1.06l-6.17,6.17A.73.73,0,0,1,9.94,15.75ZM21.75,12A9.75,9.75,0,1,0,12,21.75,9.76,9.76,0,0,0,21.75,12Zm-1.5,0A8.25,8.25,0,1,1,12,3.75,8.26,8.26,0,0,1,20.25,12Z" fill="currentColor"></path>'
            
            const shape    = Autodesk.Edit2D.Shape.fromSVG(svgString)
            
            this._layer.addShape(circle)
        }
    }

    showTag = (type, show) => {

        const viewableData = this._viewableDataMap[type]

        const dbIds = viewableData.viewables.map(v => { return v.dbId})

        this._invalidateViewables(dbIds, this._dataVizExtn.pointMeshes, viewableData, (viewable) => {

            return {

                scale: show ? 1 : 0
            }
        })
    }
    
    _toLocalPosition = (position) => {
    
        let _position = applyTMInverse(position, this._tm)
        
        _position = applyOffset(_position, this._offset)
        
        return _position
    }

}