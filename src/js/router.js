function getRoute() {
    const urlString = window.location.search
    const params = new URLSearchParams(urlString)    

    let route = {}
    let id = params.get('id')

    route["id"] = (id?id:'oldest') // default to oldest
    
    console.log(id, route.id)
    return route
}