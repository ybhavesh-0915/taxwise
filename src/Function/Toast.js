import React from 'react'
import toast from 'react-hot-toast'
const Toast = (type, msg) => {
    toast[type](msg, {
        duration: 4000,
        position: 'bottom-center',
        ariaProps: {
            role: 'status',
            'aria-live': 'polite',
        },
        removeDelay: 1000,
        toasterId: 'default',
    });
}

export default Toast