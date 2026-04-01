import { useState } from "react";

export const useAuthFields = () => {

const [email, setEmail] = useState("");
const [password, setPassword] = useState('');

const reset = () => {
setEmail("");
setPassword("");
};

return { email, setEmail, password, setPassword, reset };
};
