import toastr from 'toastr';

export function notification(message, type?, timeout?) {

    // todo, set options elsewhere/on init ?
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": timeout ? timeout : "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    toastr.clear();

    switch (type) {
        case 'error':
            return toastr.error(message);
        case 'success':
            return toastr.success(message);
        default:
            return toastr.success(message);
    }
}

// Usage:

import notify from 'notify';

notify('Message', 'success', 2000);