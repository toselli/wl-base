export default (object: any) => {    
   return JSON.parse(JSON.stringify(object))
}