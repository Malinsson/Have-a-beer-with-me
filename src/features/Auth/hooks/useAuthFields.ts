import { useState } from "react";

export const useAuthFields = () => {

const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>('');

const reset = () => {
setEmail("");
setPassword("");
};

return { email, setEmail, password, setPassword, reset };
};
