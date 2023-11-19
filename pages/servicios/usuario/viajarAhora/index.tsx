import CrearSolicitud, {
  SolicitudServicioInfo,
} from '@/components/SolicitudesServicios/CrearSolicitud';
import SolicitudesList from '@/components/SolicitudesServicios/SolicitudesList';
import SolicitudesPaginacion from '@/components/SolicitudesServicios/SolicitudesPaginacion';
import { ApiService } from '@/services/api.service';
import { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// Generated by https://quicktype.io

export interface ListaSolicitudesServicioResponse {
  paginationInfo: {
    totalPages: number;
    totalElements: number;
    currentPage: number;
    currentElements: number;
  };
  elements: SolicitudServicioInfo[];
}

const ViajarAhoraPage = () => {
  const [userId] = useState<string>('e9c596b2-780b-4aea-845f-855d2678a8cd');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiceTab] = useState<number>(0);
  let [apiService] = useState(new ApiService());
  const [paginacion, setPaginacion] = useState({
    page: 0,
    size: 10,
  });

  const [solicitudesServicio, setSolicitudesServicio] =
    useState<ListaSolicitudesServicioResponse>({
      paginationInfo: {
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        currentElements: 0,
      },
      elements: [],
    });

  const { paginationInfo } = solicitudesServicio;

  useEffect(() => {
    setLoading(true);
    new Promise((resolve) => {
      setTimeout(() => resolve(''), 1000);
    }).then(() => {
      const type = activeTab === 0 ? 'INMEDIATA' : 'RESERVADA';
      apiService
        .get<ListaSolicitudesServicioResponse>('/solicitudes-servicios', {
          ...paginacion,
          type,
        })
        .then((data) => {
          setSolicitudesServicio(data);
        })
        .catch((err) => {
          return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se pudo obtener las solicitudes',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [paginacion, activeTab]);

  const traerSiguientePagina = () => {
    setPaginacion((paginacion) => ({
      ...paginacion,
      page: paginacion.page + 1,
    }));
  };

  const traerAnteriorPagina = () => {
    setPaginacion((paginacion) => ({
      ...paginacion,
      page: paginacion.page - 1,
    }));
  };

  return (
    <Fragment>
      {loading ? (
        <div className='w-screen h-screen flex justify-center items-center bg-transparent'>
          <div>
            <p className='text-center'>Cargando...</p>
            <img
              src='/images/common/loading.svg'
              alt='loading'
              className='bg-white'
            />
          </div>
        </div>
      ) : (
        <div className='flex flex-row justify-evenly flex-wrap h-screen overflow-y-auto'>
          <div
            style={{ minWidth: '500px', height: '100vh', overflowY: 'auto' }}
          >
            <CrearSolicitud
              setSolicitudesServicio={setSolicitudesServicio}
              activeTab={activeTab}
            />
          </div>

          <div
            className='ml-5 overflow-y-auto h-screen w-max flex-grow'
            style={{ minWidth: '500px' }}
          >
            <SolicitudesList
              solicitudesServicio={solicitudesServicio}
              setSolicitudesServicio={setSolicitudesServicio}
              activeTab={activeTab}
              setActiceTab={setActiceTab}
            />
            {paginationInfo.totalElements > 0 && (
              <SolicitudesPaginacion
                paginationInfo={paginationInfo}
                traerSiguientePagina={traerSiguientePagina}
                traerAnteriorPagina={traerAnteriorPagina}
              />
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ViajarAhoraPage;
