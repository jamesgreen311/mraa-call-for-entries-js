function getRoute() {
    const urlString = window.location.search
    let route = {}

    const params = new URLSearchParams(urlString)

    let id = params.get('id')
    let mode = params.get('mode')
    route["path"] = (id?id:'oldest') // default to oldest

    console.log(id, mode, route.path)
    return route
}