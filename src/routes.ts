
export const routes = {
    "/": (r) => `<page-home/>`,
    "/settings": (r) => `<page-settings/>`,
    "/device/:id": (r) => `<page-device id="${r.params.id}"/>`,
    "/page-not-found": (r) => `<page-not-found/>`,
};