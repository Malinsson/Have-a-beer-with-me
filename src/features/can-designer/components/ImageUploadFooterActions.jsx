import { Button } from "../../../components/Button";

export const ImageUploadFooterActions = ({
    step,
    uploading,
    preparingPreview,
    hasCrop,
    onCancel,
    onBack,
    onNext,
    onUpload,
}) => {
    const isCropStep = step === "crop";

    return (
        <div className="mt-4 flex items-center justify-between gap-3">
            {isCropStep ? (
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outlined"
                    text="Avbryt"
                />
            ) : (
                <Button
                    type="button"
                    onClick={onBack}
                    variant="outlined"
                    text="Tillbaka"
                />
            )}

            {isCropStep ? (
                <Button
                    type="button"
                    onClick={onNext}
                    variant="primary"
                    text={preparingPreview ? "Förbereder..." : "Nästa"}
                    disabled={!hasCrop || preparingPreview}
                />
            ) : (
                <Button
                    type="submit"
                    onClick={onUpload}
                    disabled={uploading || !hasCrop}
                    text={uploading ? "Laddar upp..." : "Ladda upp"}
                    variant="primary"
                />
            )}
        </div>
    );
};
