import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import moment from "moment";
import { FaEdit, FaPlusSquare, FaTrash } from "react-icons/fa";
import Table from "../../../components/Table";
import { Container, Content } from "../../../components/Wrappers/Containers";
import { getTestimonies,deleteTestimonies} from "../../../services/requests/testimonials";
import Header from "../../../components/Header/BackOffice";
import { Avatar } from "../../../components/Inputs/styles";
import {
  HeaderButtons,
  AddButton,
  SectionTitle,
} from "../../../styles/BackOffice";
import Modal, { ModalBody } from "../../../components/Modal";
import Pagination from "../../../components/Pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Button, ButtonGroup } from "../../../components/Inputs";
import TestimonyEditor from "./TestimonyEditor";


function Testimonials(){


    const [testimoniasl, setTestimoniasl] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({ display: false, instance: null });
    const [pagination, setPagination] = useState({});
    const [tableLoading, setTableLoading] = useState(true);
    const resultsLimit = 10;


    useEffect(() => {
    getTestomony(currentPage);
    },[currentPage]);


    async function getTestomony(page) {
        setTableLoading(true);
        const {
          success,
          data: testimoniosData,
          errorMessage,
        } = await getTestimonies(page, resultsLimit);
        if (success) {
          const { items, ...pagination } = testimoniosData;
        
          setTestimoniasl(items);
          setPagination(pagination);
        } else {
          toast.error("Error al obtener testimonios: " + errorMessage);
        }
        setTableLoading(false);
      }

      //PAGINATION
  async function goToPage(page) {
    setCurrentPage(page);
    getTestomony(page);
  }

  //SHOW COVER
  function showEntryPicture(url) {
    Swal.fire({
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Cerrar",
      imageUrl: url,
      imageAlt: "Entry image",
    });
  }

  //SHOW TEXT
  function showEntryContent(content) {
    Swal.fire({
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Cerrar",
      title: "Texto slider",
      text: content,
    });
  }

  //CREATE SLIDER
  function onCreate() {
    setFormData({
      display: true,
      instance: null,
    });
  }

  //UPDATE SLIDER
  function onEdit(instance) {
    setFormData({
      display: true,
      instance: instance,
    });
  }

  //HIDE MODE
  function hideForm() {
    setFormData({
      display: false,
      instance: null,
    });
  }

  //CHANGE PAGE
  function onUpdated() {
    hideForm();
    getTestomony(currentPage);
  }

  //DELETE SLIDER
  async function onDelete(id) {
    const result = await Swal.fire({
      title: "Confirmar eliminación",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      icon: "warning",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "red",
    });

    if (result.isConfirmed) {
      const { success } = await deleteTestimonies(id);
      if (success) {
        getTestomony(currentPage);
      } else {
        toast.error("Error al eliminar Sliders");
      }
    }
  }



    return(

        <Container>
        <Toaster />
        <Header />
        <Modal size="sm" show={formData.display} onClose={() => hideForm()}>
          <ModalBody>
           <TestimonyEditor
           data={formData.instance}
           onSuccess={() => onUpdated()}
           />
          </ModalBody>
        </Modal>
        <Content>
          <SectionTitle>Testimonios</SectionTitle>
          <HeaderButtons>
            <AddButton
              onClick={() => {
                onCreate();
              }}
              style={{ background: "green" }}
            >
              <FaPlusSquare /> <b>Crear</b>
            </AddButton>
          </HeaderButtons>
          <>
            <Table>
              <thead>
                <tr>
                  <th width="10%">Imagen</th>
                  <th width="20%">Nombre</th>
                  <th width="20%">Content</th>
                  <th width="20%">Fecha de Creación</th>
                  <th width="20%">Fecha de Actualizacion</th>
                  <th width="10%">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {testimoniasl.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>
                        {tableLoading ? (
                          <AvatarSkeleton />
                        ) : (
                          <AvatarWithSkeleton
                            src={item.image}
                            onClick={() => showEntryPicture(item.image)}
                          />
                        )}
                      </td>
                      <td>
                        {tableLoading && !item.text ? <Skeleton /> : item.name}
                      </td>

                      <td onClick={() => showEntryContent(item.content)}>
                        {tableLoading && !item.text ? <Skeleton /> : item.content}
                      </td>
                      <td>
                        {tableLoading && !item.createdAt ? (
                          <Skeleton />
                        ) : (
                          moment(item.createdAt).format("DD/MM/yyyy")
                        )}
                      </td>
                      <td>
                        {tableLoading && !item.createdAt ? (
                          <Skeleton />
                        ) : (
                          moment(item.updatedAt).format("DD/MM/yyyy")
                        )}
                      </td>
                      <td>
                        <ButtonGroup align="center" gap="8px">
                          <Button
                            style={buttonStyles("orange")}
                            onClick={() => onEdit(item)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            style={buttonStyles("red")}
                            onClick={() => onDelete(item.id)}
                          >
                            <FaTrash />
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {pagination && (
              <Pagination
                onPageChange={goToPage}
                totalPages={pagination.pages || 0}
              />
            )}
          </>
        </Content>
      </Container>

    )

}

function buttonStyles(color) {
    return {
      width: "40px",
      height: "40px",
      background: color,
    };
  }
  
  function AvatarSkeleton() {
    return <Skeleton circle={true} width="45px" height="45px" />;
  }
  
  function AvatarWithSkeleton(props) {
    const [loaded, setLoaded] = useState(false);
    return (
      <>
        <Avatar
          {...props}
          onLoad={() => setLoaded(true)}
          style={loaded ? {} : { display: "none" }}
        />
        {!loaded && <AvatarSkeleton />}
      </>
    );
  }


export default Testimonials;