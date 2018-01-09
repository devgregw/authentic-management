export default class Utils {
    static openPopup(url, w, h) {
        var dualScreenLeft = window.screenLeft !== undefined
            ? window.screenLeft
            : window.screen.left;
        var dualScreenTop = window.screenTop !== undefined
            ? window.screenTop
            : window.screen.top;
        var width = window.innerWidth
            ? window.innerWidth
            : document.documentElement.clientWidth
                ? document.documentElement.clientWidth
                : window.screen.width;
        var height = window.innerHeight
            ? window.innerHeight
            : document.documentElement.clientHeight
                ? document.documentElement.clientHeight
                : window.screen.height;
        var left = ((width / 2) - (w / 2)) +
                dualScreenLeft;
        var top = ((height / 2) - (h / 2)) +
                dualScreenTop;
        var newWindow = window.open(url, url, 'scrollbars=yes, width=' +
                w +
                ', height=' +
                h +
                ', top=' +
                top +
                ', left=' +
                left);
        if (window.focus && newWindow) {
            newWindow.focus();
        }
        return newWindow;
    }

    static openNewEditor(info) {
        Utils.openPopup(`${Utils.getBaseUrl()}/editor?action=new&category=${info.category}${info.parent ? `&parent=${info.parent}` : ''}`, 1000, 600)
    }

    static openEditor(info) {
        Utils.openPopup(`${Utils.getBaseUrl()}/editor?action=edit&category=${info.category}&path=${info.path}${info.parent ? `&parent=${info.parent}` : ''}`, 1000, 600)
    }

    static isLocalhost() {
        return window.location.hostname === 'localhost' ||
        window.location.hostname === '[::1]' ||
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    }

    static getBaseUrl() {
        return Utils.isLocalhost() ? 'http://localhost' : 'https://accams.devgregw.com'
    }
}