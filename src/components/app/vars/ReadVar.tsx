export function ReadVar({ label, value }) {
    return (
        <div class="read-var">
            {label && <div class="label">{label}</div>}
            <div class="value">{value}</div>
        </div>
    );
}