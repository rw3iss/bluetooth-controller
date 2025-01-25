import { useState } from "preact/hooks";

export function InputVar({ type, label, value, min, max, onChanged }) {
    const [editValue, setEditValue] = useState(value);
    const [dirty, setDirty] = useState(false);
    //const [updated, setUpdated] = useState(false);

    function onValueChange(value) {
        setEditValue(value);
        setDirty(true);
    }

    function onKeyUp(e) {
        onValueChange(e.target.value)
        if (e.key == 'Enter') commitValue();
    }

    function renderInputType(type) {
        switch (type) {
            case "number":
                return <input type={type} value={editValue} min={min || 0} max={max} onKeyUp={onKeyUp} onChange={(e) => onValueChange(e.target.value)} />
        }

    }

    function commitValue() {
        onChanged(editValue);
        setDirty(false);
    }

    return (
        <div class="input-var">
            {label && <div class="label">{label}</div>}
            <div class="value">
                {renderInputType(type)}
            </div>
            <div class="action">
                <button disabled={!dirty} onClick={(e) => commitValue()}>set</button>
            </div>
        </div>
    );
}
