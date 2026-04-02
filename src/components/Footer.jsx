import bomarkeWhiteLogo from '../assets/images/logo/bomarke-white.png';

export const Footer = () => {
    return (
        <footer className="bg-yrgo-red p-4 pt-30 mt-auto w-full">
            <div className='flex justify-end'>
                <img 
                    src={bomarkeWhiteLogo} 
                    alt="Bomarke Logo" 
                />
            </div>
        </footer>
    );
}
