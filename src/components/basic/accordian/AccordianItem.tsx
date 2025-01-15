import './AccordianItem.scss';

export function AccordianItem({ title, id, open, children, onClick }) {

    return (
        <div class={`accordian-item ${open ? 'open' : ''}`}>
            <div class="title" onClick={(e) => {
                onClick(id);
            }}>
                {title} {id}
            </div>
            <div class="content">
                {children}
            </div>
        </div>
    );

}
