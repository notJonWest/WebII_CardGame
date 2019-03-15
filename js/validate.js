if (checkLocalStorage())
    location.href = "game.html";

let validateUserForm = function(e)
{
    if (e instanceof Event)
        e.preventDefault(); //Don't want query string
    let isValid = $("#userForm").valid();
    if (!isValid) //Flash red if invalid
    {
        $("input.error").addClass("invalid");
        setTimeout(() => $("input.error").removeClass("invalid"), 1000);
    }
    else
    {
        [...qsAll("#userForm input[type='text']")].forEach(
            item=>localStorage[item.name] = item.value);
        location.href = "game.html";
    }
    return isValid;
};

$(function()
{
    $.validator.addMethod("regex", function(val, el, regex){
        return this.optional(el) || regex.test(val);
    }, "Input is invalid");
    $("#userForm").validate({
        rules: {
            fname: {
                required: true,
                minlength: 1,
                maxlength: 20,
                regex: /^[a-zA-Z]['\s\-a-zA-Z]{0,19}$/
            },
            lname: {
                required: true,
                minlength: 1,
                maxlength: 30,
                regex: /^[a-zA-Z]['\s\-a-zA-Z]{0,29}$/
            },
            username: {
                required: true,
                maxlength: 5,
                regex: /^[a-z]\d{3}[A-B]$/
            },
            phone: {
                required: true,
                minlength: 12,
                maxlength: 14,
                regex: /^((\d{3}\.){2}\d{4})|(\(\d{3}\)\s\d{3}-\d{4})$/
            },
            postal: {
                required: true,
                minlength: 7,
                maxlength: 7,
                regex: /^[a-zA-Z]\d[a-zA-Z]\s\d[a-zA-Z]\d$/
            },
            money: {
                required: true,
                number: true,
                min: 5,
                max: 5000
            }
        },
        messages: {
            fname: {
                regex: "This field may only contain letters, spaces, apostrophes, and hyphens."
            },
            lname: {
                regex: "This field may only contain letters, spaces, apostrophes, and hyphens."
            },
            username: {
                regex: "This field must begin with a lowercase letter, followed by 3 numbers, and end with a capital A or B"
            },
            phone: {
                regex: "Must be in the format of (###) ###-####, or ###.###.####"
            },
            postal: {
                regex: "Must be in the format of X#X #X#"
            },
            money: {
                max: "You may only input a maximum of $5000",
                min: "You must have a minimum of $5"
            }
        }
    });
    $("#userForm").on("submit", validateUserForm);
    $("#postal").on("input", (e)=>e.target.value = e.target.value.toUpperCase());
});