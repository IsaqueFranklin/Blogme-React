export default function validateLogin(values) {
    let errors = {}

    //Email errors
    if(!values.email) {
        errors.email = "Email necessário"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Email inválido"
    }

    //Password errors
    if(!values.password) {
        errors.password = "Senha necessária"
    } else if (values.password.length < 8) {
        errors.password = "A senha precisa ter no mínimo 8 caracteres"
    }

    
    
    return errors;
}