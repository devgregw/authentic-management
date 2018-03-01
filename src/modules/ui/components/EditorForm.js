import React from 'react'
import * as queryString from 'query-string'
import {FormGroup, Label, Input, Form, Badge, InputGroup, InputGroupAddon} from 'reactstrap'
import ContentLoader from './ContentLoader'
import Path from '../../classes/Path.js'
import ButtonConfiguration from './ButtonConfiguration.js'
import ImageUploader from './ImageUploader'
import VisibilityRulesField from './VisibilityRulesField'
import DateRangeField from './DateRangeField'
import RecurrenceField from './RecurrenceField'

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
            render: value => <Input id="id" defaultValue={value || this.createId()} readOnly="readOnly"/>,
            get: () => document
                .getElementById('id')
                .value
        }
        var idp = [
            id, {
                title: "Parent ID",
                property: "parent",
                description: "",
                render: value => <Input id="parent" defaultValue={this
                        .getEditorInfo()
                        .parent} readOnly="readOnly"/>,
                get: () => document
                    .getElementById('parent')
                    .value
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
                        .value
                },
                headerImageField: {
                    title: "Header Image",
                    property: "header",
                    description: "Specify a header image.  Click Clear to remove the image or click Reset to restore the original value.",
                    render: value => <ImageUploader ref={u => this.imageUploader = u} value={value}/>,
                    get: () => `header_${document
                        .getElementById('id')
                        .value}` +
                                this
                        .imageUploader
                        .getExtension(),
                    validate: () => this
                        .imageUploader
                        .hasValue()
                            ? false
                            : 'A header image must be specified.',
                    finalize: () => this
                        .imageUploader
                        .saveImage(`header_${document.getElementById('id').value}`)
                },
                getElementBaseFields: type => [
                    {
                        title: "Type",
                        property: "type",
                        description: "",
                        render: value => <p style={{textTransform: 'capitalize'}}>{type}</p>,
                        get: () => type
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
                    get: () => `imageElement_${this
                        .getEditorInfo()
                        .parent}_${document
                        .getElementById('id')
                        .value}` +
                                this
                        .imageUploader
                        .getExtension(),
                    validate: () => this
                        .imageUploader
                        .hasValue()
                            ? false
                            : 'An image must be specified.',
                    finalize: () => this
                        .imageUploader
                        .saveImage(`imageElement_${this.getEditorInfo().parent}_${document.getElementById('id').value}`)
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
                    validate: value => this
                        .buttonConfiguration
                        .validate()
                }
            ],
            elements_separator: [
                ...this.fieldPresets.getElementBaseFields('separator'), {
                    title: 'Visible',
                    property: 'visible',
                    description: 'If this box is checked, the separator will appear as a horizontal line.',
                    render: value => <FormGroup check="check">
                        <Label check="check">
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
                        .value
                }, {
                    title: 'Video ID',
                    property: 'videoId',
                    description: 'Specify the video\'s ID.',
                    render: value => <Input id="videoId" defaultValue={value}/>,
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
                    get: () => parseInt(document.getElementById('index').value,
                        10
                    ),
                    validate: value => {
                        if (isNaN(value)) 
                            return 'The index must be an integer'
                        if (value < 0) 
                            return 'The index must be greater than or equal to 0'
                        return false
                    }
                }, this.fieldPresets.titleField, {
                    title: 'Title Visibility',
                    property: 'hideTitle',
                    description: 'Check this box to hide the title on the tab\'s card on the home screen.  This is useful when the header image already contains the title.',
                    render: value => <FormGroup check="check">
                        <Label check="check">
                            <Input id="hideTitle" type="checkbox" defaultChecked={value || false}/>{' '}
                            Hide title
                        </Label>
                    </FormGroup>,
                    get: () => document
                        .getElementById('hideTitle')
                        .checked,
                    validate: () => false
                }, this.fieldPresets.headerImageField, {
                    title: 'Header Visibility',
                    property: 'hideHeader',
                    description: 'Check this box to hide the header image on this tab\'s content page.',
                    render: value => <FormGroup check="check">
                        <Label check="check">
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
                {
                    title: 'Description',
                    property: 'description',
                    render: value => <Input type="textarea" defaultValue={value || ''} id="description"/>,
                    get: () => document.getElementById('description').value,
                    validate: () => document.getElementById('description').value ? false : 'No description specified.'
                },
                this.fieldPresets.headerImageField,
                {
                    title: 'Date',
                    property: 'date',
                    render: value => <DateRangeField ref={f => this.dateRangeField = f} startValue={value ? value.start : null} endValue={value ? value.end : null}/>,
                    get: () => this.dateRangeField.getValue(),
                    validate: () => this.dateRangeField.validate()
                },
                {
                    title: 'Recurrence',
                    property: 'recurrence',
                    render: value => <RecurrenceField ref={rf => this.rf = rf} value={value}/>,
                    get: () => this.rf.getValue(),
                    validate: () => this.rf.validate()
                },
                {
                    title: 'Location',
                    property: 'location',
                    render: value => <Input type="text" id="location" defaultValue={value}/>,
                    get: () => document.getElementById('location').value,
                    validate: () => document.getElementById('location').value ? false : 'No location specified.'
                },
                {
                    title: 'Address',
                    description: 'To allow users to instantly get directions to this event, provide an address.',
                    property: 'address',
                    optional: true,
                    render: value => <Input type="address" id="address" defaultValue={value}/>,
                    get: () => document.getElementById('address').value,
                    validate: () => false
                },
                {
                    title: 'Price',
                    description: 'Set to 0 if the event is free.',
                    property: 'price',
                    render: value => <InputGroup>
                    <InputGroupAddon addonType="prepend">USD</InputGroupAddon>
                        <Input type="number" id="price" defaultValue={value || 0} min="0" step="0.01"/>
                    </InputGroup>,
                    get: () => parseFloat(document.getElementById('price').value),
                    validate: () => isNaN(parseFloat(document.getElementById('price').value)) ? 'An invalid price was specified.' : false
                }
            ]
        }
    }

    shouldComponentUpdate(p,
        s
    ) {
        return false
    }

    createId() {
        return Math
            .random()
            .toString(36)
            .substr(2,
                10
            )
            .toUpperCase()
    }

    renderField(field,
        data
    ) {
        return <FormGroup>
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

    finalize() {
        var promises = []
        this
            .fields[
                this
                    .getEditorInfo()
                    .category
            ]
            .forEach(f => {
                if (f.finalize) 
                    promises.push(f.finalize())
            })
        return Promise.all(promises)
    }

    collect() {
        var final = {}
        this
            .fields[
                this
                    .getEditorInfo()
                    .category
            ]
            .forEach(f => final[f.property] = f.get())
        return final
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
                if (f.validate) {
                    var r;
                    // eslint-disable-next-line
                    if (r = f.validate(f.get())) {
                        if (Array.isArray(r)) 
                            errors.push(...r)
                        else 
                            errors.push(r)
                    }
                } else if (!f.get()) 
                    errors.push(`No ${f.title.toLowerCase()} specified`)
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
        return <ContentLoader path={new Path(info.path.split('/').filter(str => !!str))} transformer={this
                .transform
                .bind(this)}/>

    }
}