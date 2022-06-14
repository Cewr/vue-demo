export function downloadTxt(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `${filename}.json`);
    element.click();
}

export function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(textToCopy);
    } else {
        const ele = document.createElement('textarea');
        ele.setAttribute('readonly', 'readonly');
        ele.value = text;
        document.body.appendChild(ele);
        ele.select();
        return new Promise((res, rej) => {
            document.execCommand("Copy") ? res() : rej();
            ele.remove()
        })
    }
}

export const strSplit = (str) => str?.split(/[^a-zA-Z\u4e00-\u9fa5]/).filter((i) => !!i) || [];