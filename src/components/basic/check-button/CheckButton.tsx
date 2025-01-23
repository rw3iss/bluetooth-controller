
import { useState } from 'preact/hooks';

interface CheckButtonProps {
    label: string;
    onSelect: () => void;
    onVisibilityChange: (checked: boolean) => void;
    visible: boolean;
}

import { FunctionalComponent } from 'preact';

interface CheckButtonProps {
    label: string;
    onSelect: () => void;
    onVisibilityChange: (checked: boolean) => void;
    visible: boolean;
}

export const CheckButton: FunctionalComponent<CheckButtonProps> = ({ label, onSelect, onVisibilityChange, visible }) => {
    // Use local state to manage the checkbox state
    const [isChecked, setIsChecked] = useState(visible);

    // Handle click on the button
    const handleClick = (e) => {
        if (e.target.type == 'checkbox') return;
        onSelect();
    };

    // Handle change on the checkbox
    const handleCheck = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setIsChecked(target.checked);
        onVisibilityChange(target.checked);
    };

    return (
        <div class="check-button button" onClick={handleClick}>
            <div class="label">{label}</div>
            <input class="checkbox"
                type="checkbox"
                checked={isChecked}
                onChange={handleCheck}
            />
        </div>
    );
};