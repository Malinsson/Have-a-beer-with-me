export const HomePage = () => {
    return (
        <div className="container mx-auto p-4">
            <div>
                <h2>Ta en öl* med oss</h2>
                <h2>Onsdag 22/4</h2>
                <a className="bg-blue-500"
                    href="">Bygg din öl nu 
                    <i className="fa-solid fa-arrow-right"></i>
                </a>

            </div>
            <div className="carusel mt-8">
                <div className="carusel-item">
                    <img src="/assets/can1.png" alt="Can 1" className="w-full h-auto rounded-lg shadow-md" />
                </div>
                <div className="carusel-item">
                    <img src="/assets/can2.png" alt="Can 2" className="w-full h-auto rounded-lg shadow-md" />
                </div>
                <div className="carusel-item">
                    <img src="/assets/can3.png" alt="Can 3" className="w-full h-auto rounded-lg shadow-md" />
                </div>
            </div>
            <div>
                <p>Vi bjuder på unika virituella öl och dryck - gör det personligt..... Skapa din öl redan nu!</p>
                <a className="bg-blue-500"
                    href="">Bygg din öl nu 
                    <i className="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>
    );
}