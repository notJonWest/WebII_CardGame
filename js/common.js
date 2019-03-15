let qs = sel => document.querySelector(sel);
let qsAll = sel => document.querySelectorAll(sel);

let checkLocalStorage = function()
{
    return ["fname", "lname", "username", "phone", "postal", "money"]
        .every(item => localStorage[item] !== undefined);
};