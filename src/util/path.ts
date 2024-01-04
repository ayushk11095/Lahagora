import Path from 'path'
import { isArray } from 'util'

let PORT = process.env.PORT
let MAINMODULE = process.mainModule
let IPADDRESS = process.env.DB_HOST || 'localhost' 

export default {rootDir, baseUrl, imagePath, videoPath}

export function rootDir() {
    if(MAINMODULE != null){
        return Path.dirname(MAINMODULE.filename)
    }else{
        return Path.dirname('app.ts')
    }
}

export function baseUrl(route:any = null) {
    if(route){
        return  'http://'+IPADDRESS+':'+PORT+'/'+route
    }
    return 'http://'+IPADDRESS+':'+PORT+'/'
}

export function imagePath(pathArr:string[]) {
    if(isArray(pathArr)){
        return Path.join(rootDir(), '../', 'public', 'assets', 'uploads', 'images', ...pathArr)
    
    }else{
        return Path.join(rootDir(), '../', 'public', 'assets', 'uploads', 'images')
    }
}

export function videoPath(pathArr:string[]) {
    return Path.join(rootDir(), '../', 'public', 'assets', 'uploads', 'videos', ...pathArr)
}
