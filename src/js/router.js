function getRoute() {
    const urlString = window.location.href
    const paramString = urlString.split('?')[1]
    const queryString = new URLSearchParams(paramString)
    let route = {}
/* 
    console.log(paramString)
    console.log(queryString) */

    for(let pair of queryString.entries()) {
/*         console.log("Key is:" + pair[0]);
        console.log("Value is:" + pair[1]); */

        if (!pair[1]) {
            console.log("Route is %s", pair[0])
            route.path = pair[0]
        } else {
            console.log(pair[0], "=", pair[1])
            route[pair[0]] = pair[1]
        }
    }
/*     console.log(route.path)
    console.log(route.id) */
    return route
}