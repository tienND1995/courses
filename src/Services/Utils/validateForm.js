import * as yup from 'yup'

export const validateFormRegister = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên!'),
  surname: yup
    .string()
    .required('Vui lòng nhập họ và tên đệm!')
    .min(6, 'Ít nhất 6 ký tự')
    .test(
      'Họ tên ít nhất 2 từ',
      'Họ tên ít nhất 2 từ!',
      (value) => value.split(' ').length >= 2
    ),
  number: yup
    .number()
    .typeError('Vui lòng nhập số điện thoại!')
    .required('Vui lòng nhập số điện thoại!')
    .test(
      'Ít nhất 9 chữ số',
      'Vui lòng nhập ít nhất 9 chữ số',
      (value) => value.toString().length >= 9
    ),

  email: yup
    .string()
    .email('Email không hợp lệ!')
    .required('Vui lòng nhập email!'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu!')
    .min(8, 'Mật khẩu ít nhất 8 ký tự!'),
  enterpassword: yup
    .string()
    .required('Vui lòng xác thực mật khẩu !')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp!'),
})

export const validateFormLogin = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ!')
    .required('Vui lòng nhập email!'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu!')
    .min(8, 'Mật khẩu ít nhất 8 ký tự!'),
})

export const validateFormOrder = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên!'),
  number: yup
    .number()
    .typeError('Vui lòng nhập số điện thoại!')
    .required('Vui lòng nhập số điện thoại!')
    .test(
      'Ít nhất 9 chữ số',
      'Vui lòng nhập ít nhất 9 chữ số',
      (value) => value.toString().length >= 9
    ),

  email: yup
    .string()
    .email('Email không hợp lệ!')
    .required('Vui lòng nhập email!'),
})

export const validateFormUpdateAccount = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên!'),
  surname: yup
    .string()
    .required('Vui lòng nhập họ và tên đệm!')
    .min(6, 'Ít nhất 6 ký tự')
    .test(
      'Họ tên ít nhất 2 từ',
      'Họ tên ít nhất 2 từ!',
      (value) => value.split(' ').length >= 2
    ),
  number: yup
    .number()
    .typeError('Vui lòng nhập số điện thoại!')
    .required('Vui lòng nhập số điện thoại!')
    .test(
      'Ít nhất 9 chữ số',
      'Vui lòng nhập ít nhất 9 chữ số',
      (value) => value.toString().length >= 9
    ),

  email: yup
    .string()
    .email('Email không hợp lệ!')
    .required('Vui lòng nhập email!'),
})
