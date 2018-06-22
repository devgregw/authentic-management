import React from 'react'
import * as queryString from 'query-string'
import {FormGroup, Label, Input, Form, Badge} from 'reactstrap'
import ContentLoader from './ContentLoader'
import Path from '../../classes/Path.js'
import ButtonConfiguration from './ButtonConfiguration.js'
import ImageUploader from './ImageUploader'
import VisibilityRulesField from './VisibilityRulesField'
import DateRangeField from './DateRangeField'
import RecurrenceField from './RecurrenceField'
import RegistrationConfigurationField from './RegistrationConfigurationField'

export default class EditorForm extends React.Component {
    constructor(props) {
        super(props)
        this.collect = this
            .collect
            .bind(this)
        this.validate = this
            .validate
            .bind(this)
        this.state = {
            actionCheckbox: false
        }
        var id = {
            title: "ID",
            property: "id",
            description: "This is a unique identifier.  It cannot be changed.",
            render: value => <Input id="id" style={{fontFamily: 'monospace !important'}} defaultValue={value || this.createId()} readOnly="readOnly"/>,
            get: () => document
                .getElementById('id')
                .value,
            validate: () => document.getElementById('id').value ? false : '!!!NO ID!!!'
        }
        var idp = [
            id, {
                title: "Parent ID",
                property: "parent",
                description: "",
                render: value => <Input id="parent" defaultValue={this
                        .getEditorInfo()
                        .parent} readOnly="readOnly"/>,
                get: () => this
                .getEditorInfo()
                .parent,
                validate: () => false
            }
        ]
        this.fieldPresets = {
                idField: id,
                idPairFields: idp,
                titleField: {
                    title: "Title",
                    property: "title",
                    description: "",
                    render: value => <Input id="title" defaultValue={value}/>,
                    get: () => document
                        .getElementById('title')
                        .value,
                    validate: () => document.getElementById('title').value ? false : 'No title specified.'
                },
                titleVisibilityField: {
                    title: 'Title Visibility',
                    property: 'hideTitle',
                    description: 'Check this box to hide the card\'s title on the home screen.  This is useful when the header image already contains the title.',
                    render: value => <FormGroup check>
                        <Label check>
                            <Input id="hideTitle" type="checkbox" defaultChecked={value || false}/>{' '}
                            Hide title
                        </Label>
                    </FormGroup>,
                    get: () => document
                        .getElementById('hideTitle')
                        .checked,
                    validate: () => false
                },
                headerImageField: {
                    title: "Header Image",
                    property: "header",
                    description: "Specify a header image.  Click Clear to remove the image or click Reset to restore the original value.",
                    render: value => <ImageUploader ref={u => this.imageUploader = u} value={value}/>,
                    get: () => this.imageUploader.saveImage(`header_${document
                        .getElementById('id')
                        .value}`),
                    validate: () => this
                        .imageUploader
                        .hasValue()
                            ? false
                            : 'A header image must be specified.',
                    //finalize: () => this
                        //.imageUploader
                        //.saveImage(this.imageUploader.getName(`header_${document
                            //.getElementById('id')
                            //.value}`))
                },
                getElementBaseFields: type => [
                    {
                        title: "Type",
                        property: "type",
                        description: "",
                        render: value => <p style={{textTransform: 'capitalize'}}>{type}</p>,
                        get: () => type,
                        validate: () => false
                    },
                    ...idp
                ],
                textAlignmentField: {
                    title: "Alignment",
                    property: "alignment",
                    description: "",
                    render: value => <Input type="select" id="alignment" defaultValue={value || 'left'}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </Input>,
                    get: () => document
                        .getElementById('alignment')
                        .value,
                    validate: () => false
                }
            }
        this.fields = {
            elements_image: [
                ...this.fieldPresets.getElementBaseFields('image'), {
                    title: "Image",
                    property: "image",
                    description: "Click Clear to remove the image or click Reset to restore the original value.",
                    render: value => <ImageUploader ref={u => this.imageUploader = u} value={value}/>,
                    get: () => this.imageUploader.saveImage(`imageElement_${this
                        .getEditorInfo()
                        .parent}_${document
                        .getElementById('id')
                        .value}`),
                    validate: () => this
                        .imageUploader
                        .hasValue()
                            ? false
                            : 'An image must be specified.',
                    //finalize: () => this
                        //.imageUploader
                        //.saveImage(this.imageUploader.getName(`imageElement_${this.getEditorInfo().parent}_${document.getElementById('id').value}`))
                },
                {
                    title: "Enlargeable",
                    property: 'enlargeButton',
                    description: 'Choose whether to allow users to enlarge the image or download it.',
                    render: value => <FormGroup check>
                        <Label check>
                            <Input id="enlargeButton" type="checkbox" defaultChecked={value || false}/>{' '}
                            Include enlarge button
                        </Label>
                    </FormGroup>,
                    validate: () => false,
                    get: () => document.getElementById('enlargeButton').checked
                }
            ],
            elements_title: [
                ...this.fieldPresets.getElementBaseFields('title'), {
                    title: "Title",
                    property: "title",
                    description: "",
                    render: value => <Input id="title" defaultValue={value}/>,
                    get: () => document
                        .getElementById('title')
                        .value,
                    validate: () => document
                        .getElementById('title')
                        .value
                            ? false
                            : 'No title specified.'
                }, this.fieldPresets.textAlignmentField
            ],
            elements_text: [
                ...this.fieldPresets.getElementBaseFields('text'), {
                    title: "Text",
                    property: "text",
                    description: "",
                    render: value => <Input type="textarea" id="text" defaultValue={value}/>,
                    get: () => document
                        .getElementById('text')
                        .value,
                    validate: () => document
                        .getElementById('text')
                        .value
                            ? false
                            : 'No text specified.'
                }, this.fieldPresets.textAlignmentField
            ],
            elements_button: [
                ...this.fieldPresets.getElementBaseFields('button'), {
                    title: "Button",
                    property: "_buttonInfo",
                    description: "",
                    render: value => <ButtonConfiguration ref={c => this.buttonConfiguration = c} value={value}/>,
                    get: () => this
                        .buttonConfiguration
                        .getValue(),
                    validate: () => this
                        .buttonConfiguration
                        .validate()
                }
            ],
            elements_separator: [
                ...this.fieldPresets.getElementBaseFields('separator'), {
                    title: 'Visible',
                    property: 'visible',
                    description: 'If this box is checked, the separator will appear as a horizontal line.',
                    render: value => <FormGroup check>
                        <Label check>
                            <Input id="visible" defaultChecked={value || true} type="checkbox"/>{' '}
                            Visible
                        </Label>
                    </FormGroup>,
                    get: () => document
                        .getElementById('visible')
                        .checked,
                    validate: () => false
                }
            ],
            elements_video: [
                ...this.fieldPresets.getElementBaseFields('video'), {
                    title: 'Video Provider',
                    property: 'provider',
                    description: 'Select the service that is hosting the video.',
                    render: value => <Input type="select" id="provider" defaultValue={value || 'YouTube'}>
                        <option>YouTube</option>
                        <option>Vimeo</option>
                    </Input>,
                    get: () => document
                        .getElementById('provider')
                        .value,
                    validate: () => false
                }, {
                    title: 'Video ID',
                    property: 'videoId',
                    description: 'Specify the video\'s ID.',
                    render: value => <div>
                        <p>
                            To find the video ID, look at the video's URL:<br/>
                            <ul>
                                <li>YouTube (1): https://youtube.com/watch?v=<Badge color="primary">Video ID here</Badge></li>
                                <li>YouTube (2): https://youtu.be/<Badge color="primary">Video ID here</Badge></li>
                                <li>Vimeo: https://vimeo.com/<Badge color="primary">Video ID here</Badge></li>
                            </ul>
                            Copy that value into the box below.
                        </p>
                        <Input id="videoId" defaultValue={value}/>
                    </div>,
                    get: () => document
                        .getElementById('videoId')
                        .value,
                    validate: () => !document
                        .getElementById('videoId')
                        .value
                            ? 'No video ID specified.'
                            : false
                }
            ],
            tabs: [
                this.fieldPresets.idField, {
                    title: 'Index',
                    property: 'index',
                    description: 'This is a number which must be greater than or equal to 0.  Tabs will be sorted in ascending order according to this number.  If two or more tabs have the same index, they will be sorted by their ID.',
                    render: value => <Input type="number" id="index" defaultValue={value || "0"} min="0" step="1"/>,
                    get: () => parseInt(document.getElementById('index').value, 10),
                    validate: () => {
                        if (isNaN(parseInt(document.getElementById('index').value, 10))) 
                            return 'The index must be an integer'
                        if (parseInt(document.getElementById('index').value, 10) < 0) 
                            return 'The index must be greater than or equal to 0'
                        return false
                    }
                }, this.fieldPresets.titleField,
                this.fieldPresets.titleVisibilityField,
                this.fieldPresets.headerImageField, {
                    title: 'Header Visibility',
                    property: 'hideHeader',
                    description: 'Check this box to hide the header image on this tab\'s content page.',
                    render: value => <FormGroup check>
                        <Label check>
                            <Input id="hideHeader" type="checkbox" defaultChecked={value || false}/>{' '}
                            Hide header
                        </Label>
                    </FormGroup>,
                    get: () => document
                        .getElementById('hideHeader')
                        .checked,
                    validate: () => false
                }, {
                    title: 'Tab Visibility',
                    property: 'visibility',
                    description: 'Configure the visibility rules for this tab.',
                    render: value => <VisibilityRulesField ref={f => this.visibilityRules = f} value={value}/>,
                    get: () => this
                        .visibilityRules
                        .getValue(),
                    validate: () => this
                        .visibilityRules
                        .validate()
                }
            ],
            events: [
                this.fieldPresets.idField,
                this.fieldPresets.titleField,
                this.fieldPresets.titleVisibilityField,
                {
                    title: 'Description',
                    property: 'description',
                    description: 'Give a thourough description of this event.  Avoid stating the dates and times, location, price, and registration details because you will supply that information and it will be presented to the user.',
                    render: value => <Input id="description" type="textarea" defaultValue={value}/>,
                    get: () => document.getElementById('description').value,
                    validate: () => document.getElementById('description').value ? false : 'No description specified.'
                },
                this.fieldPresets.headerImageField,
                {
                    title: 'Date and Time',
                    property: 'dateTime',
                    description: 'Specify approximately when this event will begin and end.',
                    render: value => <DateRangeField ref={f => this.dateRangeField = f} startValue={value ? value.start : null} endValue={value ? value.end : null}/>,
                    get: () => this.dateRangeField.getValue(),
                    validate: () => this.dateRangeField.validate()
                },
                {
                    title: 'Hide End Date',
                    property: 'hideEndDate',
                    description: 'Specify whether to hide the end date in the app.  NOTE: this option is ignored if the event does not end on the same day that it started on.',
                    render: value => <FormGroup check>
                        <Label check>
                            <Input id="hideEndDate" type="checkbox" defaultChecked={value || false}/>{' '}
                            Hide end date
                        </Label>
                    </FormGroup>,
                    validate: () => false,
                    get: () => document.getElementById("hideEndDate").checked
                },
                {
                    title: 'Recurrence',
                    property: 'recurrence',
                    optional: true,
                    description: 'If this events repeats on a regular basis, confiugure that here.',
                    render: value => <RecurrenceField ref={f => this.recurrenceField = f} value={value}/>,
                    get: () => this.recurrenceField.getValue(),
                    validate: () => this.recurrenceField.validate()
                },
                {
                    title: 'Location',
                    property: 'location',
                    description: 'Specify the name of the place where this event will be held, such as "Veterans Park" or "Youth World".',
                    render: value => <Input id="location" defaultValue={value}/>,
                    get: () => document.getElementById('location').value,
                    validate: () => document.getElementById('location').value ? false : 'No location specified.'
                },
                {
                    title: 'Address',
                    property: 'address',
                    optional: true,
                    description: 'If necessary, specify the address of the place where this event will be held.  If you do, users will be able to get directions directly from the app.',
                    render: value => <Input id="address" defaultValue={value}/>,
                    get: () => document.getElementById('address').value,
                    validate: () => false
                },
                {
                    title: 'Registration',
                    property: 'registration',
                    optional: true,
                    description: 'If users need to RSVP and/or pay for this event, specify those details here.',
                    render: value => <RegistrationConfigurationField ref={f => this.registrationConfigurationField = f} value={value}/>,
                    get: () => this.registrationConfigurationField.getValue(),
                    validate: () => this.registrationConfigurationField.validate()
                }
            ],
            appearance_events: [
                this.fieldPresets.titleField,
                this.fieldPresets.titleVisibilityField,
                {
                    title: "Header Image",
                    property: "header",
                    description: "Specify a header image.  Click Clear to remove the image or click Reset to restore the original value.",
                    render: value => <ImageUploader ref={u => this.imageUploader = u} value={value}/>,
                    get: () => this.imageUploader.saveImage('header_appearance_events'),
                    validate: () => this
                        .imageUploader
                        .hasValue()
                            ? false
                            : 'A header image must be specified.',
                    //finalize: () => this
                        //.imageUploader
                        //.saveImage(this.imageUploader.getName('header_appearance_events'))
                }
            ]
        }
    }

    shouldComponentUpdate(p, s) {
        return false
    }

    createId() {
        return Math
            .random()
            .toString(36)
            .substr(2, 10)
            .toUpperCase()
    }

    renderField(field,
        data
    ) {
        return <FormGroup key={`${field.property}_${Math.random() * 1000}`}>
            <Label className="Label-title" for={field.property}>{field.title} {field.optional ? <Badge pill color="primary">Optional</Badge> : null}</Label>
            {
                field.description
                    ? <div>
                            <Label className="Label-description" for={field.property}>{field.description}</Label>
                        </div>
                    : null
            }
            {field.render(data[field.property])}
            <hr/>
        </FormGroup>
    }

    collect() {
        var promises = []
        var result = {}
        this.fields[this.getEditorInfo().category].forEach(f => {
            let value = f.get()
            if (value != null && typeof value.then === "function")
                promises.push(value.then(r => result[f.property] = r))
            else
                result[f.property] = value
        })
        return Promise.all(promises).then(() => result)
    }

    getEditorInfo() {
        var query = queryString.parse(window.location.search)
        var action = query.action
        var category = query.category
        if (!action || !category) 
            return null
        switch (action) {
            case 'new':
                return {action: action, category: category, parent: query.parent}
            case 'edit':
                var path = query.path
                if (!path) 
                    return null
                return {action: action, category: category, path: path, parent: query.parent}
            default:
                return null
        }
    }

    validate() {
        var errors = []
        var info = this.getEditorInfo()
        this
            .fields[info.category]
            .forEach(f => {
                var r;
                // eslint-disable-next-line
                if (r = f.validate()) {
                    if (Array.isArray(r)) 
                        errors.push(...r)
                    else 
                        errors.push(r)
                }
            })
        return errors
    }

    transform(data) {
        var info = this.getEditorInfo()
        return <div style={{
                margin: '0 1rem',
                paddingTop: '56px'
            }}>
            <Form>{
                    this
                        .fields[info.category]
                        .map(f => this.renderField(f,
                            data
                        ))
                }</Form>
        </div>
    }

    render() {
        var info = this.getEditorInfo()
        if (!info.path) 
            return this
                .transform
                .bind(this)({})
        return <ContentLoader path={new Path(info.path.split('/').filter(str => Boolean(str)))} transformer={this
                .transform
                .bind(this)}/>

    }
}