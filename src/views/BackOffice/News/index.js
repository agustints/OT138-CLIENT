import React, { useEffect, useState } from 'react';
import Table from '../../../components/Table';
import moment from 'moment';
import { 
    getAllNews as getAllNewsService,
    deleteEntry as deleteEntryService
} from '../../../services/requests/news';
import toast from 'react-hot-toast';
import { Button, ButtonGroup } from '../../../components/Inputs';
import { Content } from '../../../components/Wrappers/Containers';
import Pagination from "../../../components/Pagination";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { TailSpin } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import Modal, {
    ModalBody,
    ModalHeader,
    ModalTitle,
} from '../../../components/Modal';
import { HeaderButtons, AddButton } from '../../../styles/BackOffice';

export default function News() {
    const [news, setNews] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [lockedEntryIds, setLockedEntryIds] = useState([]);

    useEffect(() => {
        getNews(currentPage);
    }, []);

    async function getNews(page) {
        const {
            success,
            data: newsData,
            errorMessage,
        } = await getAllNewsService(page);

        if (success) {
            const { items, ...pagination } = newsData;
            setNews(items);
            setPagination(pagination);
        } else {
            toast.error('Error al obtener novedades: ' + errorMessage);
        }
    }

    async function goToPage(page) {
        setCurrentPage(page);
        getNews(page);
    }

    function showEntryContent(content) {
        Swal.fire({
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: "Cerrar",
            title: 'Contenido',
            text: content,
        });
    }

    function showEntryPicture(url) {
        Swal.fire({
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: "Cerrar",
            imageUrl: url,
            imageAlt: 'Entry image'
        });
    }

    async function onDeleteEntry(id) {
        const result = await Swal.fire({
            title: 'Confirmar eliminación',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            icon: 'warning',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: 'red',
        });
    
        if (result.isConfirmed) {
            setLockedEntryIds(state => [...state, id]);
    
            const { success, errorMessage } = await deleteEntryService(id);
    
            if (success) {
                setNews((state) =>
                    state.filter(entry => entry.id !== id)
                );
            } else {
                toast.error('Error al eliminar entrada: ', errorMessage);
            }
    
            setLockedEntryIds((state) =>
                state.filter(entryId => entryId !== id)
            );
        }
    }

    return (
        <>
            <Content>
                <h2>Novedades</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Contenido</th>
                            <th>Imagen</th>
                            <th>Creado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            news.map((entry, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{entry.name}</td>
                                        <td>
                                            <Button
                                                style={showButtonStyle}
                                                onClick={() => showEntryContent(entry.content)}
                                            >
                                                Ver
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                style={showButtonStyle}
                                                onClick={() => showEntryPicture(entry.image)}
                                            >
                                                Ver
                                            </Button>
                                        </td>
                                        <td>{entry.createdAt && moment(entry.createdAt).format('DD/MM/YY')}</td>
                                        <td>
                                            <ButtonGroup align='center'>
                                                {lockedEntryIds.includes(entry.id) ? (
                                                    <TailSpin height='40' width='40' color='grey' />
                                                ) : (
                                                    <>
                                                        {/*<Button
                                                            style={editButtonStyle}
                                                            onClick={() => onEditCategoryClick(category)}
                                                        >
                                                            <FaEdit />
                                                        </Button>*/}
                                                        <Button
                                                            style={deleteButtonStyle}
                                                            onClick={() => onDeleteEntry(entry.id)}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </>
                                                )}
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                {pagination && (
                    <Pagination onPageChange={goToPage} totalPages={pagination.pages || 0} />
                )}
            </Content>
        </>
    );
}

const editButtonStyle = {
    width: '40px',
    height: '40px',
    background: 'orange',
};

const deleteButtonStyle = {
    width: '40px',
    height: '40px',
    background: 'red',
};

const showButtonStyle = {
    backgroundColor: "#2FA4FF",
    color: "#fff",
    fontWeight: "600",
    height: "35px",
    width: "auto",
};