import { Button } from "../../../../shared/components/Button.jsx";

export const CanActionSection = ({
    isOwnProfile,
    isSaved,
    onEditCan,
    onOpenShelf,
    onOpenMyCan,
    onSaveCan,
    onOpenSavedShelf,
}) => {
    return (
        <div className="flex gap-4 mt-6">
            {isOwnProfile ? (
                <>
                    <Button
                        text="Editera burk"
                        onClick={onEditCan}
                        variant="outlined"
                        showIcon={false}
                    />
                    <Button
                        text="Barhyllan"
                        onClick={onOpenShelf}
                        showIcon={false}
                    />
                </>
            ) : (
                <>
                    <Button
                        text="Min burk"
                        onClick={onOpenMyCan}
                        variant="outlined"
                        showIcon={false}
                    />
                    <Button
                        text={isSaved ? "Barhyllan" : "Spara burk"}
                        onClick={isSaved ? onOpenSavedShelf : onSaveCan}
                        showIcon={false}
                    />
                </>
            )}
        </div>
    );
};
