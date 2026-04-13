import AuthForm from "./AuthForm";

export const LoginForm = ({ formId = "login-form", onSwitchToSignup, onSuccess, hideSubmitButton = false }) => {
    return (
        <AuthForm
            formId={formId}
            mode="login"
            onModeChange={(nextMode) => {
                if (nextMode === "signup") {
                    onSwitchToSignup?.();
                }
            }}
            onSuccess={onSuccess}
            hideSubmitButton={hideSubmitButton}
        />
    );
};

export default LoginForm;