import * as moment from 'moment';

/**
 * Replaces Windows reserved characters with specified string
 * @param str string to perform operation on
 * @param replaceWith string to replace special characters with 
 */
export const ReplaceWindowsReservedCharacters = (str: string, replaceWith: string) => {
    return str.replace(/[<>:"/\\|?*]/g, ' ');
}


/**
 * Get timestamp for current time.
 * Generally used when generating files
 */
export const GetTimestamp = (): string => {
    return moment().format('x');
}