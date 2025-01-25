import { useState } from "preact/hooks";

export function InputVar(props) {
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
                return <input {...props} value={value} min={props.minValue || 0} max={props.max} onKeyUp={(e) => onValueChange(e.target.value)} onChange={(e) => onValueChange(e.target.value)} />
        }

    }

    function commitValue() {
        if (props.onChanged) props.onChanged(value);
        setDirty(false);
    }

    return (
        <div class="input-var">
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
