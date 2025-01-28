import { useState } from 'preact/hooks';
import { Button } from '../../basic/button/Button';

function AutomationRead({ automation, onEdit, onRemove }) {
    return (
        <div class="add-automation">
            <div class="time">
                Time: <input type="text" />
            </div>
            <div class="action">
                Action:
                <select>
                    <option value="set-temperature">Set Temperature</option>
                </select>
            </div>
            <div class="value">
                Value: {automation.value}
            </div>
            <div class="button">
                <Button onClick={() => onEdit(automation)}>Edit</Button>
                <Button onClick={() => onRemove(automation)}>X</Button>
            </div>
        </div>
    );
}

function AutomationEdit({ automation, onSave }) {
    return (
        <div class="add-automation">
            <div class="time">
                Time: <input type="text" />
            </div>
            <div class="action">
                Action:
                <select>
                    <option value="set-temperature">Set Temperature</option>
                </select>
            </div>
            <div class="value">
                Value: <input type="text" />
            </div>
            <div class="button">
                <Button onClick={() => onSave(automation)}>Save</Button>
            </div>
        </div>
    );
}

export function Automations({ automations, onAdd, onRemove }) {
    const [editAutomation, setEditAutomation] = useState(undefined);

    function onSaveAutomation(a) {
    }

    function onRemoveAutomation(a) {
    }

    function onEditAutomation(a) {
        setEditAutomation(a);
    }

    function addAutomation() {
        console.log(`add automation`)
        if (onAdd) onAdd({})
    }

    function removeAutomation() {
        console.log(`remove automation`)
        if (onRemove) onRemove({})
    }

    return (
        <div class="manage-automations">
            <AutomationEdit automation={editAutomation} onSave={onSaveAutomation} />
            <div class="automations">
                {automations.map(a => <AutomationRead automation={a} onEdit={onEditAutomation} onRemove={onRemoveAutomation} />)}
            </div>
        </div>

    );
}