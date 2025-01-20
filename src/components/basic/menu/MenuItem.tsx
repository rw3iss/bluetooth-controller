import './MenuItem.scss';

export function MenuItem({ title, id, open, children, onClick }) {

    return (
        <div class={`menu-item ${open ? 'open' : ''}`}>
            <div class="title" onClick={(e) => {
                onClick(id);
            }}>
                {title}
            </div>
            <div class="content">
                {children}
            </div>
        </div>
    );

}
