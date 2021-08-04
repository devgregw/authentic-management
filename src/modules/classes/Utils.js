import OpenTabAction from '../ui/components/actionFields/OpenTabAction'
import OpenURLAction from '../ui/components/actionFields/OpenURLAction'
import GetDirectionsAction from '../ui/components/actionFields/GetDirectionsAction'
import EmailAction from '../ui/components/actionFields/EmailAction'

import OpenEventAction from '../ui/components/actionFields/OpenEventAction'
import ShowMapAction from '../ui/components/actionFields/ShowMapAction'
import AddToCalendarAction from '../ui/components/actionFields/AddToCalendarAction'
import OpenYouTubeAction from '../ui/components/actionFields/OpenYouTubeAction'
import OpenSpotifyAction from '../ui/components/actionFields/OpenSpotifyAction'
import OpenEventsPageAction from '../ui/components/actionFields/OpenEventsPageAction'

import React from 'react'

export default class Utils {
    static get version() {
        return '1.3.2 (June 22, 2021)'
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
        Utils.openPopup(`${Utils.getBaseUrl()}/editor?action=new&category=${info.category}${info.specialType ? `&specialType=${info.specialType}` : ''}${info.parent ? `&parent=${info.parent}` : ''}${info.parentCategory ? `&parent_category=${info.parentCategory}` : ''}`, 1000, 600)
    }

    static openEditor(info) {
        Utils.openPopup(`${Utils.getBaseUrl()}/editor?action=edit&category=${info.category}&path=${info.path}${info.parent ? `&parent=${info.parent}` : ''}${info.parentCategory ? `&parent_category=${info.parentCategory}` : ''}`, 1000, 600)
    }

    static openNewCollection() {
        Utils.openPopup(`${Utils.getBaseUrl()}/collections/new`, 1000, 600)
    }

    static openAddVideoToCollection() {
        Utils.openPopup(`${Utils.getBaseUrl()}/collections/videos/add`, 1000, 600)
    }

    static openReorder(type, id) {
        Utils.openPopup(`${Utils.getBaseUrl()}/editor/reorder?type=${type}&id=${id}`, 1000, 600)
    }

    static isLocalhost() {
        return window.location.hostname === 'localhost' ||
        window.location.hostname === '[::1]' ||
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    }

    static getBaseUrl() {
        return `${window.location.protocol}//${window.location.host}`
        //return Utils.isLocalhost() ? 'http://localhost' : 'https://authentic.gregwhatley.dev'
    }

    static actionClasses = {
        OpenTabAction: OpenTabAction,
        OpenURLAction: OpenURLAction,
        GetDirectionsAction: GetDirectionsAction,
        EmailAction: EmailAction,
        OpenEventAction: OpenEventAction,
        ShowMapAction: ShowMapAction,
        AddToCalendarAction: AddToCalendarAction,
        OpenYouTubeAction: OpenYouTubeAction,
        OpenSpotifyAction: OpenSpotifyAction,
        OpenEventsPageAction: OpenEventsPageAction
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

    static getElementTitle(e) {
        switch (e.type) {
            case 'image':
            case 'title':
            case 'text':
            case 'button':
            case 'tile':
            case 'html':
            case 'toolbar':
            case 'separator':
            case 'video':
                return e.type
            case 'thumbnailButton':
                return 'thumbnail button'
            case 'fullExpController':
                return 'Full Experience Controller'
            default:
                return `unknown (${e.type})`
        }
    }

    static getElementSummary(e) {
        switch (e.type) {
            case 'image':
                return `Source: ${e.image.name} (${e.image.width}*${e.image.height})`
            case 'title':
                return `Text: ${e.title}`
            case 'text':
                return `Text: ${e.text}`
            case 'button':
                return <p>{`Label: ${e._buttonInfo.label}`}<br/>{`Action: ${Utils.getActionSummary(e._buttonInfo.action)}`}</p>
            case 'thumbnailButton':
                return <p>{`Label: ${e._buttonInfo.label}`}<br/>{`Action: ${Utils.getActionSummary(e._buttonInfo.action)}`}</p>
            case 'tile':
                return <p>{`Title: ${e.title || 'none'}`}<br/>{`Action: ${Utils.getActionSummary(e.action)}`}</p>
            case 'html':
                return 'HTML Document'
            case 'toolbar':
                return <p>{`Left Action: ${Utils.getActionSummary(e.leftAction)}`}<br/>{`Right Action: ${Utils.getActionSummary(e.rightAction)}`}</p>
            case 'separator':
                return `Visible: ${e.visible ? 'Yes' : 'No'}`
            case 'fullExpController':
                return `Action: ${Utils.getActionSummary(e.action)}`
            case 'video':
                return `"${e.videoInfo.title}" (${e.videoInfo.provider}/${e.videoInfo.id})`
            default:
                return 'Invalid element type'
        }
    }
}