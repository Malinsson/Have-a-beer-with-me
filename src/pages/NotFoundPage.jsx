// 404 not found page
import spilled404 from '../assets/images/spilled404.png';

export const NotFoundPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-6xl/normal mx-auto">404 - Page Not Found</h1>
            <img src={spilled404} alt="404 Not Found"
             className="mx-auto max-w-60 drop-shadow-lg/50" />
            <p className='my-4 mx-auto'>Oops! The page you are looking for does not exist.</p>
        </div>
    );
}