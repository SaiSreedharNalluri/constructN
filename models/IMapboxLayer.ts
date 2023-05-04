import { Layer } from 'mapbox-gl';


export interface IMapboxLayer extends Layer{
   

categories:[{filters:[{name:string,filter:any}]}]

}
