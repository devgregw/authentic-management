import React, {useState} from 'react'
import { FormGroup, Input, Collapse, Label } from "reactstrap";
import Checkbox from "./Checkbox";

export default function PasswordField(props) {
    let alreadyHasPassword = !!props.value
    let [changePassword, setChangePassword] = useState(!alreadyHasPassword)
    let [enabled, setEnabled] = useState(alreadyHasPassword)
    console.log(alreadyHasPassword, changePassword, enabled)
    return <div>
        <Input type="hidden" id="tab_password_current" readOnly value={alreadyHasPassword ? props.value : ''} />
        <Checkbox title="Enable Password" id="tab_password_enabled" checked={enabled} onChange={e => setEnabled(e.currentTarget.checked)}/>
        <Collapse isOpen={enabled && alreadyHasPassword}>
            <Checkbox id="tab_password_change" title="Change Password" checked={changePassword} onChange={e => setChangePassword(e.currentTarget.checked)}/>
        </Collapse>
        <Collapse isOpen={enabled && (alreadyHasPassword ? changePassword : true)} unmountOnExit mountOnEnter>
            <hr/>
            <Label>Enter Password</Label>
            <Input type="password" id="tab_password"/>
            <Label>Confirm Password</Label>
            <Input type="password" id="tab_password_confirm" />
        </Collapse>
    </div>
}