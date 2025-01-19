import { useState } from "preact/hooks";

export function WriteVar(props) {
    const [value, setValue] = useState(props.value);
    const [dirty, setDirty] = useState(false);
    //const [updated, setUpdated] = useState(false);

    function onValueChange(value) {
        setValue(value);
        setDirty(true);
    }

    function renderInputType(type) {
        switch (type) {
            case "number":
                return <input {...props} onKeyUp={(e) => onValueChange(e.target.value)} onChange={(e) => onValueChange(e.target.value)} />
            case "boolean":
            case "checkbox":
                return <input {...props} checked={value} onChange={(e) => onValueChange(e.target.checked)} />
            default:
                return <input {...props} onKeyUp={(e) => onValueChange(e.target.value)} onChange={(e) => onValueChange(e.target.value)} />
        }

    }

    function commitValue() {
        if (props.onChanged) props.onChanged(value);
        setDirty(false);
    }

    return (
        <div class="write-var">
            {props.label && <div class="label">{props.label}</div>}
            <div class="value">
                {renderInputType(props.type)}
            </div>
            <div class="action">
                <button disabled={!dirty} onClick={(e) => commitValue()}>set</button>
            </div>
        </div>
    );
}
