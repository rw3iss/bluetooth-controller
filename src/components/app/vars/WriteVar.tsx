import { useState } from "preact/hooks";

export function WriteVar(props) {
    const [value, setValue] = useState(props.value);
    const [dirty, setDirty] = useState(false);
    //const [updated, setUpdated] = useState(false);

    function onValueChange(value) {
        setValue(value);
        setDirty(true);
        console.log(`value change`, value)
    }

    function renderInputType(type) {
        switch (type) {
            case "number":
                return <input {...props} onKeyUp={(e) => onValueChange(e.target.value)} onChange={(e) => onValueChange(e.target.value)} />
            case "boolean":
                return <input {...props} onChange={(e) => onValueChange(e.target.checked)} />
            default:
                return <input {...props} onKeyUp={(e) => onValueChange(e.target.value)} onChange={(e) => onValueChange(e.target.value)} />
        }

    }

    function updateValue() {
        if (props.onChanged) props.onChanged(value);
        setDirty(false);
        // setUpdated(true);
        // setTimeout(() => {
        //     setUpdated(false);
        // }, 3000)
    }

    return (
        <div class="write-var">
            {props.label && <div class="label">{props.label}</div>}
            <div class="value">
                {renderInputType(props.type)}
            </div>
            <div class="action">
                <button disabled={!dirty} onClick={(e) => updateValue()}>set</button>
            </div>
        </div>
    );
}
