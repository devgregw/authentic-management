import OpenTabAction from '../ui/components/actionFields/OpenTabAction'
import OpenURLAction from '../ui/components/actionFields/OpenURLAction'
import GetDirectionsAction from '../ui/components/actionFields/GetDirectionsAction'
import EmailAction from '../ui/components/actionFields/EmailAction'

import OpenEventAction from '../ui/components/actionFields/OpenEventAction'
import ShowMapAction from '../ui/components/actionFields/ShowMapAction'
import AddToCalendarAction from '../ui/components/actionFields/AddToCalendarAction'

import React from 'react'

export default class Utils {
    static get version() {
        return '5.22.18.2'
    }

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

    static openSender() {
        Utils.openPopup(`${Utils.getBaseUrl()}/send`, 1000, 600)
    }

    static openNewEditor(info) {
        Utils.openPopup(`${Utils.getBaseUrl()}/editor?action=new&category=${info.category}${info.parent ? `&parent=${info.parent}` : ''}`, 1000, 600)
    }

    static openEditor(info) {
        Utils.openPopup(`${Utils.getBaseUrl()}/editor?action=edit&category=${info.category}&path=${info.path}${info.parent ? `&parent=${info.parent}` : ''}`, 1000, 600)
    }

    static openReorder(tabId) {
        Utils.openPopup(`${Utils.getBaseUrl()}/editor/reorder?tabId=${tabId}`, 1000, 600)
    }

    static isLocalhost() {
        return window.location.hostname === 'localhost' ||
        window.location.hostname === '[::1]' ||
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    }

    static getBaseUrl() {
        return Utils.isLocalhost() ? 'http://localhost' : 'https://accams.devgregw.com'
    }

    static actionClasses = {
        OpenTabAction: OpenTabAction,
        OpenURLAction: OpenURLAction,
        GetDirectionsAction: GetDirectionsAction,
        EmailAction: EmailAction,
        OpenEventAction: OpenEventAction,
        ShowMapAction: ShowMapAction,
        AddToCalendarAction: AddToCalendarAction
    }

    static get actionClassesIndexed() {
        var l = []
        for (var name in Utils.actionClasses)
            l.push(this.actionClasses[name])
        return l
    }

    static getActionSummary(a) {
        return Utils.actionClasses[a.type].getSummary(a)
    }

    static getElementSummary(e) {
        switch (e.type) {
            case 'image':
                return `Source: ${e.image}`
            case 'title':
                return `Text: ${e.title}`
            case 'text':
                return `Text: ${e.text}`
            case 'button':
                return <p>{`Label: ${e._buttonInfo.label}`}<br/>{`Action: ${Utils.getActionSummary(e._buttonInfo.action)}`}</p>
            case 'separator':
                return `Visible: ${e.visible ? 'Yes' : 'No'}`
            case 'video':
                return `Provider: ${e.provider}, ID: ${e.videoId}`
            default:
                return 'Invalid element type'
        }
    }
}