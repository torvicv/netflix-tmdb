import { NavLink } from 'react-router-dom';
import netflix from './../assets/netflix.png';
import { createRef, MouseEvent, useRef, useEffect } from 'react';
import axios from 'axios';

const Menu = (props) => {

    const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + import.meta.env.VITE_API_KEY,
        },
    };

    const checkOpenSearch = useRef(false);
    // búsqueda de películas.
    const search = createRef();
    const onSearch = () => {
        const text = search.current as HTMLInputElement

        if (text.value.trim() === '') {
            props.onChildResponse(null);
            return;
        }
        // enviar la petición a la API para buscar películas con el texto ingresado.
        axios('https://api.themoviedb.org/3/search/movie?query='+text.value+'&include_adult=false&language=en-US&page=1', options)
            .then(response => {
                console.log(response);
                
                props.onChildResponse(response)
            })
            .catch(err => console.error(err));        
    }

    // abrir y cerrar el input de búsqueda.
    const onCloseSearch = () => {
        const element = document.querySelector('.searching');
        
        if (element && checkOpenSearch.current) {
            element?.classList.remove('searching');
            element?.children[1].classList.remove('w-[170px]');
            checkOpenSearch.current = false;
        }
    }

    useEffect(() => {
        const handleClick = (event) => {
            const element = event.target as HTMLElement;
            if (!element.closest('.searching')) {
                onCloseSearch();
            }
        }

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);


    const onOpenSearch = (e: MouseEvent) => {
        const element = e.target as HTMLElement;

        if (element) {
            const parent = element.parentElement?.parentElement;
            parent?.classList.add('searching');
            parent?.children[1].classList.add('w-[170px]');
            checkOpenSearch.current = true;
        }

        setTimeout(() => {
            checkOpenSearch.current = true;
        }, 0);
    }

    return (
        <>
            <div className='fixed flex justify-between items-center top-0 left-0 z-50 w-full py-4 px-10 bg-gradient-to-b from-black to-transparent'>
                <ul className='flex items-center gap-6 text-lg text-gray-400'>
                    <li>
                        <NavLink to="home">
                            <img src={netflix} alt="Netflix" className="h-16 w-32" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="home" className={({ isActive }) =>
                      isActive
                        ? "text-white"
                        : ""}>
                            Inicio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="series" className={({ isActive }) =>
                      isActive
                        ? "text-white"
                        : ""}>
                            Series
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="movies" className={({ isActive }) =>
                      isActive
                        ? "text-white"
                        : ""}>
                            Películas
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="more-views" className={({ isActive }) =>
                      isActive
                        ? "text-white"
                        : ""}>
                            Novedades más vistas
                        </NavLink>
                    </li>
                </ul>
                <div className='text-white flex items-center gap-3'>
                    {/* lupa */}
                    <div className='flex items-center gap-1 border-white'>
                        <div onClick={(e) => onOpenSearch(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        {/* cuadro de búsqueda */}
                        <div className='w-0'>
                            <input className='bg-transparent w-full border-0 outline-0' 
                                ref={search} onKeyUp={onSearch} type="text" 
                                name="search" id="search" 
                                placeholder='Títulos' />
                        </div>
                    </div>
                    {/* campana */}
                    <div  className='relative group'>
                        {/* badge */}
                        <div className="font-bold absolute bg-red-600 rounded-full h-3 w-3 flex justify-center items-center top-[-2px] right-[-1px] text-[9px]">1</div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                        {/* notificación */}
                        <div className='group-hover:block hidden absolute top-full border-0 border-t-2 border-white  right-0 w-64 border'>
                            <div className='border-[0.75px] border-gray-400 p-2'>
                                Ejemplo de notificación.
                            </div>
                        </div>
                    </div>
                    {/* usuario */}
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Menu;
