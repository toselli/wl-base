export const useFormRules = (getPasswordValue) => {
  const userRules = [
    v => !!v || 'Ingrese su email',
    v => /.+@.+\..+/.test(v) || 'Ingrese un email válido'
  ];

  const oldPasswordRules = [
    v => !!v || 'Ingrese su contraseña actual',
  ]

  const passwordRules = [
    v => !!v || 'Ingrese su contraseña',
    v => !!v && v.length >= 8 || 'Su contraseña debe tener al menos 8 caracteres',
    v => /[a-z]/.test(v) || 'La contraseña debe contener al menos una letra minúscula',
    v => /[A-Z]/.test(v) || 'La contraseña debe contener al menos una letra mayúscula',
    v => /\d/.test(v) || 'La contraseña debe contener al menos un número'
  ];

  const passwordConfirmRules = () => [
    v => !!v || 'Ingrese su contraseña',
    v => v === getPasswordValue() || 'Las contraseñas no coinciden'
];


  const emailRules = [
    v => !!v || 'Ingrese un email',
    v => /.+@.+\..+/.test(v) || 'Ingrese un email válido'
  ];

  const requiredRules = [
    v => {
      if (v) return true
      return 'Este campo es requerido.'
    },
  ];

  const nameRules = [
    v => {
      if (v) return true
      if (!v.trim()) return 'El campo no puede contener solo espacios.'
      return 'Este campo es requerido.'
      
    },
  ]
  const documentRules = [
    v => !!v || 'Ingrese un documento',
    v => /^[A-Za-z0-9]{7,8}$/.test(v) || 'Ingrese un documento válido',
  ]

  const phoneRules = [
    v => {
      if (v) return true
      return 'Debe ingresar el teléfono de un pasajero para coordinar el servicio.'
    },
  ]

  const sellerRules = [
    v => {
      if (v) return true
      return 'Seleccione un agente.'
    },
  ]

  const cuitRules = [
    v => !!v || 'Ingrese un CUIT',
    v => /^\d{2}[A-Za-z0-9]{7,8}\d{1}$/.test(v) || 'Ingrese un CUIT válido',
  ]

  return {
    userRules,
    passwordRules,
    emailRules,
    requiredRules,
    passwordConfirmRules,
    oldPasswordRules,
    nameRules,
    documentRules,
    phoneRules,
    sellerRules,
    cuitRules
  };
};