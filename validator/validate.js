const validate = {
    validate_username : /^[a-zA-Z0-9]+$/,
    validate_email : /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validate_password : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    validate_phone_number : /^\+?[1-9]\d{1,14}$/
}

module.exports = validate;