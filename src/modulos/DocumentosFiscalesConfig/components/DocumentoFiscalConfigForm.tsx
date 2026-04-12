import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Switch,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DocumentoFiscalConfig,
  DocumentoFiscalConfigRequest,
  TipoDocumentoFiscal,
} from "../types/documentosFiscalesConfig.types";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    payload: DocumentoFiscalConfigRequest,
    id?: number,
  ) => Promise<void>;
  tiposDocumento: TipoDocumentoFiscal[];
  initialData?: DocumentoFiscalConfig | null;
  loading?: boolean;
}

const defaultForm: DocumentoFiscalConfigRequest = {
  tipoDocumentoId: 0,
  sucursal: "",
  puntoExpedicion: "",
  timbrado: "",
  numeroActual: 0,
  numeroInicio: 0,
  numeroFin: 0,
  vigenciaDesde: "",
  vigenciaHasta: "",
  rucEmisor: "",
  razonSocialEmisor: "",
  direccionEmisor: "",
  activo: true,
  conceptoDocumento: "",
};

export default function DocumentoFiscalConfigForm({
  open,
  onClose,
  onSubmit,
  tiposDocumento,
  initialData,
  loading = false,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [form, setForm] = useState<DocumentoFiscalConfigRequest>(defaultForm);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        tipoDocumentoId: initialData.tipoDocumentoId,
        sucursal: initialData.sucursal,
        puntoExpedicion: initialData.puntoExpedicion,
        timbrado: initialData.timbrado,
        numeroActual: initialData.numeroActual,
        numeroInicio: initialData.numeroInicio,
        numeroFin: initialData.numeroFin,
        vigenciaDesde: initialData.vigenciaDesde?.slice(0, 10) ?? "",
        vigenciaHasta: initialData.vigenciaHasta?.slice(0, 10) ?? "",
        rucEmisor: initialData.rucEmisor,
        razonSocialEmisor: initialData.razonSocialEmisor,
        direccionEmisor: initialData.direccionEmisor,
        activo: initialData.activo,
        conceptoDocumento: initialData.conceptoDocumento,
      });
    } else {
      setForm(defaultForm);
    }
  }, [open, initialData]);

  const isValid = useMemo(() => {
    return (
      form.tipoDocumentoId > 0 &&
      form.sucursal.trim() !== "" &&
      form.puntoExpedicion.trim() !== "" &&
      form.timbrado.trim() !== "" &&
      form.numeroInicio > 0 &&
      form.numeroActual > 0 &&
      form.numeroFin > 0 &&
      form.numeroInicio <= form.numeroActual &&
      form.numeroActual <= form.numeroFin &&
      form.vigenciaDesde !== "" &&
      form.vigenciaHasta !== "" &&
      form.rucEmisor.trim() !== "" &&
      form.razonSocialEmisor.trim() !== "" &&
      form.direccionEmisor.trim() !== "" &&
      form.conceptoDocumento.trim() !== ""
    );
  }, [form]);

  const handleChange = (
    field: keyof DocumentoFiscalConfigRequest,
    value: string | number | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("Complete correctamente todos los campos obligatorios.");
      return;
    }

    if (form.vigenciaDesde > form.vigenciaHasta) {
      toast.error("La vigencia desde no puede ser mayor a la vigencia hasta.");
      return;
    }

    try {
      await onSubmit(form, initialData?.id);
      onClose();
    } catch (error: any) {
      const mensaje =
        error?.response?.data?.Errors?.[0] ||
        error?.response?.data?.Message ||
        "No se pudo guardar la configuración fiscal.";
      toast.error(mensaje);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
    >
      <DialogTitle>
        {initialData ? "Editar documento fiscal" : "Nuevo documento fiscal"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Tipo de documento"
              value={form.tipoDocumentoId}
              onChange={(e) =>
                handleChange("tipoDocumentoId", Number(e.target.value))
              }
            >
              <MenuItem value={0}>Seleccione</MenuItem>
              {tiposDocumento.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Sucursal"
              value={form.sucursal}
              onChange={(e) => handleChange("sucursal", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Punto expedición"
              value={form.puntoExpedicion}
              onChange={(e) => handleChange("puntoExpedicion", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Timbrado"
              value={form.timbrado}
              onChange={(e) => handleChange("timbrado", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={2.66}>
            <TextField
              type="number"
              fullWidth
              label="Número inicio"
              value={form.numeroInicio}
              onChange={(e) =>
                handleChange("numeroInicio", Number(e.target.value))
              }
            />
          </Grid>

          <Grid item xs={12} sm={2.66}>
            <TextField
              type="number"
              fullWidth
              label="Número actual"
              value={form.numeroActual}
              onChange={(e) =>
                handleChange("numeroActual", Number(e.target.value))
              }
            />
          </Grid>

          <Grid item xs={12} sm={2.66}>
            <TextField
              type="number"
              fullWidth
              label="Número fin"
              value={form.numeroFin}
              onChange={(e) =>
                handleChange("numeroFin", Number(e.target.value))
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              fullWidth
              label="Vigencia desde"
              InputLabelProps={{ shrink: true }}
              value={form.vigenciaDesde}
              onChange={(e) => handleChange("vigenciaDesde", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              fullWidth
              label="Vigencia hasta"
              InputLabelProps={{ shrink: true }}
              value={form.vigenciaHasta}
              onChange={(e) => handleChange("vigenciaHasta", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="RUC emisor"
              value={form.rucEmisor}
              onChange={(e) => handleChange("rucEmisor", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Razón social emisor"
              value={form.razonSocialEmisor}
              onChange={(e) =>
                handleChange("razonSocialEmisor", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección emisor"
              value={form.direccionEmisor}
              onChange={(e) => handleChange("direccionEmisor", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Concepto documento"
              value={form.conceptoDocumento}
              onChange={(e) =>
                handleChange("conceptoDocumento", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.activo}
                  onChange={(e) => handleChange("activo", e.target.checked)}
                />
              }
              label="Activo"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {initialData ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
