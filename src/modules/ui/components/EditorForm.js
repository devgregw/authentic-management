import React from 'react'
import * as queryString from 'query-string'
import {
    FormGroup,
    Label,
    Input,
    Form
} from 'reactstrap'
import ContentLoader from './ContentLoader'
import Path from '../../classes/Path.js'
import ButtonConfiguration from './ButtonConfiguration.js'

export default class EditorForm extends React.Component {
    constructor(props) {
        super(props)
        this.collect = this.collect.bind(this)
        this.validate = this.validate.bind(this)
        this.state = {actionCheckbox: false}
    }

    shouldComponentUpdate(p, s) {
        return false
    }

    createId() {
        return Math.random().toString(36).substr(2, 10).toUpperCase()
    }

    renderField(field,
        data
    ) {
        return <FormGroup>
            <Label className="Label-title" for={field.property}>{field.title}</Label>
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

    supplementalValidators = {
        bundles: collection => !collection.image && !collection.title && !collection.text && !collection._buttonInfo ? ['A bundle must have an image, a title, text, a button, or any combination of the properties.'] : false
    }

    fields = {
        bundles: [
            {
                title: "ID",
                property: "id",
                description: "This is a unique identifier.  It cannot be changed.",
                render: value => <Input id="id" defaultValue={value || this.createId()} readOnly/>,
                get: () => document
                    .getElementById('id')
                    .value
            },
            {
                title: "Parent ID",
                property: "parent",
                description: "",
                render: value => <Input id="parent" defaultValue={this.getEditorInfo().parent} readOnly/>,
                get: () => document
                    .getElementById('parent')
                    .value
            },
            {
                title: 'Index',
                property: 'index',
                description: 'This is a number which must be greater than or equal to 0.  Tabs will be sorted in ascending order according to this number.  If two or more tabs have the same index, they will be sorted by their ID.',
                render: value => <Input type="number" id="index" defaultValue={value || "0"} min="0" step="1"/>,
                get: () => parseInt(document.getElementById('index').value, 10),
                validate: value => {
                    if (isNaN(value))
                        return 'The index must be an integer'
                    if (value < 0)
                        return 'The index must be greater than or equal to 0'
                    return false
                }
            },
            {
                title: "Image",
                property: "image",
                description: "",
                render: value => <Input id="image" defaultValue={value}/>,
                get: () => document
                    .getElementById('image')
                    .value,
                    validate: () => false
            },
            {
                title: "Title",
                property: "title",
                description: "",
                render: value => <Input id="title" defaultValue={value}/>,
                get: () => document
                    .getElementById('title')
                    .value,
                    validate: () => false
            },
            {
                title: "Text",
                property: "text",
                description: "",
                render: value => <Input type="textarea" id="text" defaultValue={value}/>,
                get: () => document
                    .getElementById('text')
                    .value,
                    validate: () => false
            },
            {
                title: "Button",
                property: "_buttonInfo",
                description: "",
                render: value => <ButtonConfiguration ref={c => this.buttonConfiguration = c} value={value}/>,
                get: () => this.buttonConfiguration.getValue(),
                validate: value => this.buttonConfiguration.validate()
            }
        ],
        tabs: [
            {
                title: "ID",
                property: "id",
                description: "This is a unique identifier.  It cannot be changed.",
                render: value => <Input id="id" defaultValue={value || this.createId()} readOnly/>,
                get: () => document
                    .getElementById('id')
                    .value
            },
            {
                title: 'Index',
                property: 'index',
                description: 'This is a number which must be greater than or equal to 0.  Tabs will be sorted in ascending order according to this number.  If two or more tabs have the same index, they will be sorted by their ID.',
                render: value => <Input type="number" id="index" defaultValue={value || "0"} min="0" step="1"/>,
                get: () => parseInt(document.getElementById('index').value, 10),
                validate: value => {
                    if (isNaN(value))
                        return 'The index must be an integer'
                    if (value < 0)
                        return 'The index must be greater than or equal to 0'
                    return false
                }
            },
            {
                title: "Title",
                property: "title",
                description: "",
                render: value => <Input id="title" defaultValue={value}/>,
                get: () => document
                    .getElementById('title')
                    .value
            }, {
                title: "Header",
                property: "header",
                description: "The tab's background image",
                render: value => <Input id="header" defaultValue={value}/>,
                get: () => document
                    .getElementById('header')
                    .value
            }
        ]
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
        this.fields[info.category].forEach(f => {
            if (f.validate) {
                var r;
                // eslint-disable-next-line
                if (r = f.validate(f.get())) {
                    if (Array.isArray(r))
                        errors.push(...r)
                    else
                        errors.push(r)
                }
            }
            else
                if (!f.get())
                    errors.push(`No ${f.title.toLowerCase()} specified`)
        })
        if (!errors.length)
            if (this.supplementalValidators[info.category])
                errors = this.supplementalValidators[info.category](this.collect())
        return errors
    }

    transform(data) {
        var info = this.getEditorInfo()
        return <div style={{
            margin: '0 1rem',
            paddingTop: '56px'
        }}><Form>{
            this
                .fields[info.category]
                .map(f => this.renderField(f,
                    data
                ))
        }</Form></div>
    }

    render() {
        var info = this.getEditorInfo()
        if (!info.path)
        return this.transform.bind(this)({})
        return <ContentLoader path={new Path(info.path.split('/').filter(str => !!str))} transformer={this
            .transform
            .bind(this)}/>
        
    }
}