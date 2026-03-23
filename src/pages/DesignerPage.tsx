import CanPreview3D from '../features/can-designer/components/CanPreview3D.tsx'

// Both edit and create file

export const DesignerPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1>Beer Can Editor</h1>
            {/* Editor content will go here */}
            <div className='can-preview-container'>
                <CanPreview3D />
            </div>
        </div>
    );
}