
export const routes = {
    "/": (r) => `<page-home/>`,
    "/settings": (r) => `<page-settings/>`,
    "/device/:id": (r) => {
        console.log(`device`, r)
        return `<ble-device id="${r.params.id}"/>`
    },
    "/page-not-found": (r) => `<page-not-found/>`,
};