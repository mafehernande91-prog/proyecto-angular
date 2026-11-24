import { Router } from 'express';

import {
  obtenerEntrenamientos,
  obtenerEntrenamientoPorId,
  crearEntrenamiento,
  actualizarEntrenamiento,
  actualizarParcialEntrenamiento,
  eliminarEntrenamiento
} from '../controllers/entrenamientos.controllers';

const router = Router();

router.get('/', obtenerEntrenamientos);

router.get('/:id', obtenerEntrenamientoPorId);

router.post('/', crearEntrenamiento);

router.put('/:id', actualizarEntrenamiento);

router.patch('/:id', actualizarParcialEntrenamiento);

router.delete('/:id', eliminarEntrenamiento);

export default router;
