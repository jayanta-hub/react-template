import { CustomEnqueueSnackbarProps } from "../types/custom-enqueue-snackbar/CustomEnqueueSnackbar";
import { enqueueSnackbar } from 'notistack';



export const priceConversion = (price: number) => {
    return price?.toFixed(2)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const capitalizeFirstLetter = (text: string) => {
    if (text?.length <= 0) return "Invalid Input"
    return text?.charAt(0) + text?.slice(1)?.toLowerCase()
}

export const formatApproverTypes = (types: string[]): string => {
    if (!types || types.length === 0) return "";

    // Optional: format each word to start with uppercase and add spacing
    const formatted = types.map(type =>
        type
            .replace(/([A-Z])/g, " $1") // Add space before capital letters
            .trim()                     // Remove leading/trailing spaces
            .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize each word
    );

    if (formatted.length === 1) return formatted[0];
    if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
    return `${formatted.slice(0, -1).join(", ")} and ${formatted[formatted.length - 1]}`;
};


export const getInitials = (name: string) => {
    if (!name) return '';

    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
};


export const toggleScroll = (isLocked: boolean) => {
    document.body.style.overflow = isLocked ? "hidden" : "auto";
}

export const removeBracketedText = (input: string) => {
    return input.replace(/\s*\(.*?\)\s*/g, '').trim();
}

export const customEnqueueSnackbar: CustomEnqueueSnackbarProps = (
    message,
    variant = 'success',
    horizontal = 'right',
    duration = 3000
) => {
    enqueueSnackbar(message, {
        variant,
        anchorOrigin: {
            vertical: 'bottom',
            horizontal,
        },
        autoHideDuration: duration
    });
};