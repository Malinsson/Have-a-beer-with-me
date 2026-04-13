import AuthForm from "./AuthForm";

export const SignupForm = ({ formId = "signup-form", hideSubmitButton = false, onSuccess, onSwitchToLogin }) => {
    return (
        <AuthForm
            formId={formId}
            mode="signup"
            onModeChange={(nextMode) => {
                if (nextMode === "login") {
                    onSwitchToLogin?.();
                }
            }}
            onSuccess={onSuccess}
            hideSubmitButton={hideSubmitButton}
        />
    );
};

export default SignupForm;